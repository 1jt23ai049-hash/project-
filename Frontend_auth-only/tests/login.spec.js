const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Login Page', () => {

  // 1. Login page loads
  test('Login page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    await expect(page).toHaveURL(/\/auth\/login/);

    console.log('Current URL:', page.url());
  });


  // 2. Login page content is visible
  test('Login page content is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    await expect(page.locator('body')).toBeVisible();
  });


  // 3. Work email field is visible
  test('Work email field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();

    await expect(email).toBeVisible();
  });


  // 4. Work email accepts valid email
  test('Work email accepts valid email', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();

    await email.fill('test@example.com');

    await expect(email).toHaveValue('test@example.com');
  });


  // 5. Work email rejects invalid email
  test('Work email rejects invalid email', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();

    await email.fill('invalid-email');

    await expect(email).toHaveValue('invalid-email');

    const isValid = await email.evaluate((element) => {
      return element.checkValidity();
    });

    expect(isValid).toBe(false);
  });


  // 6. Work email can be empty
  test('Work email empty value is accepted by the field', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();

    await expect(email).toBeVisible();

    await email.fill('');

    await expect(email).toHaveValue('');

    expect(await email.inputValue()).toBe('');
  });


  // 7. Password field is visible
  test('Password field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const password = page.getByLabel(/^Password/i);

    await expect(password).toBeVisible();
  });


  // 8. Password accepts value
  test('Password accepts valid value', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const password = page.getByLabel(/^Password/i);

    await password.fill('Test@1234');

    await expect(password).toHaveValue('Test@1234');
  });


  // 9. Password can be empty
  test('Password empty value is accepted by the field', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const password = page.getByLabel(/^Password/i);

    await expect(password).toBeVisible();

    await password.fill('');

    await expect(password).toHaveValue('');

    expect(await password.inputValue()).toBe('');
  });


  // 10. Forgot Password link is visible
  test('Forgot Password link is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const forgotPassword = page.getByText(/forgot password/i);

    await expect(forgotPassword).toBeVisible();
  });


  // 11. Forgot Password opens reset page
  test('Forgot Password opens reset page', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const forgotPassword = page.getByText(/forgot password/i);

    await expect(forgotPassword).toBeVisible();

    await forgotPassword.click();

    await expect(page).toHaveURL(/\/auth\/forgot-password/);

    console.log('Forgot Password URL:', page.url());
  });


  // 12. Find Login button
  test('Login button is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const buttons = page.locator('button');

    await expect(buttons.first()).toBeVisible();

    console.log(
      'Login page buttons:',
      await buttons.allTextContents()
    );
  });


  // 13. Login button is enabled
  test('Login button is enabled', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const buttons = page.locator('button');

    await expect(buttons.first()).toBeVisible();
    await expect(buttons.first()).toBeEnabled();
  });


  // 14. Login with empty fields
  test('Login with empty fields', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();
    const password = page.getByLabel(/^Password/i);

    await email.fill('');
    await password.fill('');

    await expect(email).toHaveValue('');
    await expect(password).toHaveValue('');

    const buttons = page.locator('button');

    await expect(buttons.first()).toBeVisible();

    await buttons.first().click();

    await expect(page).toHaveURL(/\/auth\/login/);
  });


  // 15. Login with invalid email
  test('Login with invalid email', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();
    const password = page.getByLabel(/^Password/i);

    await email.fill('invalid-email');
    await password.fill('Test@1234');

    await expect(email).toHaveValue('invalid-email');
    await expect(password).toHaveValue('Test@1234');

    const buttons = page.locator('button');

    await expect(buttons.first()).toBeVisible();

    await buttons.first().click();

    await expect(page).toHaveURL(/\/auth\/login/);
  });


  // 16. Login with invalid credentials
  test('Login with invalid credentials', async ({ page }) => {
    await page.goto(BASE_URL + '/auth/login');

    const email = page.getByLabel(/email|work email/i).first();
    const password = page.getByLabel(/^Password/i);

    await email.fill('test@example.com');
    await password.fill('WrongPassword@123');

    await expect(email).toHaveValue('test@example.com');
    await expect(password).toHaveValue('WrongPassword@123');

    const buttons = page.locator('button');

    await expect(buttons.first()).toBeVisible();

    await buttons.first().click();

    await expect(page).toHaveURL(/\/auth\/login/);
  });

});
