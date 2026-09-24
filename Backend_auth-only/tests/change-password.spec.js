const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 16 - Change password with valid credentials', async ({ request }) => {

  // Create a unique user
  const email = `changepassword${Date.now()}@example.com`;

  const currentPassword = 'Test@12345';
  const newPassword = 'NewTest@12345';

  // ------------------------------------------------
  // STEP 1 - REGISTER USER
  // ------------------------------------------------

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Change Password Test User',
        email: email,
        phone: '9876543210',
        password: currentPassword,
        company_name: 'Change Password Test Company',
        address: {
          line1: '123 Test Street',
          line2: '',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        }
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 1 - REGISTRATION');
  console.log('Status:', registerResponse.status());

  const registerText = await registerResponse.text();
  console.log('Response:', registerText);

  expect(registerResponse.status()).toBe(201);

  const registerData = JSON.parse(registerText);

  expect(registerData).toHaveProperty('access_token');

  // Get access token
  const accessToken = registerData.access_token;

  console.log('Registration successful');
  console.log('Email:', email);

  // ------------------------------------------------
  // STEP 2 - CHANGE PASSWORD
  // ------------------------------------------------

  const changePasswordResponse = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },

      data: {
        current_password: currentPassword,
        new_password: newPassword
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 2 - CHANGE PASSWORD');
  console.log('Status:', changePasswordResponse.status());

  const changePasswordText = await changePasswordResponse.text();

  console.log('Response:', changePasswordText);
  console.log('----------------------------------------');

  // Successful password change
  expect(changePasswordResponse.status()).toBe(200);

  const changePasswordData = JSON.parse(changePasswordText);

  expect(changePasswordData).toHaveProperty('message');

  console.log('Password changed successfully.');
});
