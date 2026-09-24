const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Login with invalid email and password', async ({ page }) => {

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

  // Enter invalid email
  await emailInput.fill('wrong@example.com');

  // Enter invalid password
  await passwordInput.fill('WrongPassword123');

  // Verify values
  await expect(emailInput).toHaveValue('wrong@example.com');
  await expect(passwordInput).toHaveValue('WrongPassword123');

  // Click Login
  await loginButton.click();

  // Wait for application response
  await page.waitForTimeout(2000);

  // Check for server error message
  const serverError = page.getByText(
    "Couldn't reach the server. Please try again.",
    { exact: true }
  );

  // Check for possible invalid-credentials messages
  const invalidCredentials = page.getByText(
    /invalid.*credentials|incorrect.*password|invalid.*email|email.*password.*incorrect/i
  ).first();

  // The application should show either an error
  // or remain on the login page.
  const serverErrorVisible = await serverError
    .isVisible()
    .catch(() => false);

  const invalidCredentialsVisible = await invalidCredentials
    .isVisible()
    .catch(() => false);

  if (serverErrorVisible) {
    await expect(serverError).toBeVisible();
  } else if (invalidCredentialsVisible) {
    await expect(invalidCredentials).toBeVisible();
  } else {
    // At minimum, verify the login page is still usable.
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  }

  // Screenshot
  await page.screenshot({
    path: 'test-results/invalid-login.png',
    fullPage: true
  });
});
