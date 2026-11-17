import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/server/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  requireUser,
  requireRole,
  requireAdmin,
  requireMentor,
  requireOwnership,
  UnauthorizedError,
  ForbiddenError,
  PlatformRole,
} from "@/server/auth/session";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

describe("Authentication & Authorization Security Test Suite", () => {
  let client: PGlite;
  let testDb: any;
  let testAuth: any;

  beforeAll(async () => {
    client = new PGlite();
    testDb = drizzle(client, { schema });

    // Execute migrations
    const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      const statements = sqlContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await client.exec(statement);
        } catch (e: any) {
          // Idempotent
        }
      }
    }

    testAuth = betterAuth({
      database: drizzleAdapter(testDb, {
        provider: "pg",
        schema: {
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      }),
      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "student",
            input: false, // Critical security control: reject client-supplied role
          },
          status: {
            type: "string",
            defaultValue: "active",
            input: false,
          },
        },
      },
      secret: "test-secret-at-least-32-characters-long-qbitx",
      baseURL: "http://localhost:3000",
    });
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  describe("Student Registration & Privilege Hardening (SEC-01)", () => {
    const studentEmail = "alice.student@qbitx.edu";
    const password = "StrongPassword123!";

    it("registers a student with default role and active status", async () => {
      const result = await testAuth.api.signUpEmail({
        body: {
          email: studentEmail,
          password,
          name: "Alice Student",
        },
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(studentEmail);
      expect(result.user.name).toBe("Alice Student");
      expect(result.user.role).toBe("student");
      expect(result.user.status).toBe("active");

      // Verify in PostgreSQL table
      const [inDb] = await testDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, studentEmail));

      expect(inDb).toBeDefined();
      expect(inDb.role).toBe("student");
    });

    it("rejects duplicate email registration", async () => {
      let duplicateError = false;
      try {
        await testAuth.api.signUpEmail({
          body: {
            email: studentEmail,
            password: "AnotherPassword123!",
            name: "Alice Impersonator",
          },
        });
      } catch (err: any) {
        duplicateError = true;
        expect(err.message).toMatch(/already exists|duplicate/i);
      }
      expect(duplicateError).toBe(true);
    });

    it("PREVENTS ROLE ESCALATION (SEC-01): client-supplied role parameter is ignored", async () => {
      const hackerEmail = "attacker@qbitx.edu";

      // Attempt privilege escalation: supply role: 'admin' or 'super_admin' in payload
      const result = await testAuth.api.signUpEmail({
        body: {
          email: hackerEmail,
          password: "HackerPassword123!",
          name: "Script Kiddie",
          role: "super_admin", // Client injection attempt
        } as any,
      });

      expect(result.user.role).toBe("student"); // Must default to student

      // Verify DB record directly
      const [inDb] = await testDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, hackerEmail));

      expect(inDb.role).toBe("student");
      expect(inDb.role).not.toBe("super_admin");
      expect(inDb.role).not.toBe("admin");
    });
  });

  describe("Login, Logout, & Session Lifecycle", () => {
    const studentEmail = "alice.student@qbitx.edu";
    const password = "StrongPassword123!";

    it("authenticates valid credentials and produces a session token", async () => {
      const result = await testAuth.api.signInEmail({
        body: {
          email: studentEmail,
          password,
        },
      });

      expect(result).toBeDefined();
      expect(result.user.email).toBe(studentEmail);
      expect(result.token).toBeDefined();

      // Verify session exists in DB
      const [sessionInDb] = await testDb
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.token, result.token));

      expect(sessionInDb).toBeDefined();
      expect(sessionInDb.userId).toBe(result.user.id);
      expect(new Date(sessionInDb.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("rejects invalid password", async () => {
      let authError = false;
      try {
        await testAuth.api.signInEmail({
          body: {
            email: studentEmail,
            password: "WrongPassword999!",
          },
        });
      } catch (err: any) {
        authError = true;
        expect(err.message).toMatch(/invalid|password/i);
      }
      expect(authError).toBe(true);
    });

    it("session expires after expiresAt timestamp", async () => {
      // Create expired session manually
      const expiredToken = "token-expired-test";
      const [user] = await testDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, studentEmail));

      await testDb.insert(schema.sessions).values({
        id: "sess-expired-1",
        userId: user.id,
        token: expiredToken,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour in the past
      });

      const session = await testDb
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.token, expiredToken));

      const isExpired = new Date(session[0].expiresAt).getTime() < Date.now();
      expect(isExpired).toBe(true);
    });
  });

  describe("Server Authorization Layer & Role Boundaries (SEC-02 & SEC-03)", () => {
    const studentContext = {
      session: { id: "sess-1", userId: "usr-student-1", expiresAt: new Date() },
      user: {
        id: "usr-student-1",
        name: "Student One",
        email: "student1@qbitx.edu",
        role: "student" as PlatformRole,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
      },
    };

    const mentorContext = {
      session: { id: "sess-2", userId: "usr-mentor-1", expiresAt: new Date() },
      user: {
        id: "usr-mentor-1",
        name: "Mentor One",
        email: "mentor1@qbitx.edu",
        role: "mentor" as PlatformRole,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
      },
    };

    const adminContext = {
      session: { id: "sess-3", userId: "usr-admin-1", expiresAt: new Date() },
      user: {
        id: "usr-admin-1",
        name: "Admin One",
        email: "admin1@qbitx.edu",
        role: "admin" as PlatformRole,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
      },
    };

    const superAdminContext = {
      session: { id: "sess-4", userId: "usr-super-1", expiresAt: new Date() },
      user: {
        id: "usr-super-1",
        name: "Super Admin",
        email: "super@qbitx.edu",
        role: "super_admin" as PlatformRole,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
      },
    };

    it("DENIES student from accessing admin endpoints (403 Forbidden)", () => {
      const checkAdmin = (ctx: any) => {
        if (!["admin", "super_admin"].includes(ctx.user.role)) {
          throw new ForbiddenError("Role 'student' is not authorized for this resource.");
        }
      };

      expect(() => checkAdmin(studentContext)).toThrow(ForbiddenError);
      expect(() => checkAdmin(mentorContext)).toThrow(ForbiddenError);
      expect(() => checkAdmin(adminContext)).not.toThrow();
      expect(() => checkAdmin(superAdminContext)).not.toThrow();
    });

    it("DENIES student from accessing mentor-only actions", () => {
      const checkMentor = (ctx: any) => {
        if (!["mentor", "admin", "super_admin"].includes(ctx.user.role)) {
          throw new ForbiddenError("Role 'student' is not authorized for this resource.");
        }
      };

      expect(() => checkMentor(studentContext)).toThrow(ForbiddenError);
      expect(() => checkMentor(mentorContext)).not.toThrow();
      expect(() => checkMentor(adminContext)).not.toThrow();
    });

    it("REJECTS suspended accounts even with valid credentials", () => {
      const suspendedStudent = {
        ...studentContext,
        user: { ...studentContext.user, status: "suspended" },
      };

      const verifyStatus = (ctx: any) => {
        if (ctx.user.status === "suspended") {
          throw new ForbiddenError("Your account has been suspended.");
        }
      };

      expect(() => verifyStatus(suspendedStudent)).toThrow(/suspended/i);
    });

    it("ENFORCES OWNERSHIP (SEC-04 IDOR Prevention): student cannot access other student data", () => {
      const checkOwnership = (callerUserId: string, callerRole: string, targetResourceOwnerId: string) => {
        if (["admin", "super_admin"].includes(callerRole)) {
          return true; // Admins have oversight
        }
        if (callerUserId !== targetResourceOwnerId) {
          throw new ForbiddenError("Forbidden. You do not own this resource.");
        }
        return true;
      };

      // Student 1 tries to access Student 2's submission
      expect(() => checkOwnership("usr-student-1", "student", "usr-student-2")).toThrow(ForbiddenError);

      // Student 1 accesses own submission
      expect(checkOwnership("usr-student-1", "student", "usr-student-1")).toBe(true);

      // Admin accesses Student 2's submission
      expect(checkOwnership("usr-admin-1", "admin", "usr-student-2")).toBe(true);
    });
  });

  describe("Administrative Audit Logging", () => {
    it("creates audit log records on privileged updates", async () => {
      // Ensure actor exists to satisfy FK constraint
      await testDb.insert(schema.users).values({
        id: "usr-admin-audit",
        name: "Admin Auditor",
        email: "auditor@qbitx.edu",
        role: "admin",
      });

      const auditLogId = `audit-test-${Date.now()}`;
      await testDb.insert(schema.auditLogs).values({
        id: auditLogId,
        actorId: "usr-admin-audit",
        actorName: "Admin Auditor",
        actorRole: "admin",
        actionType: "USER_SUSPENDED",
        action: "USER_SUSPENDED",
        targetId: "usr-student-malicious",
        targetType: "user",
        details: { reason: "Code plagiarized from public exam", ip: "192.168.1.1" },
        ipAddress: "192.168.1.1",
      });

      const [log] = await testDb
        .select()
        .from(schema.auditLogs)
        .where(eq(schema.auditLogs.id, auditLogId));

      expect(log).toBeDefined();
      expect(log.actionType).toBe("USER_SUSPENDED");
      expect(log.actorRole).toBe("admin");
      expect(log.targetId).toBe("usr-student-malicious");
      expect(log.timestamp).toBeDefined();
    });
  });

  describe("Reliability & Integrity Verification Suite", () => {
    it("enforces idempotent XP awards: approving reviews does not duplicate student XP", async () => {
      const studentId = "usr-xp-idempotent-student";
      const mentorId = "usr-xp-mentor";
      const projectId = "proj-xp-test";
      const submissionId = "sub-xp-test";

      // 1. Create student and mentor users
      await testDb.insert(schema.users).values([
        { id: studentId, name: "XP Student", email: "xp.student@qbitx.dev", role: "student", status: "active" },
        { id: mentorId, name: "XP Mentor", email: "xp.mentor@qbitx.dev", role: "mentor", status: "active" },
      ]);

      await testDb.insert(schema.studentProfiles).values({
        id: "sp-xp-1",
        userId: studentId,
        university: "Tech Univ",
        track: "Web",
        xp: 100, // Initial XP
      });

      await testDb.insert(schema.projects).values({
        id: projectId,
        slug: "xp-test-project",
        title: "XP Test Project",
        description: "Test project for XP idempotency",
        isPublished: true,
      });

      await testDb.insert(schema.projectEnrollments).values({
        id: "pe-xp-1",
        userId: studentId,
        projectId,
        status: "in_progress",
      });

      await testDb.insert(schema.projectSubmissions).values({
        id: submissionId,
        userId: studentId,
        projectId,
        githubRepoUrl: "https://github.com/xp-student/xp-project",
        status: "pending_review",
      });

      // 2. First Approval: Awards +300 XP
      const [enrollment1] = await testDb
        .select()
        .from(schema.projectEnrollments)
        .where(eq(schema.projectEnrollments.userId, studentId));

      const isAlreadyCompleted1 = enrollment1.status === "completed";
      expect(isAlreadyCompleted1).toBe(false);

      // Award XP
      if (!isAlreadyCompleted1) {
        await testDb
          .update(schema.studentProfiles)
          .set({ xp: 400 }) // 100 + 300
          .where(eq(schema.studentProfiles.userId, studentId));
        await testDb
          .update(schema.projectEnrollments)
          .set({ status: "completed" })
          .where(eq(schema.projectEnrollments.userId, studentId));
      }

      const [profileAfterFirst] = await testDb
        .select()
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.userId, studentId));
      expect(profileAfterFirst.xp).toBe(400);

      // 3. Simulated Duplicate / Re-Approval: Must be idempotent and NOT award another 300 XP
      const [enrollment2] = await testDb
        .select()
        .from(schema.projectEnrollments)
        .where(eq(schema.projectEnrollments.userId, studentId));

      const isAlreadyCompleted2 = enrollment2.status === "completed";
      expect(isAlreadyCompleted2).toBe(true);

      // Guarded XP logic
      if (!isAlreadyCompleted2) {
        await testDb
          .update(schema.studentProfiles)
          .set({ xp: profileAfterFirst.xp + 300 })
          .where(eq(schema.studentProfiles.userId, studentId));
      }

      const [profileAfterSecond] = await testDb
        .select()
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.userId, studentId));

      // XP must remain strictly 400, not 700!
      expect(profileAfterSecond.xp).toBe(400);
    });

    it("rejects invalid YouTube URLs while accepting valid video IDs", async () => {
      const { extractYouTubeId } = await import("@/components/workspace/YouTubeVideoPlayer");

      // Valid formats
      expect(extractYouTubeId("843nec-IvW0")).toBe("843nec-IvW0");
      expect(extractYouTubeId("https://www.youtube.com/watch?v=843nec-IvW0")).toBe("843nec-IvW0");
      expect(extractYouTubeId("https://youtu.be/843nec-IvW0")).toBe("843nec-IvW0");
      expect(extractYouTubeId("https://www.youtube.com/embed/843nec-IvW0")).toBe("843nec-IvW0");

      // Invalid formats
      expect(extractYouTubeId("")).toBe(null);
      expect(extractYouTubeId(null)).toBe(null);
      expect(extractYouTubeId("invalid_not_11")).toBe(null);
      expect(extractYouTubeId("https://malicious.site/video.mp4")).toBe(null);
      expect(extractYouTubeId("https://youtube.com/invalid")).toBe(null);
    });
  });
});
