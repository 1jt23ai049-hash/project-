const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 6 - POST /auth/login - Valid login', async ({ request }) => {

  // Create a unique account for this test
  const email = `login${Date.now()}@example.com`;

  const userData = {
    full_name: 'Login Test User',
    email: email,
    phone: '9876543210',
    password: 'Test@12345',
    company_name: 'Login Test Company',
    address: {
      line1: '123 Test Street',
      line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    }
  };

  // ------------------------------------------------
  // STEP 1: REGISTER USER
  // ------------------------------------------------

  console.log('========================================');
  console.log('STEP 1 - REGISTER USER');
  console.log('========================================');

  const registerResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: userData
    }
  );

  console.log('Registration Status:', registerResponse.status());
  console.log('Registration Response:', await registerResponse.text());

  expect(registerResponse.status()).toBe(201);

  console.log('User registered successfully');
  console.log('Email:', email);


  // ------------------------------------------------
  // STEP 2: LOGIN WITH SAME USER
  // ------------------------------------------------

  console.log('========================================');
  console.log('STEP 2 - LOGIN');
  console.log('========================================');

  const loginResponse = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: email,
        password: 'Test@12345'
      }
    }
  );

  console.log('Login Status:', loginResponse.status());

  const loginText = await loginResponse.text();

  console.log('Login Response:', loginText);


  // ------------------------------------------------
  // STEP 3: VERIFY LOGIN RESPONSE
  // ------------------------------------------------

  expect(loginResponse.status()).toBe(200);

  const loginData = JSON.parse(loginText);

  console.log('========================================');
  console.log('LOGIN SUCCESSFUL');
  console.log('========================================');

  // Verify access token
  expect(loginData).toHaveProperty('access_token');

  // Verify refresh token
  expect(loginData).toHaveProperty('refresh_token');

  // Verify user information
  expect(loginData).toHaveProperty('user');

  console.log('Access token received:', !!loginData.access_token);
  console.log('Refresh token received:', !!loginData.refresh_token);
  console.log('User information received:', !!loginData.user);

  console.log('========================================');
  console.log('TEST 6 PASSED');
  console.log('========================================');
});
