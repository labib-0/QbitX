import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const dbMock = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("@/server/db", () => ({ db: dbMock }));

import { GET } from "@/app/api/health/db/route";
import { internalErrorResponse } from "@/server/http/api-error";

describe("GET /api/health/db", () => {
  beforeEach(() => {
    dbMock.execute.mockReset();
  });

  it("reports reachable when the database answers", async () => {
    dbMock.execute.mockResolvedValue([{ "?column?": 1 }]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.database).toBe("reachable");
    expect(typeof body.latencyMs).toBe("number");
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("returns a generic 503 without leaking connection details", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    dbMock.execute.mockRejectedValue(
      new Error("connect ECONNREFUSED postgresql://neondb_owner:supersecret@db.example.com/neondb")
    );

    const res = await GET();
    const text = JSON.stringify(await res.json());

    expect(res.status).toBe(503);
    expect(text).toContain("unreachable");
    expect(text).not.toMatch(/postgresql:\/\//i);
    expect(text).not.toMatch(/ECONNREFUSED/i);
    expect(text).not.toMatch(/supersecret/i);
    expect(text).not.toMatch(/db\.example\.com/i);

    // The real failure is still logged for operators.
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("internalErrorResponse", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("returns a generic 500 and never echoes the internal error", async () => {
    const res = internalErrorResponse(
      new Error("FATAL: Missing DATABASE_URL postgresql://user:pass@host/db"),
      "/api/test"
    );
    const body = await res.json();
    const text = JSON.stringify(body);

    expect(res.status).toBe(500);
    expect(body.error).toBe("An unexpected server error occurred. Please try again.");
    expect(text).not.toMatch(/postgresql:\/\//i);
    expect(text).not.toMatch(/FATAL/i);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
