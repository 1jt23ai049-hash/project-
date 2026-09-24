const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 8 - Login with non-existing email', async ({ request }) => {

  // Email that should not exist in the database
  const email = `doesnotexist${Date.now()}@example.com`;
  const password = 'Test@12345';

  console.log('========================================');
  console.log('TEST 8 - NON-EXISTING EMAIL LOGIN');
  console.log('========================================');

  console.log('Email:', email);

  // ============================================
  // STEP 1 - LOGIN WITH NON-EXISTING EMAIL
  // ============================================

  console.log('========================================');
  console.log('STEP 1 - SEND LOGIN REQUEST');
  console.log('========================================');

  const response = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: email,
        password: password
      }
    }
  );

  console.log('Login Status:', response.status());

  const responseText = await response.text();

  console.log('Login Response:', responseText);

  // ============================================
  // STEP 2 - VERIFY LOGIN IS REJECTED
  // ============================================

  console.log('========================================');
  console.log('STEP 2 - VERIFY LOGIN REJECTED');
  console.log('========================================');

  expect(response.status()).toBe(401);

  const errorData = JSON.parse(responseText);

  expect(errorData).toHaveProperty('detail');

  console.log('Error message:', errorData.detail);

  console.log('========================================');
  console.log('TEST 8 PASSED');
  console.log('Non-existing email was correctly rejected');
  console.log('========================================');
});
