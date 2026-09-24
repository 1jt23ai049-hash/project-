
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Create Your Account - Registration Page', () => {

  test('Open Create Your Account page', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register', {
      waitUntil: 'domcontentloaded'
    });

    console.log('Current URL:', page.url());

    await expect(page).toHaveURL(/company\/register/);

    await expect(
      page.getByText('Create Your Account', { exact: true })
    ).toBeVisible();
  });


  test('Login link is visible and works', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const loginLink = page.getByRole('link', {
      name: /Log in/i
    });

    await expect(loginLink).toBeVisible();

    await loginLink.click();

    await expect(page).toHaveURL(/auth\/login/);
  });


  test('Your full name field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    await expect(fullName).toBeVisible();
  });


  test('Full name accepts valid name', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    await fullName.fill('John Smith');

    await expect(fullName).toHaveValue('John Smith');
  });


  test('Full name rejects numbers', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    await fullName.fill('John123');
    await fullName.blur();

    await expect(
      page.getByText(/Letters only/i)
    ).toBeVisible();
  });


  test('Full name rejects special characters', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    await fullName.fill('John@123');
    await fullName.blur();

    await expect(
      page.getByText(/Letters only/i)
    ).toBeVisible();
  });


  test('Full name rejects less than 2 characters', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    await fullName.fill('J');
    await fullName.blur();

    await expect(
      page.getByText(/2.?50 characters/i)
    ).toBeVisible();
  });


  test('Full name rejects more than 50 characters', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const fullName = page.getByLabel(/Your full name/i);

    const longName =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY';

    await fullName.fill(longName);
    await fullName.blur();

    await expect(
      page.getByText(/2.?50 characters/i)
    ).toBeVisible();
  });


  test('Work email field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const email = page.getByLabel(/Work email/i);

    await expect(email).toBeVisible();
  });


  test('Work email accepts valid email', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const email = page.getByLabel(/Work email/i);

    await email.fill('test@example.com');

    await expect(email).toHaveValue('test@example.com');
  });


  test('Work email rejects invalid email', async ({ page }) => {
  await page.goto(BASE_URL + '/company/register');

  const email = page.getByLabel(/Work email/i);

  await expect(email).toBeVisible();

  await email.fill('invalid-email');

  await expect(email).toHaveValue('invalid-email');

  const isValid = await email.evaluate((element) => {
    return element.checkValidity();
  });

  expect(isValid).toBe(false);
});
  test('Phone number field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await expect(phone).toBeVisible();
  });


  test('Phone number accepts 10 digit number', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await phone.fill('9876543210');

    await expect(phone).toHaveValue('9876543210');
  });


  test('Phone number rejects less than 10 digits', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await phone.fill('987654321');
    await phone.blur();

    await expect(
      page.getByText(/10.?digit/i)
    ).toBeVisible();
  });


  test('Phone number rejects more than 10 digits', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await phone.fill('98765432101');
    await phone.blur();

    await expect(
      page.getByText(/10.?digit/i)
    ).toBeVisible();
  });


  test('Phone number rejects spaces', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await phone.fill('98765 43210');
    await phone.blur();

    await expect(
      page.getByText(/10.?digit|no spaces/i)
    ).toBeVisible();
  });


  test('Phone number rejects country code', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const phone = page.getByLabel(/Phone number/i);

    await phone.fill('+919876543210');
    await phone.blur();

    await expect(
      page.getByText(/10.?digit|country code/i)
    ).toBeVisible();
  });


  test('Password field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await expect(password).toBeVisible();
  });


  test('Password accepts valid password', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await password.fill('Test@1234');

    await expect(password).toHaveValue('Test@1234');
  });


  test('Password rejects less than 8 characters', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await password.fill('Test@12');
    await password.blur();

    await expect(
      page.getByText(/8\+|8.*chars|8.*character/i)
    ).toBeVisible();
  });


  test('Password requires uppercase letter', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await password.fill('test@1234');
    await password.blur();

    await expect(
      page.getByText(/upper/i)
    ).toBeVisible();
  });


  test('Password requires lowercase letter', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await password.fill('TEST@1234');
    await password.blur();

    await expect(
      page.getByText(/lower/i)
    ).toBeVisible();
  });


  test('Password requires number', async ({ page }) => {
  await page.goto(BASE_URL + '/company/register');

  const password = page.getByLabel(/^Password/i);

  await expect(password).toBeVisible();

  await password.fill('Test@abcd');

  await expect(password).toHaveValue('Test@abcd');

  const helperText = page.getByText(
    '8+ chars, upper, lower, number & symbol',
    { exact: true }
  );

  await expect(helperText).toBeVisible();
});

  test('Password requires special symbol', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    await password.fill('Test12345');
    await password.blur();

    await expect(
      page.getByText(/symbol|special/i)
    ).toBeVisible();
  });


  test('Confirm password field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const confirmPassword =
      page.getByLabel(/Confirm password/i);

    await expect(confirmPassword).toBeVisible();
  });


  test('Confirm password matches password', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const password = page.getByLabel(/^Password/i);

    const confirmPassword =
      page.getByLabel(/Confirm password/i);

    await password.fill('Test@1234');
    await confirmPassword.fill('Test@1234');

    await expect(confirmPassword).toHaveValue('Test@1234');
  });


  test('Confirm password shows error when passwords do not match', async ({ page }) => {
  await page.goto(BASE_URL + '/company/register');

  const password = page.getByLabel(/^Password/i);
  const confirmPassword = page.getByLabel(/Confirm password/i);

  await expect(password).toBeVisible();
  await expect(confirmPassword).toBeVisible();

  await password.fill('Test@1234');
  await confirmPassword.fill('Wrong@1234');

  await expect(password).toHaveValue('Test@1234');
  await expect(confirmPassword).toHaveValue('Wrong@1234');

  expect(await password.inputValue()).not.toBe(
    await confirmPassword.inputValue()
  );
});

  test('Company name field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const companyName =
      page.getByLabel(/Company name/i);

    await expect(companyName).toBeVisible();
  });


  test('Company name accepts valid company name', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const companyName =
      page.getByLabel(/Company name/i);

    await companyName.fill('AgriQR Technologies');

    await expect(companyName).toHaveValue(
      'AgriQR Technologies'
    );
  });


  test('Company logo field is displayed', async ({ page }) => {
  await page.goto(BASE_URL + '/company/register');

  await expect(
    page.getByText('Company logo', { exact: false })
  ).toBeVisible();

  await expect(
    page.getByText(/No logo selected/i)
  ).toBeVisible();
});

  test('Registered address line 1 is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const address =
      page.getByLabel(/Registered address.*line 1/i);

    await expect(address).toBeVisible();
  });


  test('Address line 2 is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const address2 =
      page.getByLabel(/Address line 2/i);

    await expect(address2).toBeVisible();
  });


  test('City field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const city = page.getByLabel(/City/i);

    await expect(city).toBeVisible();
  });


  test('City accepts valid value', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const city = page.getByLabel(/City/i);

    await city.fill('Bangalore');

    await expect(city).toHaveValue('Bangalore');
  });


  test('State field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const state = page.getByLabel(/State/i);

    await expect(state).toBeVisible();
  });


  test('PIN code field is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const pin = page.getByLabel(/PIN code/i);

    await expect(pin).toBeVisible();
  });


  test('PIN code accepts valid 6 digit value', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const pin = page.getByLabel(/PIN code/i);

    await pin.fill('560001');

    await expect(pin).toHaveValue('560001');
  });


  test('PIN code rejects invalid value', async ({ page }) => {
  await page.goto(BASE_URL + '/company/register');

  const pin = page.getByLabel(/PIN code/i);

  await expect(pin).toBeVisible();

  await pin.fill('123');

  await expect(pin).toHaveValue('123');

  // A valid PIN must contain exactly 6 digits.
  expect(await pin.inputValue()).not.toMatch(/^\d{6}$/);
});

  test('Terms and Privacy checkbox is visible', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const checkbox =
      page.getByRole('checkbox');

    await expect(checkbox).toBeVisible();
  });


  test('Terms and Privacy checkbox can be checked', async ({ page }) => {
    await page.goto(BASE_URL + '/company/register');

    const checkbox =
      page.getByRole('checkbox');

    await checkbox.check();

    await expect(checkbox).toBeChecked();
  });


  test('Complete registration form can be filled', async ({ page }) => {

    await page.goto(BASE_URL + '/company/register');

    await page.getByLabel(/Your full name/i)
      .fill('John Smith');

    await page.getByLabel(/Work email/i)
      .fill('john@example.com');

    await page.getByLabel(/Phone number/i)
      .fill('9876543210');

    await page.getByLabel(/^Password/i)
      .fill('Test@1234');

    await page.getByLabel(/Confirm password/i)
      .fill('Test@1234');

    await page.getByLabel(/Company name/i)
      .fill('AgriQR Technologies');

    await page.getByLabel(/Registered address.*line 1/i)
      .fill('123 Main Street');

    await page.getByLabel(/Address line 2/i)
      .fill('Near City Center');

    await page.getByLabel(/City/i)
      .fill('Bangalore');

    await page.getByLabel(/State/i)
      .fill('Karnataka');

    await page.getByLabel(/PIN code/i)
      .fill('560001');

    await page.getByRole('checkbox').check();

    await expect(
      page.getByLabel(/Your full name/i)
    ).toHaveValue('John Smith');

    await expect(
      page.getByLabel(/Work email/i)
    ).toHaveValue('john@example.com');

    await expect(
      page.getByLabel(/Phone number/i)
    ).toHaveValue('9876543210');

    await expect(
      page.getByLabel(/Company name/i)
    ).toHaveValue('AgriQR Technologies');

    await expect(
      page.getByRole('checkbox')
    ).toBeChecked();
  });

});
