/**
 * scripts/bootstrap-demo.ts
 *
 * Bootstraps demo accounts (Student, Mentor, Admin) and seeds
 * demo courses and curriculum tracks into the database.
 */
import { ensureDemoAccounts } from "../src/server/auth/demo-accounts";
import { runSeed } from "../src/db/seed";

async function main() {
  console.log("[QbitX Bootstrap] Ensuring demo accounts (Student, Mentor, Admin)...");
  await ensureDemoAccounts();
  console.log("[QbitX Bootstrap] Demo accounts ensured with password: password123");

  try {
    process.env.ALLOW_PRODUCTION_SEED = "true";
    await runSeed();
    console.log("[QbitX Bootstrap] Platform curriculum and student mock data seeded successfully.");
  } catch (err: any) {
    console.warn("[QbitX Bootstrap] Seed warning (non-fatal):", err.message);
  }
}

main()
  .then(() => {
    console.log("[QbitX Bootstrap] Completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[QbitX Bootstrap] Fatal error:", err);
    process.exit(1);
  });
