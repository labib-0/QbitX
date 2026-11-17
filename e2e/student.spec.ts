import { test, expect } from "@playwright/test";

test.describe("Student End-to-End Browser Journey", () => {
  const password = "StudentSecurePass123!";

  const ensureStudentLoggedIn = async (page: any) => {
    await page.goto("/student/dashboard");
    await page.waitForLoadState("domcontentloaded");
    if (page.url().includes("/login")) {
      await page.fill('input[type="email"]', "student@qbitx.com");
      await page.fill('input[type="password"]', "StudentPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForURL("**/student/dashboard", { timeout: 15000 });
    }
  };

  test("1. Student Registration & Duplicate Email Rejection", async ({ page, context }) => {
    await context.clearCookies();
    const regEmail = `student.e2e.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@university.edu`;

    await page.goto("/register/student");
    await page.waitForLoadState("domcontentloaded");

    // Verify page title
    await expect(page.locator("h2")).toContainText("Hello There");

    // Fill registration form using semantic input types/names
    await page.fill('input[name="name"]', "Aria E2E Student");
    await page.fill('input[name="email"]', regEmail);
    await page.fill('input[name="phone"]', "1712345678");
    await page.fill('input[name="password"]', password);
    await page.check('input[name="acceptTerms"]');

    // Submit registration
    await page.click('button[type="submit"]');

    // Verify registration success (SuccessModal appears)
    const successModal = page.locator("text=Registration Successful");
    await expect(successModal).toBeVisible({ timeout: 10000 });

    // Try duplicate registration with the same email after clearing session
    await context.clearCookies();
    await page.goto("/register/student");
    await page.waitForLoadState("domcontentloaded");
    await page.fill('input[name="name"]', "Aria E2E Student");
    await page.fill('input[name="email"]', regEmail);
    await page.fill('input[name="phone"]', "1712345678");
    await page.fill('input[name="password"]', password);
    await page.check('input[name="acceptTerms"]');
    await page.click('button[type="submit"]');

    // Expect duplicate error message / rejection
    const errorAlert = page.locator(".text-red-500, .bg-red-500\\/10, [role='alert']");
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test("2. Email Verification Page & Token Validation Handling", async ({ page }) => {
    const verifyEmail = `verify.${Date.now()}@university.edu`;
    // 1. Visit verification landing page
    await page.goto(`/verify-email?email=${encodeURIComponent(verifyEmail)}`);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: "Check Your Email Inbox" })).toBeVisible();
    await expect(page.locator("button:has-text('Resend Verification Email')")).toBeVisible();

    // 2. Visit with invalid verification token - ensure rejection
    await page.goto("/verify-email?token=invalid_expired_token_12345");
    await expect(page.locator("text=invalid or expired")).toBeVisible({ timeout: 10000 });
  });

  test("3. Student Login & Session Cookie Establishment", async ({ page, context }) => {
    await page.goto("/login/student");
    await page.waitForLoadState("domcontentloaded");

    if (!page.url().includes("/student/dashboard")) {
      await page.fill('input[type="email"]', "student@qbitx.com");
      await page.fill('input[type="password"]', "StudentPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForURL("**/student/dashboard", { timeout: 15000 });
    }

    await expect(page).toHaveURL(/\/student\/dashboard/);

    // Verify session cookie is set in browser context
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (c) => c.name.includes("better-auth.session_token") || c.name.includes("session")
    );
    expect(sessionCookie).toBeDefined();
  });

  test("4. Student Onboarding Workflow", async ({ page }) => {
    await ensureStudentLoggedIn(page);

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
    await ensureStudentLoggedIn(page);

    // Navigate to valid seeded lesson workspace
    await page.goto("/student/workspace?courseId=crs-ai-web-eng&lessonId=les-c1-1");
    await page.waitForLoadState("domcontentloaded");

    // Check workspace title
    await expect(page.locator("text=Next.js App Router Architecture").first()).toBeVisible({ timeout: 10000 });

    // Check YouTube iframe embed with privacy nocookie URL
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute("src");
    expect(src).toContain("youtube-nocookie.com");
  });

  test("6. Student Public Portfolio & Responsive Rendering", async ({ page }) => {
    await page.goto("/portfolio/alexrivera");
    await page.waitForLoadState("domcontentloaded");

    // Check public portfolio displays student info
    await expect(page.locator("text=Alex Rivera").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Full-Stack Web & AI Engineering").first()).toBeVisible({ timeout: 10000 });

    // Responsive verification: verify page doesn't produce horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin for rounding
  });
});
