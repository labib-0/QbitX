#!/usr/bin/env node
/**
 * Vercel production build wrapper.
 *
 * Applies pending Drizzle migrations before `next build` when a usable
 * production database is configured. Vercel does not run migrations itself,
 * so without this a green deployment still has no tables and every
 * registration/login attempt fails with a 500.
 */
const { execSync } = require("node:child_process");

const vercelEnv = process.env.VERCEL_ENV || "";
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const isUsableDatabase =
  Boolean(databaseUrl) && !databaseUrl.includes("sample-pooler");

function run(command) {
  console.log(`[qbitx-build] $ ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

if (vercelEnv === "production") {
  const authSecret = process.env.BETTER_AUTH_SECRET || "";
  if (!authSecret || authSecret.includes("replace-with-a-random") || authSecret.includes("dev-secret")) {
    console.error(
      "[qbitx-build] FATAL: BETTER_AUTH_SECRET must be set to a secure, random 32+ character secret in production Vercel environment variables."
    );
    process.exit(1);
  }
}

if (vercelEnv === "production" && isUsableDatabase) {
  console.log("[qbitx-build] Applying database migrations...");
  // Fails the deployment on error rather than shipping a schema-less app.
  run("npx --no-install drizzle-kit migrate");
  console.log("[qbitx-build] Bootstrapping demo accounts and curriculum seed...");
  try {
    run("npx tsx scripts/bootstrap-demo.ts");
  } catch (seedErr) {
    console.warn("[qbitx-build] Warning: bootstrap demo seed encountered non-fatal error:", seedErr.message);
  }
} else if (vercelEnv === "production") {
  console.error(
    "[qbitx-build] DATABASE_URL is required for production deployments. " +
      "Set DATABASE_URL and DATABASE_URL_UNPOOLED in Vercel, then redeploy."
  );
  // Fail the deployment: a green production build with no database is a
  // broken application (registration/login return 500).
  process.exit(1);
}

run("npx --no-install next build");
