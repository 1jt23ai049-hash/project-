const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Login button is visible and enabled', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find Login button
  const loginButton = page.getByRole('button', {
    name: /log\s*in|login|sign\s*in/i
  }).first();

  // Check Login button is visible
  await expect(loginButton).toBeVisible();

  // Check Login button is enabled
  await expect(loginButton).toBeEnabled();

  // Take screenshot
  await page.screenshot({
    path: 'test-results/login-button.png',
    fullPage: true
  });
})
