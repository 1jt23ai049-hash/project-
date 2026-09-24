const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Create account navigation works', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find Create an account link
  const createAccountLink = page.getByText(
    /Create an account/i
  ).first();

  // Check link is visible
  await expect(createAccountLink).toBeVisible();

  // Click Create an account
  await createAccountLink.click();

  // Wait for navigation
  await page.waitForLoadState('domcontentloaded');

  // Verify URL changed from login page
  await expect(page).not.toHaveURL(/\/auth\/login$/);

  // Verify page loaded
  await expect(page.locator('body')).toBeVisible();

  // Take screenshot
  await page.screenshot({
    path: 'test-results/create-account.png',
    fullPage: true
  });
});
