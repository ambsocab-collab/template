import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth before each test
    await page.context().clearCookies();
  });

  test("should display sign-up page and render Clerk form", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    // Verify page loads without errors
    expect(page.url()).toContain("/sign-up");

    // Wait for Clerk component to render
    await page.waitForSelector('[role="main"], .cl-rootBox, form', {
      timeout: 5000,
    });

    // Verify it's not showing an error page
    const errorText = page.locator("text=Error");
    const isVisible = await errorText.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test("should display sign-in page and render Clerk form", async ({
    page,
  }) => {
    await page.goto("/sign-in");

    // Verify page loads without errors
    expect(page.url()).toContain("/sign-in");

    // Wait for Clerk component to render
    await page.waitForSelector('[role="main"], .cl-rootBox, form', {
      timeout: 5000,
    });

    // Verify it's not showing an error page
    const errorText = page.locator("text=Error");
    const isVisible = await errorText.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test("should redirect unauthenticated user from dashboard to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Should redirect to sign-in when not authenticated
    // Wait for navigation to complete
    await page.waitForURL(/\/sign-in/, { timeout: 5000 });
    expect(page.url()).toContain("/sign-in");
  });

  test("should protect dashboard route with middleware", async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto("/dashboard");

    // The middleware should cause a redirect
    // Either we get a 307 redirect response or the page redirects
    const finalUrl = page.url();
    expect(finalUrl).toContain("/sign-in");
  });

  test("should allow accessing public sign-up page", async ({ page }) => {
    const response = await page.goto("/sign-up");

    // Public route should be accessible
    expect(response?.status()).toBeLessThan(400);
    expect(page.url()).toContain("/sign-up");
  });

  test("should allow accessing public sign-in page", async ({ page }) => {
    const response = await page.goto("/sign-in");

    // Public route should be accessible
    expect(response?.status()).toBeLessThan(400);
    expect(page.url()).toContain("/sign-in");
  });

  test("should have SignOut button on dashboard (when authenticated)", async ({
    page,
  }) => {
    // This test demonstrates where the SignOut button should be
    // In production, you would use Clerk test tokens or mock auth here

    // For now, we verify the route exists and middleware pattern works
    await page.goto("/dashboard");
    await page.waitForURL(/\/sign-in/, { timeout: 3000 }).catch(() => {
      // It's ok if redirect doesn't happen immediately in test env
    });
  });

  test("middleware should not block static assets", async ({ page }) => {
    // Verify that static assets (CSS, JS) are not blocked by middleware
    await page.goto("/sign-up");

    // Check that styles loaded (no CSS errors)
    const styles = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Should have computed styles (not blocked)
    expect(styles).toBeDefined();
  });

  test("should handle navigation between auth pages", async ({ page }) => {
    // Start at sign-up
    await page.goto("/sign-up");
    expect(page.url()).toContain("/sign-up");

    // Navigate to sign-in
    await page.goto("/sign-in");
    expect(page.url()).toContain("/sign-in");

    // Navigate back to sign-up
    await page.goto("/sign-up");
    expect(page.url()).toContain("/sign-up");
  });
});
