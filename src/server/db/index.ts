import * as schema from "./schema";

let dbInstance: any = null;
let rawClientInstance: any = null;

export function getRawClient() {
  getDb();
  return rawClientInstance;
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === "production";

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
    rawClientInstance = sql;
    dbInstance = drizzle(sql, { schema });
    return dbInstance;
  }

  // Development / Test Environments: Use remote Neon if configured
  if (databaseUrl && !databaseUrl.includes("sample-pooler")) {
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon(databaseUrl);
    rawClientInstance = sql;
    dbInstance = drizzle(sql, { schema });
    return dbInstance;
  }

  // Explicit Local Development & Test: Embedded PostgreSQL via PGlite
  const { PGlite } = require("@electric-sql/pglite");
  const { drizzle } = require("drizzle-orm/pglite");

  const client = new PGlite(process.env.NODE_ENV === "test" ? undefined : "./.local-db");
  rawClientInstance = client;
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const activeDb = getDb();
    const val = activeDb[prop];
    return typeof val === "function" ? val.bind(activeDb) : val;
  },
});

export { schema };
