const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Email field is visible and accepts email', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find email field
  const emailInput = page.locator(
    'input[type="email"], input[name="email"]'
  ).first();

  // Check email field is visible
  await expect(emailInput).toBeVisible();

  // Check email field is enabled
  await expect(emailInput).toBeEnabled();

  // Enter email
  await emailInput.fill('test@example.com');

  // Verify email was entered
  await expect(emailInput).toHaveValue('test@example.com');

  // Take screenshot
  await page.screenshot({
    path: 'test-results/email-field.png',
    fullPage: true
  });
});
