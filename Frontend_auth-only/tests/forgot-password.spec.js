
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';


// ==========================================
// TEST 1: LOGIN PAGE - CHECK EMAIL FIELD
// ==========================================

test('Login page email field is visible', async ({ page }) => {

  // Open Login page directly
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Verify Login page
  await expect(page).toHaveURL(/\/auth\/login/);

  // Find email field
  const emailInput = page.locator(
    'input[type="email"], input[name="email"]'
  ).first();

  // Verify email field is visible
  await expect(emailInput).toBeVisible();
});


// ==========================================
// TEST 2: FORGOT PASSWORD LINK
// ==========================================

test('Forgot Password link opens reset page', async ({ page }) => {

  // Open Login page directly
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find Forgot Password link
  const forgotPassword = page.getByText(
    /forgot password/i
  ).first();

  // Verify Forgot Password is visible
  await expect(forgotPassword).toBeVisible();

  // Click Forgot Password
  await forgotPassword.click();

  // Wait for navigation/page update
  await page.waitForLoadState('domcontentloaded').catch(() => {});

  // Verify page is still visible
  await expect(page.locator('body')).toBeVisible();

  // Make sure we are no longer on the login page
  await expect(page).not.toHaveURL(/\/auth\/login$/);

});


// ==========================================
// TEST 3: FORGOT PASSWORD ACCEPTS EMAIL
// ==========================================

test('Forgot Password accepts valid email', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Click Forgot Password
  const forgotPassword = page.getByText(
    /forgot password/i
  ).first();

  await expect(forgotPassword).toBeVisible();

  await forgotPassword.click();

  // Find email field
  const emailInput = page.locator(
    'input[type="email"], input[name="email"]'
  ).first();

  // Verify email field
  await expect(emailInput).toBeVisible();

  // Enter valid email
  await emailInput.fill('test@example.com');

  // Verify entered value
  await expect(emailInput).toHaveValue(
    'test@example.com'
  );

});

test('Forgot Password invalid email validation', async ({ page }) => {

  // Open Login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Find Forgot Password link
  const forgotPassword = page.getByText(
    /forgot password/i
  ).first();

  await expect(forgotPassword).toBeVisible();

  // Open Forgot Password page
  await forgotPassword.click();

  // Find email field
  const emailInput = page.locator(
    'input[type="email"], input[name="email"]'
  ).first();

  await expect(emailInput).toBeVisible();

  // Enter invalid email
  await emailInput.fill('wrongemail');

  // Verify value
  await expect(emailInput).toHaveValue('wrongemail');

  // Find reset/send button
  const submitButton = page.getByRole('button', {
    name: /send|reset|submit/i
  }).first();

  await expect(submitButton).toBeVisible();

  // Click button
  await submitButton.click();

  // Wait briefly for validation message
  await page.waitForTimeout(500);

  // Check that an error/validation message appears
  const errorMessage = page.getByText(
    /invalid email|enter a valid email|valid email|email is invalid/i
  ).first();

  // If custom validation message exists, verify it
  if (await errorMessage.count() > 0) {
    await expect(errorMessage).toBeVisible();
  } else {
    // Otherwise check native browser validation
    const validationMessage = await emailInput.evaluate(
      element => element.validationMessage
    );

    expect(validationMessage.length).toBeGreaterThan(0);
  }

  // Screenshot
  await page.screenshot({
    path: 'test-results/forgot-password-invalid-email.png',
    fullPage: true
  });

});
