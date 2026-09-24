const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 7 - Login with wrong password', async ({ request }) => {

  // Create a unique user
  const email = `wrongpassword${Date.now()}@example.com`;

  const correctPassword = 'Test@12345';
  const wrongPassword = 'WrongPassword@999';

  const userData = {
    full_name: 'Wrong Password Test User',
    email: email,
    phone: '9876543210',
    password: correctPassword,
    company_name: 'Wrong Password Test Company',
    address: {
      line1: '123 Test Street',
      line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    }
  };

  // ============================================
  // STEP 1 - REGISTER USER
  // ============================================

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


  // ============================================
  // STEP 2 - LOGIN WITH WRONG PASSWORD
  // ============================================

  console.log('========================================');
  console.log('STEP 2 - LOGIN WITH WRONG PASSWORD');
  console.log('========================================');

  const loginResponse = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: email,
        password: wrongPassword
      }
    }
  );

  console.log('Login Status:', loginResponse.status());

  const responseText = await loginResponse.text();

  console.log('Login Response:', responseText);


  // ============================================
  // STEP 3 - VERIFY LOGIN IS REJECTED
  // ============================================

  console.log('========================================');
  console.log('STEP 3 - VERIFY LOGIN REJECTED');
  console.log('========================================');

  expect(loginResponse.status()).toBe(401);

  const errorData = JSON.parse(responseText);

  expect(errorData).toHaveProperty('detail');

  console.log('Error message:', errorData.detail);

  console.log('========================================');
  console.log('TEST 7 PASSED');
  console.log('Wrong password was correctly rejected');
  console.log('========================================');
});
