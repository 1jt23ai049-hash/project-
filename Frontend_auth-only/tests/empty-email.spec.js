const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Login with empty email', async ({ page }) => {

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

  // Check fields and button are visible
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();

  // Leave email empty
  await emailInput.fill('');

  // Enter password
  await passwordInput.fill('Test@123');

  // Verify email is empty
  await expect(emailInput).toHaveValue('');

  // Click Login
  await loginButton.click();

  // Check email field
  // If the application uses HTML required validation,
  // the email field should be invalid.
  const required = await emailInput.getAttribute('required');

  if (required !== null) {
    const isValid = await emailInput.evaluate(
      element => element.validity.valid
    );

    expect(isValid).toBe(false);
  }

  // Make sure email is still empty
  await expect(emailInput).toHaveValue('');

  // Screenshot
  await page.screenshot({
    path: 'test-results/empty-email.png',
    fullPage: true
  });
});
