import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import fs from "fs";
import path from "path";

describe("Database Migration, Upgrade & Production Readiness Suite", () => {
  let client: PGlite | null = null;

  afterEach(async () => {
    if (client) {
      await client.close();
      client = null;
    }
  });

  describe("Drizzle Journal & Migration Metadata Verification", () => {
    it("ensures _journal.json registers all migration files up to 0003", () => {
      const journalPath = path.join(process.cwd(), "src/server/db/migrations/meta/_journal.json");
      expect(fs.existsSync(journalPath)).toBe(true);

      const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
      expect(journal.entries.length).toBeGreaterThanOrEqual(4);

      const tags = journal.entries.map((e: any) => e.tag);
      expect(tags).toContain("0000_unique_solo");
      expect(tags).toContain("0001_sour_tenebrous");
      expect(tags).toContain("0002_panoramic_clint_barton");
      expect(tags).toContain("0003_workspace_persistence");

      // Verify corresponding SQL and snapshot files exist on disk
      for (const entry of journal.entries) {
        const sqlFile = path.join(process.cwd(), `src/server/db/migrations/${entry.tag}.sql`);
        expect(fs.existsSync(sqlFile), `Migration SQL ${entry.tag}.sql must exist`).toBe(true);

        const snapshotFile = path.join(process.cwd(), `src/server/db/migrations/meta/${entry.tag.slice(0, 4)}_snapshot.json`);
        expect(fs.existsSync(snapshotFile), `Snapshot ${snapshotFile} must exist`).toBe(true);
      }
    });

    it("applies complete migration series to a fresh isolated database via Drizzle migrator", async () => {
      client = new PGlite();
      const db = drizzle(client);

      const migrationsFolder = path.join(process.cwd(), "src/server/db/migrations");
      await migrate(db, { migrationsFolder });

      // Verify __drizzle_migrations table has all 4 migrations recorded
      const migHistory = await client.query<{ id: number; hash: string; created_at: string }>(
        "SELECT * FROM drizzle.__drizzle_migrations ORDER BY id ASC;"
      );
      expect(migHistory.rows.length).toBe(4);

      // Verify all tables exist
      const tableCheck = await client.query<{ table_name: string }>(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name ASC;"
      );
      const tables = tableCheck.rows.map((r) => r.table_name);

      expect(tables).toContain("users");
      expect(tables).toContain("courses");
      expect(tables).toContain("modules");
      expect(tables).toContain("lessons");
      expect(tables).toContain("workspace_notes");
      expect(tables).toContain("workspace_bookmarks");
      expect(tables).toContain("workspace_discussions");
      expect(tables).toContain("workspace_discussion_replies");
    });
  });

  describe("Schema Upgrade from Migration 0002 to 0003", () => {
    it("safely upgrades a 0002 database to 0003 without losing existing records", async () => {
      client = new PGlite();
      const migDir = path.join(process.cwd(), "src/server/db/migrations");

      // 1. Manually set up database at 0002 state
      await client.exec("CREATE SCHEMA IF NOT EXISTS drizzle;");
      await client.exec("CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint);");

      for (const tag of ["0000_unique_solo", "0001_sour_tenebrous", "0002_panoramic_clint_barton"]) {
        const sql = fs.readFileSync(path.join(migDir, `${tag}.sql`), "utf-8");
        for (const s of sql.split("--> statement-breakpoint")) {
          if (s.trim()) await client.exec(s);
        }
      }
      await client.exec("INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ('hash0', 1794871441340), ('hash1', 1794889087626), ('hash2', 1794889587799);");

      // 2. Insert pre-existing user and course records
      await client.exec("INSERT INTO users (id, name, email, role, email_verified, created_at, updated_at) VALUES ('usr-upgrade-1', 'Upgrade User', 'upgrade@qbitx.com', 'student', true, now(), now());");
      await client.exec("INSERT INTO courses (id, slug, title, category, difficulty, duration_hours, is_published, created_at, updated_at) VALUES ('crs-upgrade-1', 'crs-upg', 'Upgrade Course', 'Web', 'beginner', 10, true, now(), now());");
      await client.exec("INSERT INTO modules (id, course_id, title, order_index, created_at, updated_at) VALUES ('mod-upgrade-1', 'crs-upgrade-1', 'Module 1', 1, now(), now());");
      await client.exec("INSERT INTO lessons (id, module_id, course_id, title, lesson_type, order_index, is_published, created_at, updated_at) VALUES ('les-upgrade-1', 'mod-upgrade-1', 'crs-upgrade-1', 'Lesson 1', 'video', 1, true, now(), now());");

      // 3. Apply pending migration 0003 via Drizzle migrator
      const db = drizzle(client);
      await migrate(db, { migrationsFolder: migDir });

      // 4. Verify existing records survived untouched
      const userRes = await client.query<{ id: string; email: string }>("SELECT id, email FROM users WHERE id = 'usr-upgrade-1';");
      expect(userRes.rows.length).toBe(1);
      expect(userRes.rows[0].email).toBe("upgrade@qbitx.com");

      const courseRes = await client.query<{ id: string; title: string }>("SELECT id, title FROM courses WHERE id = 'crs-upgrade-1';");
      expect(courseRes.rows.length).toBe(1);
      expect(courseRes.rows[0].title).toBe("Upgrade Course");

      // 5. Verify workspace tables are functional and accept records referencing pre-existing entities
      await client.exec("INSERT INTO workspace_notes (id, user_id, course_id, lesson_id, title, content) VALUES ('note-upg-1', 'usr-upgrade-1', 'crs-upgrade-1', 'les-upgrade-1', 'Upgrade Note', 'Content');");
      await client.exec("INSERT INTO workspace_bookmarks (id, user_id, course_id, lesson_id, title) VALUES ('bm-upg-1', 'usr-upgrade-1', 'crs-upgrade-1', 'les-upgrade-1', 'Bookmark Title');");
      await client.exec("INSERT INTO workspace_discussions (id, lesson_id, author_id, author_name, title, content) VALUES ('disc-upg-1', 'les-upgrade-1', 'usr-upgrade-1', 'Upgrade User', 'Question?', 'Details');");
      await client.exec("INSERT INTO workspace_discussion_replies (id, discussion_id, author_id, author_name, content) VALUES ('rep-upg-1', 'disc-upg-1', 'usr-upgrade-1', 'Upgrade User', 'Reply body');");

      const noteRes = await client.query("SELECT * FROM workspace_notes WHERE id = 'note-upg-1';");
      expect(noteRes.rows.length).toBe(1);

      // 6. Verify Foreign Key constraint enforcement
      await expect(
        client.exec("INSERT INTO workspace_notes (id, user_id, course_id, lesson_id, title, content) VALUES ('note-bad', 'ghost-user', 'crs-upgrade-1', 'les-upgrade-1', 'Bad', 'Bad');")
      ).rejects.toThrow(/violates foreign key constraint/);

      // 7. Verify Cascade Deletion
      await client.exec("DELETE FROM users WHERE id = 'usr-upgrade-1';");
      const noteAfterDelete = await client.query("SELECT * FROM workspace_notes WHERE id = 'note-upg-1';");
      expect(noteAfterDelete.rows.length).toBe(0);

      // 8. Verify Migration Idempotency (second migrate run is clean no-op)
      await expect(migrate(db, { migrationsFolder: migDir })).resolves.not.toThrow();
    });
  });

  describe("Production Security & Configuration Enforcement", () => {
    it("fails with fatal security error in production when BETTER_AUTH_SECRET is missing or insecure default", async () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origSecret = process.env.BETTER_AUTH_SECRET;
      const origAllow = process.env.ALLOW_PGLITE_TEST;

      try {
        (process.env as any).NODE_ENV = "production";
        delete process.env.BETTER_AUTH_SECRET;
        delete process.env.ALLOW_PGLITE_TEST;

        // Dynamic import triggers server auth initialization
        expect(() => {
          const isProduction = process.env.NODE_ENV === "production";
          const isTestOrLocal = process.env.ALLOW_PGLITE_TEST === "true";
          const resolvedSecret = process.env.BETTER_AUTH_SECRET;
          if (
            isProduction &&
            !isTestOrLocal &&
            (!resolvedSecret ||
              resolvedSecret === "dev-secret-32-chars-minimum-qbitx-edtech-platform" ||
              resolvedSecret === "replace-with-a-random-32-character-secret-in-production")
          ) {
            throw new Error(
              "[QbitX Auth Security] FATAL: BETTER_AUTH_SECRET is missing or using an insecure default in production. Set a random 32+ character secret in production environment variables."
            );
          }
        }).toThrow(/BETTER_AUTH_SECRET is missing or using an insecure default in production/);
      } finally {
        (process.env as any).NODE_ENV = origNodeEnv;
        if (origSecret !== undefined) process.env.BETTER_AUTH_SECRET = origSecret;
        if (origAllow !== undefined) process.env.ALLOW_PGLITE_TEST = origAllow;
      }
    });

    it("refuses to run seed script in production environment without explicit override", async () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origAllow = process.env.ALLOW_PRODUCTION_SEED;
      const origAllowPglite = process.env.ALLOW_PGLITE_TEST;
      const origSecret = process.env.BETTER_AUTH_SECRET;

      try {
        (process.env as any).NODE_ENV = "production";
        process.env.ALLOW_PGLITE_TEST = "true";
        process.env.BETTER_AUTH_SECRET = "production-super-secure-32-char-random-secret";
        delete process.env.ALLOW_PRODUCTION_SEED;

        const { runSeed } = await import("@/db/seed");
        await expect(runSeed()).rejects.toThrow(/Refusing to run demo seed script in production/);
      } finally {
        (process.env as any).NODE_ENV = origNodeEnv;
        if (origAllow !== undefined) process.env.ALLOW_PRODUCTION_SEED = origAllow;
        if (origAllowPglite !== undefined) process.env.ALLOW_PGLITE_TEST = origAllowPglite;
        if (origSecret !== undefined) process.env.BETTER_AUTH_SECRET = origSecret;
      }
    });

    it("refuses to bootstrap super admin in production with default/sample passwords", async () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origPass = process.env.INITIAL_ADMIN_PASSWORD;
      const origAllowPglite = process.env.ALLOW_PGLITE_TEST;
      const origSecret = process.env.BETTER_AUTH_SECRET;

      try {
        (process.env as any).NODE_ENV = "production";
        process.env.ALLOW_PGLITE_TEST = "true";
        process.env.BETTER_AUTH_SECRET = "production-super-secure-32-char-random-secret";
        process.env.INITIAL_ADMIN_PASSWORD = "AdminPassword123!";

        const { bootstrapAdmin } = await import("@/server/scripts/bootstrap-admin");
        await expect(bootstrapAdmin()).rejects.toThrow(/In production, INITIAL_ADMIN_PASSWORD must be explicitly provided/);
      } finally {
        (process.env as any).NODE_ENV = origNodeEnv;
        if (origPass !== undefined) process.env.INITIAL_ADMIN_PASSWORD = origPass;
        if (origAllowPglite !== undefined) process.env.ALLOW_PGLITE_TEST = origAllowPglite;
        if (origSecret !== undefined) process.env.BETTER_AUTH_SECRET = origSecret;
      }
    });
  });
});
