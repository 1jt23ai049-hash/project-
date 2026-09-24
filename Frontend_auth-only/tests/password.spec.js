const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Password field is visible and accepts password', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find password field
  const passwordInput = page.locator(
    'input[type="password"], input[name="password"]'
  ).first();

  // Check password field is visible
  await expect(passwordInput).toBeVisible();

  // Check password field is enabled
  await expect(passwordInput).toBeEnabled();

  // Check password field type
  await expect(passwordInput).toHaveAttribute(
    'type',
    'password'
  );

  // Enter password
  await passwordInput.fill('Test@123');

  // Verify password was entered
  await expect(passwordInput).toHaveValue('Test@123');

  // Take screenshot
  await page.screenshot({
    path: 'test-results/password-field.png',
    fullPage: true
  });
});
