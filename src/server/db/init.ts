import fs from "fs";
import path from "path";
import { getRawClient } from "./index";

export async function ensureDbSchema() {
  const client = getRawClient();

  if (client && typeof client.exec === "function") {
    try {
      const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");
      if (fs.existsSync(migrationsDir)) {
        const files = fs
          .readdirSync(migrationsDir)
          .filter((f) => f.endsWith(".sql"))
          .sort();

        for (const file of files) {
          const sqlPath = path.join(migrationsDir, file);
          const sqlContent = fs.readFileSync(sqlPath, "utf-8");
          const statements = sqlContent
            .split("--> statement-breakpoint")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

          for (const statement of statements) {
            try {
              await client.exec(statement);
            } catch (err: any) {
              // Ignore benign idempotency errors during re-runs
              if (
                !err.message?.includes("already exists") &&
                !err.message?.includes("duplicate")
              ) {
                // Ignore harmless re-apply notices
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to run local embedded DB migrations:", e);
    }
  }
}
