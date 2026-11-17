import { test, expect } from "@playwright/test";

test.describe("Administrator End-to-End Browser Journey", () => {
  const ensureAdminLoggedIn = async (page: any) => {
    await page.goto("/admin/dashboard");
    await page.waitForLoadState("domcontentloaded");
    if (page.url().includes("/login")) {
      await page.fill('input[type="email"]', "admin@qbitx.com");
      await page.fill('input[type="password"]', "AdminPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForURL("**/admin/dashboard", { timeout: 15000 });
    }
  };

  test("1. Admin Login & Access Enforcement", async ({ page, context }) => {
    await page.goto("/login/student");
    await page.waitForLoadState("domcontentloaded");

    if (!page.url().includes("/admin/dashboard")) {
      await page.fill('input[type="email"]', "admin@qbitx.com");
      await page.fill('input[type="password"]', "AdminPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForURL("**/admin/dashboard", { timeout: 15000 });
    }

    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Verify session cookie exists
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name.includes("better-auth.session_token") || c.name.includes("session")
    );
    expect(sessionCookie).toBeDefined();
  });

  test("2. Admin Course Management & Oversight", async ({ page }) => {
    await ensureAdminLoggedIn(page);

    // Navigate to courses management
    await page.goto("/admin/courses");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/courses/);
  });

  test("3. Admin User Management View", async ({ page }) => {
    await ensureAdminLoggedIn(page);

    // Navigate to user management
    await page.goto("/admin/users");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/users/);
  });

  test("4. Admin Audit Logs Inspection", async ({ page }) => {
    await ensureAdminLoggedIn(page);

    // Navigate to audit log viewer
    await page.goto("/admin/audit");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/audit/);
  });
});
