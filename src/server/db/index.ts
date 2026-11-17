import * as schema from "./schema";

export function getRawClient() {
  getDb();
  return (globalThis as any).__qbitx_raw_client;
}

export function getDb() {
  const g = globalThis as any;
  if (g.__qbitx_db_instance) return g.__qbitx_db_instance;

  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === "production" && process.env.ALLOW_PGLITE_TEST !== "true";

  // Production Enforcement: Strict Neon PostgreSQL requirement
  if (isProduction) {
    if (!databaseUrl || databaseUrl.includes("sample-pooler")) {
      throw new Error(
        "FATAL: Missing or invalid DATABASE_URL for production environment. Neon PostgreSQL connection string is strictly required. Embedded PGlite fallback is prohibited in production."
      );
    }

    // Production Neon PostgreSQL
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon(databaseUrl);
    g.__qbitx_raw_client = sql;
    g.__qbitx_db_instance = drizzle(sql, { schema });
    return g.__qbitx_db_instance;
  }

  // Development / Test Environments: Use remote Neon if configured
  if (databaseUrl && !databaseUrl.includes("sample-pooler")) {
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon(databaseUrl);
    g.__qbitx_raw_client = sql;
    g.__qbitx_db_instance = drizzle(sql, { schema });
    return g.__qbitx_db_instance;
  }

  // Explicit Local Development & Test: Embedded PostgreSQL via PGlite
  const { PGlite } = require("@electric-sql/pglite");
  const { drizzle } = require("drizzle-orm/pglite");

  if (!g.__qbitx_pglite_client) {
    g.__qbitx_pglite_client = new PGlite(process.env.NODE_ENV === "test" ? undefined : "./.local-db");
  }
  g.__qbitx_raw_client = g.__qbitx_pglite_client;
  g.__qbitx_db_instance = drizzle(g.__qbitx_pglite_client, { schema });
  return g.__qbitx_db_instance;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const activeDb = getDb();
    const val = activeDb[prop];
    return typeof val === "function" ? val.bind(activeDb) : val;
  },
});

export { schema };
