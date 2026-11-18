import { describe, it, expect, beforeAll } from "vitest";
import { ensureDemoAccounts, DEMO_ACCOUNTS } from "@/server/auth/demo-accounts";
import { ensureDbSchema } from "@/server/db/init";
import { auth } from "@/server/auth";
import { POST, GET } from "@/app/api/auth/demo-login/route";
import { NextRequest } from "next/server";

describe("Demo Authentication & Provisioning Test Suite", () => {
  beforeAll(async () => {
    process.env.ALLOW_PGLITE_TEST = "true";
    await ensureDbSchema();
    await ensureDemoAccounts();
  });

  it("provisions all 3 demo accounts with correct roles and password123", async () => {
    for (const [roleKey, config] of Object.entries(DEMO_ACCOUNTS)) {
      const signInRes = await auth.api.signInEmail({
        body: {
          email: config.email,
          password: config.password,
        },
      });

      expect(signInRes.user).toBeDefined();
      expect(signInRes.user.email).toBe(config.email);
      expect(signInRes.token).toBeDefined();
      if (roleKey === "admin") {
        expect(["admin", "super_admin"]).toContain(signInRes.user.role);
      } else {
        expect(signInRes.user.role).toBe(config.role);
      }
    }
  });

  it("POST /api/auth/demo-login authenticates and sets session cookie for student, mentor, admin", async () => {
    for (const role of ["student", "mentor", "admin"] as const) {
      const req = new NextRequest("http://localhost:3000/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user).toBeDefined();
      expect(json.redirectUrl).toBe(DEMO_ACCOUNTS[role].redirectUrl);

      const cookie = res.headers.get("set-cookie");
      expect(cookie).toBeTruthy();
      expect(cookie).toContain("better-auth.session_token");
    }
  });

  it("GET /api/auth/demo-login?role=mentor redirects with session cookie", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/demo-login?role=mentor", {
      method: "GET",
    });

    const res = await GET(req);
    expect([302, 307]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/mentor/dashboard");

    const cookie = res.headers.get("set-cookie");
    expect(cookie).toBeTruthy();
    expect(cookie).toContain("better-auth.session_token");
  });
});
