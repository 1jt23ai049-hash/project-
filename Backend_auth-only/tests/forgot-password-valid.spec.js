const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 23 - Forgot password with valid registered email', async ({ request }) => {

  // ------------------------------------------------
  // STEP 1 - REGISTER A USER
  // ------------------------------------------------

  const email = `forgotpassword${Date.now()}@example.com`;

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Forgot Password Test User',
        email: email,
        phone: '9876543210',
        password: 'Test@12345',
        company_name: 'Forgot Password Test Company',
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

  console.log('User registered successfully.');
  console.log('Email:', email);

  // ------------------------------------------------
  // STEP 2 - FORGOT PASSWORD
  // ------------------------------------------------

  const forgotPasswordResponse = await request.post(
    `${BASE_URL}/auth/forgot-password`,
    {
      data: {
        email: email
      }
    }
  );

  console.log('----------------------------------------');
  console.log('STEP 2 - FORGOT PASSWORD');
  console.log('Status:', forgotPasswordResponse.status());

  const responseText = await forgotPasswordResponse.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected successful response
  expect(forgotPasswordResponse.status()).toBe(200);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('message');

  console.log('Password reset request successfully created.');
});
