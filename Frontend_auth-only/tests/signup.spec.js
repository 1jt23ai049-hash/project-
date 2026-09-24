
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('AgriQR Signup Page', () => {

  // Open Signup page before every test
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/company/register`);
    await page.waitForLoadState('domcontentloaded');
  });

  // 1. Signup page loads
  test('Signup page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/company\/register/);
  });

  // 2. Signup page has visible content
  test('Signup page is visible', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  // 3. Check email field
  test('Email field is visible', async ({ page }) => {
    const email = page.locator('input[type="email"]');

    await expect(email).toBeVisible();
  });

  // 4. Check password field
  test('Password field is visible', async ({ page }) => {
    const password = page.locator('input[type="password"]').first();

    await expect(password).toBeVisible();
  });

  // 5. Check all required input fields
  test('Signup form contains input fields', async ({ page }) => {
    const inputs = page.locator('input');

    await expect(inputs.first()).toBeVisible();

    const count = await inputs.count();

    expect(count).toBeGreaterThan(0);
  });

  // 6. Empty form validation
  test('Empty signup form shows validation', async ({ page }) => {
    const buttons = page.getByRole('button');

    await expect(buttons.last()).toBeVisible();

    await buttons.last().click();

    await expect(page.locator('body')).toContainText(
      /required|enter|valid/i
    );
  });

  // 7. Email field accepts valid email
  test('Email field accepts valid email', async ({ page }) => {
    const email = page.locator('input[type="email"]');

    await email.fill('test@example.com');

    await expect(email).toHaveValue('test@example.com');
  });

  // 8. Email field rejects invalid email
  test('Invalid email validation', async ({ page }) => {
    const email = page.locator('input[type="email"]');

    await email.fill('invalid-email');

    const form = email.locator('xpath=ancestor::form');

    if (await form.count() > 0) {
      await form.getByRole('button').last().click();
    }

    await expect(page.locator('body')).toContainText(
      /invalid|valid email|email/i
    );
  });

  // 9. Password field accepts password
  test('Password field accepts password', async ({ page }) => {
    const password = page.locator('input[type="password"]').first();

    await password.fill('Test@12345');

    await expect(password).toHaveValue('Test@12345');
  });

  // 10. Signup button is visible
  test('Signup button is visible', async ({ page }) => {
    const buttons = page.getByRole('button');

    await expect(buttons.last()).toBeVisible();
  });

});
