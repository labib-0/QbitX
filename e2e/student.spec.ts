import { test, expect } from "@playwright/test";

test.describe("Student End-to-End Browser Journey", () => {
  const uniqueEmail = `student.e2e.${Date.now()}@university.edu`;
  const password = "StudentSecurePass123!";

  test("1. Student Registration & Duplicate Email Rejection", async ({ page }) => {
    await page.goto("/register/student");
    await page.waitForLoadState("domcontentloaded");

    // Verify page title
    await expect(page.locator("h2")).toContainText("Hello There");

    // Fill registration form using semantic input types/names
    await page.fill('input[name="name"]', "Aria E2E Student");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', "1712345678");
    await page.fill('input[name="password"]', password);

    // Submit registration
    await page.click('button[type="submit"]');

    // Verify registration success (SuccessModal appears)
    const successModal = page.locator("text=Registration Successful");
    await expect(successModal).toBeVisible({ timeout: 10000 });

    // Try duplicate registration with the same email
    await page.goto("/register/student");
    await page.waitForLoadState("domcontentloaded");
    await page.fill('input[name="name"]', "Aria E2E Student");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', "1712345678");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Expect duplicate error message / rejection
    const errorAlert = page.locator(".text-red-500, .bg-red-500\\/10, [role='alert']");
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test("2. Email Verification Page & Token Validation Handling", async ({ page }) => {
    // 1. Visit verification landing page
    await page.goto(`/verify-email?email=${encodeURIComponent(uniqueEmail)}`);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h3")).toContainText("Check Your Email Inbox");
    await expect(page.locator("button:has-text('Resend Verification Email')")).toBeVisible();

    // 2. Visit with invalid verification token - ensure rejection
    await page.goto("/verify-email?token=invalid_expired_token_12345");
    await expect(page.locator("text=invalid or expired")).toBeVisible({ timeout: 10000 });
  });

  test("3. Student Login & Session Cookie Establishment", async ({ page, context }) => {
    await page.goto("/login/student");
    await page.waitForLoadState("domcontentloaded");

    await page.fill('input[type="email"]', "student@qbitx.com");
    await page.fill('input[type="password"]', "StudentPassword123!");
    await page.click('button[type="submit"]');

    // Verify redirect to student dashboard
    await page.waitForURL("**/student/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL(/\/student\/dashboard/);

    // Verify session cookie is set in browser context
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name.includes("better-auth.session_token") || c.name.includes("session")
    );
    expect(sessionCookie).toBeDefined();
  });

  test("4. Student Onboarding Workflow", async ({ page }) => {
    // Log in first
    await page.goto("/login/student");
    await page.fill('input[type="email"]', "student@qbitx.com");
    await page.fill('input[type="password"]', "StudentPassword123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/student/dashboard", { timeout: 15000 });

    // Navigate to onboarding
    await page.goto("/onboarding");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("text=Welcome to QbitX!")).toBeVisible();

    // Step 1 -> Step 2
    await page.click("button:has-text('Next Step')");
    await expect(page.locator("text=Select Your Learning Goals")).toBeVisible();

    // Step 2 -> Step 3
    await page.click("button:has-text('Next Step')");
    await expect(page.locator("text=Weekly Commitment")).toBeVisible();

    // Step 3 -> Step 4
    await page.click("button:has-text('Next Step')");
    await expect(page.locator("text=Select Your Dream Career Target")).toBeVisible();

    // Complete Onboarding
    await page.click("button:has-text('Save & Continue to Dashboard')");
    await page.waitForURL("**/student/dashboard**", { timeout: 10000 });
  });

  test("5. Video Lesson Workspace & YouTube Embed Verification", async ({ page }) => {
    // Authenticate first so middleware permits workspace access
    await page.goto("/login/student");
    await page.fill('input[type="email"]', "student@qbitx.com");
    await page.fill('input[type="password"]', "StudentPassword123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/student/dashboard", { timeout: 15000 });

    // Direct workspace navigation with active course & lesson
    await page.goto("/student/workspace?courseId=crs-ai-web-eng&lessonId=les-c1-l1");
    await page.waitForLoadState("domcontentloaded");

    // Check workspace title
    await expect(page.locator("text=Next.js App Router Architecture")).toBeVisible({ timeout: 10000 });

    // Check YouTube iframe embed with privacy nocookie URL
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible({ timeout: 10000 });
    const src = await iframe.getAttribute("src");
    expect(src).toContain("youtube-nocookie.com/embed/843nec-IvW0");
  });

  test("6. Student Public Portfolio & Responsive Rendering", async ({ page }) => {
    await page.goto("/portfolio/alexrivera");
    await page.waitForLoadState("domcontentloaded");

    // Check public portfolio displays student info
    await expect(page.locator("text=Alex Rivera")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Full-Stack Web & AI Engineering")).toBeVisible();

    // Responsive verification: verify page doesn't produce horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin for rounding
  });
});
