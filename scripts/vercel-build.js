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

if (vercelEnv === "production" && isUsableDatabase) {
  console.log("[qbitx-build] Applying database migrations...");
  // Fails the deployment on error rather than shipping a schema-less app.
  run("npx --no-install drizzle-kit migrate");
} else if (vercelEnv === "production") {
  console.warn(
    "[qbitx-build] DATABASE_URL is not configured. Skipping migrations; " +
      "database-backed routes will return 500 until it is set in Vercel."
  );
}

run("npx --no-install next build");
