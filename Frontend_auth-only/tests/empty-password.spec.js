const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Login with empty password', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find email field
  const emailInput = page.locator(
    'input[type="email"], input[name="email"]'
  ).first();

  // Find password field
  const passwordInput = page.locator(
    'input[type="password"], input[name="password"]'
  ).first();

  // Find Login button
  const loginButton = page.getByRole('button', {
    name: /log\s*in|login|sign\s*in/i
  }).first();

  // Check elements are visible
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();

  // Enter email
  await emailInput.fill('test@example.com');

  // Leave password empty
  await passwordInput.fill('');

  // Verify password is empty
  await expect(passwordInput).toHaveValue('');

  // Click Login
  await loginButton.click();

  // Check HTML required validation if present
  const required = await passwordInput.getAttribute('required');

  if (required !== null) {
    const isValid = await passwordInput.evaluate(
      element => element.validity.valid
    );

    expect(isValid).toBe(false);
  }

  // Verify password is still empty
  await expect(passwordInput).toHaveValue('');

  // Take screenshot
  await page.screenshot({
    path: 'test-results/empty-password.png',
    fullPage: true
  });
});
