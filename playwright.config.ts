import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // Run sequentially for database state consistency
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 45000,
  use: {
    baseURL: "http://localhost:3007",
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Responsive",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npx next start -p 3007",
    url: "http://localhost:3007/login",
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      ALLOW_PGLITE_TEST: "true",
    },
  },
});
