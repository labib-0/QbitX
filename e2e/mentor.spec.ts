import { test, expect } from "@playwright/test";

test.describe("Mentor End-to-End Browser Journey", () => {
  test("1. Mentor Login & Dashboard Authentication", async ({ page, context }) => {
    await page.goto("/login/mentor");
    await page.waitForLoadState("domcontentloaded");

    // Check title
    await expect(page.locator("h2")).toContainText("Welcome Back, Mentor");

    // Login with mentor credentials
    await page.fill('input[type="email"]', "sarah.chen@qbitx.com");
    await page.fill('input[type="password"]', "MentorPassword123!");
    await page.click('button[type="submit"]');

    // Wait for mentor dashboard redirect
    await page.waitForURL("**/mentor/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL(/\/mentor\/dashboard/);

    // Verify session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name.includes("better-auth.session_token") || c.name.includes("session")
    );
    expect(sessionCookie).toBeDefined();
  });

  test("2. Mentor Navigation & Project Review Workspace", async ({ page }) => {
    // Authenticate
    await page.goto("/login/mentor");
    await page.fill('input[type="email"]', "sarah.chen@qbitx.com");
    await page.fill('input[type="password"]', "MentorPassword123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/mentor/dashboard", { timeout: 15000 });

    // Navigate to mentor projects review page
    await page.goto("/mentor/projects");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1, h2, h3").filter({ hasText: /project|submission/i }).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("3. Course Authoring Studio Access", async ({ page }) => {
    await page.goto("/login/mentor");
    await page.fill('input[type="email"]', "sarah.chen@qbitx.com");
    await page.fill('input[type="password"]', "MentorPassword123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/mentor/dashboard", { timeout: 15000 });

    // Navigate to builder
    await page.goto("/mentor/builder");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveURL(/\/mentor\/builder/);
  });
});
