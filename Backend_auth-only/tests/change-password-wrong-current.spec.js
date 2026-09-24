const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 17 - Change password with incorrect current password', async ({ request }) => {

  const email = `wrongcurrent${Date.now()}@example.com`;

  const correctPassword = 'Test@12345';
  const wrongCurrentPassword = 'WrongPassword@123';
  const newPassword = 'NewTest@12345';

  // ------------------------------------------------
  // STEP 1 - REGISTER USER
  // ------------------------------------------------

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Wrong Current Password User',
        email: email,
        phone: '9876543210',
        password: correctPassword,
        company_name: 'Wrong Current Password Company',
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
  // STEP 2 - CHANGE PASSWORD WITH WRONG CURRENT PASSWORD
  // ------------------------------------------------

  const changePasswordResponse = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },

      data: {
        current_password: wrongCurrentPassword,
        new_password: newPassword
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 2 - WRONG CURRENT PASSWORD');
  console.log('Status:', changePasswordResponse.status());

  const responseText = await changePasswordResponse.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected: Unauthorized
  expect(changePasswordResponse.status()).toBe(401);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(data.detail).toBe('Current password is incorrect.');

  console.log('Wrong current password correctly rejected.');
});
