const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 21 - Change password with missing current password', async ({ request }) => {

  // ------------------------------------------------
  // STEP 1 - REGISTER USER
  // ------------------------------------------------

  const email = `missingcurrent${Date.now()}@example.com`;
  const currentPassword = 'Test@12345';

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Missing Current Password User',
        email: email,
        phone: '9876543210',
        password: currentPassword,
        company_name: 'Missing Current Password Company',
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

  // ------------------------------------------------
  // STEP 2 - CHANGE PASSWORD WITHOUT CURRENT PASSWORD
  // ------------------------------------------------

  const changePasswordResponse = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },

      data: {
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 21 - MISSING CURRENT PASSWORD');
  console.log('Status:', changePasswordResponse.status());

  const responseText = await changePasswordResponse.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected: validation error
  expect(changePasswordResponse.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');
  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Missing current password correctly rejected.');
});

