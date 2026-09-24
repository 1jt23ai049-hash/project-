const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 18 - Change password when new password is same as current password', async ({ request }) => {

  const email = `samepassword${Date.now()}@example.com`;

  const password = 'Test@12345';

  // ------------------------------------------------
  // STEP 1 - REGISTER USER
  // ------------------------------------------------

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Same Password Test User',
        email: email,
        phone: '9876543210',
        password: password,
        company_name: 'Same Password Test Company',
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

  const accessToken = registerData.access_token;

  console.log('Registration successful.');
  console.log('Email:', email);

  // ------------------------------------------------
  // STEP 2 - CHANGE PASSWORD
  // USING SAME CURRENT AND NEW PASSWORD
  // ------------------------------------------------

  const changePasswordResponse = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },

      data: {
        current_password: password,
        new_password: password
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 2 - SAME CURRENT AND NEW PASSWORD');
  console.log('Status:', changePasswordResponse.status());

  const responseText = await changePasswordResponse.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected: Bad Request
  expect(changePasswordResponse.status()).toBe(400);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(data.detail).toBe(
    'New password must be different from the current password.'
  );

  console.log('Same password correctly rejected.');
});
