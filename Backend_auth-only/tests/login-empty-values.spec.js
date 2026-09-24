const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 12 - Login with empty email and password', async ({ request }) => {

  console.log('========================================');
  console.log('TEST 12 - EMPTY EMAIL AND PASSWORD');
  console.log('========================================');

  const response = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: '',
        password: ''
      }
    }
  );

  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);

  // ============================================
  // VERIFY REQUEST IS REJECTED
  // ============================================

  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  console.log(
    'Validation details:',
    JSON.stringify(data.detail, null, 2)
  );

  console.log('========================================');
  console.log('TEST 12 PASSED');
  console.log('Empty email and password correctly rejected');
  console.log('========================================');
});
