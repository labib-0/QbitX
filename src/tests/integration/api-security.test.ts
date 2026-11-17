import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

// Session enforcement is mocked per-test; the database is real (PGlite) so the
// conversation-ownership query is exercised for real.
const authMocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  requireRole: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock("@/server/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/session")>();
  return { ...actual, ...authMocks };
});

import { getRawClient, db, schema } from "@/server/db";
import {
  UnauthorizedError,
  ForbiddenError,
} from "@/server/auth/session";
import { resolveContentRole } from "@/server/auth/content-role";
import { POST as chatPost, GET as chatGet } from "@/app/api/ai/chat/route";
import { POST as codeReviewPost } from "@/app/api/ai/code-review/route";
import { POST as automationEventPost } from "@/app/api/automation/events/route";
import { GET as automationRulesGet } from "@/app/api/automation/rules/route";
import { GET as automationJobsGet, POST as automationJobsPost } from "@/app/api/automation/jobs/route";

const OWNER_ID = "user-owner";
const INTRUDER_ID = "user-intruder";
const CONVERSATION_ID = "conv-owned-by-owner";
const SECRET_MESSAGE = "Owner-only private conversation content";

function jsonRequest(url: string, method: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function sessionFor(userId: string, role = "student") {
  return {
    session: { id: `sess-${userId}` },
    user: {
      id: userId,
      name: userId,
      email: `${userId}@qbitx.test`,
      role,
      status: "active",
    },
  };
}

async function readJson(response: Response) {
  return response.json() as Promise<any>;
}

describe("API authorization regressions", () => {
  beforeAll(async () => {
    // Real PostgreSQL-compatible schema in embedded PGlite.
    const client = getRawClient();
    const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");

    for (const file of fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      const statements = sqlContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await client.exec(statement);
        } catch (err: any) {
          if (
            !err.message?.includes("already exists") &&
            !err.message?.includes("duplicate")
          ) {
            throw err;
          }
        }
      }
    }

    await db.insert(schema.users).values([
      {
        id: OWNER_ID,
        name: "Conversation Owner",
        email: "owner@qbitx.test",
        role: "student",
      },
      {
        id: INTRUDER_ID,
        name: "Other Student",
        email: "intruder@qbitx.test",
        role: "student",
      },
    ]);

    await db.insert(schema.aiConversations).values({
      id: CONVERSATION_ID,
      userId: OWNER_ID,
      title: "Private owner conversation",
    });

    await db.insert(schema.aiMessages).values({
      id: "msg-owner-1",
      conversationId: CONVERSATION_ID,
      role: "user",
      content: SECRET_MESSAGE,
    });
  });

  afterAll(async () => {
    const client = getRawClient();
    if (client && typeof client.close === "function") {
      await client.close();
    }
    const g = globalThis as any;
    delete g.__qbitx_db_instance;
    delete g.__qbitx_raw_client;
    delete g.__qbitx_pglite_client;
  });

  beforeEach(() => {
    authMocks.requireUser.mockReset();
    authMocks.requireRole.mockReset();
    authMocks.requireAdmin.mockReset();
  });

  describe("AI routes require an authenticated session", () => {
    it("rejects anonymous POST /api/ai/chat with 401", async () => {
      authMocks.requireUser.mockRejectedValue(new UnauthorizedError());

      const res = await chatPost(
        jsonRequest("http://localhost/api/ai/chat", "POST", { prompt: "Explain Big-O" })
      );

      expect(res.status).toBe(401);
      const body = await readJson(res);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/authentication required/i);
    });

    it("rejects anonymous GET /api/ai/chat with 401", async () => {
      authMocks.requireUser.mockRejectedValue(new UnauthorizedError());

      const res = await chatGet(
        jsonRequest("http://localhost/api/ai/chat", "GET")
      );

      expect(res.status).toBe(401);
    });

    it("rejects anonymous POST /api/ai/code-review with 401", async () => {
      authMocks.requireUser.mockRejectedValue(new UnauthorizedError());

      const res = await codeReviewPost(
        jsonRequest("http://localhost/api/ai/code-review", "POST", {
          code: "const answer = 42;",
          language: "typescript",
        })
      );

      expect(res.status).toBe(401);
    });

    it("rejects suspended users with 403", async () => {
      authMocks.requireUser.mockRejectedValue(
        new ForbiddenError("Your account has been suspended.")
      );

      const res = await chatPost(
        jsonRequest("http://localhost/api/ai/chat", "POST", { prompt: "hello" })
      );

      expect(res.status).toBe(403);
    });
  });

  describe("AI conversation ownership", () => {
    it("returns 404 (not another user's messages) for a conversation owned by someone else", async () => {
      authMocks.requireUser.mockResolvedValue(sessionFor(INTRUDER_ID));

      const res = await chatGet(
        jsonRequest(
          `http://localhost/api/ai/chat?conversationId=${CONVERSATION_ID}`,
          "GET"
        )
      );

      expect(res.status).toBe(404);
      const body = await readJson(res);
      expect(body.success).toBe(false);
      expect(JSON.stringify(body)).not.toContain(SECRET_MESSAGE);
    });

    it("allows the owner to read their own conversation", async () => {
      authMocks.requireUser.mockResolvedValue(sessionFor(OWNER_ID));

      const res = await chatGet(
        jsonRequest(
          `http://localhost/api/ai/chat?conversationId=${CONVERSATION_ID}`,
          "GET"
        )
      );

      expect(res.status).toBe(200);
      const body = await readJson(res);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].content).toBe(SECRET_MESSAGE);
    });

    it("refuses to append a message to another user's conversation", async () => {
      authMocks.requireUser.mockResolvedValue(sessionFor(INTRUDER_ID));

      const res = await chatPost(
        jsonRequest("http://localhost/api/ai/chat", "POST", {
          prompt: "Injected prompt",
          conversationId: CONVERSATION_ID,
        })
      );

      expect(res.status).toBe(404);

      const stored = await db
        .select()
        .from(schema.aiMessages)
        .where(eq(schema.aiMessages.conversationId, CONVERSATION_ID));

      expect(stored).toHaveLength(1);
      expect(stored[0].content).toBe(SECRET_MESSAGE);
    });
  });

  describe("Automation routes require administrator privileges", () => {
    it("rejects anonymous POST /api/automation/events with 401", async () => {
      authMocks.requireRole.mockRejectedValue(new UnauthorizedError());

      const res = await automationEventPost(
        jsonRequest("http://localhost/api/automation/events", "POST", {
          eventType: "USER_SUSPENDED",
        })
      );

      expect(res.status).toBe(401);
    });

    it("rejects non-admin automation event publishing with 403", async () => {
      authMocks.requireRole.mockRejectedValue(new ForbiddenError());

      const res = await automationEventPost(
        jsonRequest("http://localhost/api/automation/events", "POST", {
          eventType: "USER_SUSPENDED",
          actorRole: "super_admin",
        })
      );

      expect(res.status).toBe(403);
    });

    it("rejects anonymous GET /api/automation/rules with 401", async () => {
      authMocks.requireAdmin.mockRejectedValue(new UnauthorizedError());

      const res = await automationRulesGet();
      expect(res.status).toBe(401);
    });

    it("rejects non-admin GET /api/automation/rules with 403", async () => {
      authMocks.requireAdmin.mockRejectedValue(new ForbiddenError());

      const res = await automationRulesGet();
      expect(res.status).toBe(403);
    });

    it("rejects anonymous GET and POST /api/automation/jobs with 401", async () => {
      authMocks.requireAdmin.mockRejectedValue(new UnauthorizedError());

      const getRes = await automationJobsGet();
      expect(getRes.status).toBe(401);

      const postRes = await automationJobsPost();
      expect(postRes.status).toBe(401);
    });

    it("rejects non-admin job execution with 403", async () => {
      authMocks.requireAdmin.mockRejectedValue(new ForbiddenError());

      const res = await automationJobsPost();
      expect(res.status).toBe(403);
    });
  });

  describe("Content roles are derived from the session, never query params", () => {
    it("treats anonymous and suspended visitors as students", () => {
      expect(resolveContentRole(null)).toBe("student");
      expect(
        resolveContentRole({
          user: { id: "u1", role: "student", status: "active" },
        } as any)
      ).toBe("student");
      expect(
        resolveContentRole({
          user: { id: "u1", role: "mentor", status: "suspended" },
        } as any)
      ).toBe("student");
    });

    it("elevates only genuine mentor/admin sessions", () => {
      expect(
        resolveContentRole({
          user: { id: "u2", role: "mentor", status: "active" },
        } as any)
      ).toBe("mentor");
      expect(
        resolveContentRole({
          user: { id: "u3", role: "super_admin", status: "active" },
        } as any)
      ).toBe("admin");
    });
  });
});
