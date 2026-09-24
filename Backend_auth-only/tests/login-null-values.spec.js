const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 15 - Login with null email and password', async ({ request }) => {

  console.log('========================================');
  console.log('TEST 15 - NULL EMAIL AND PASSWORD');
  console.log('========================================');

  const response = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: null,
        password: null
      }
    }
  );

  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);

  // ============================================
  // VERIFY VALIDATION ERROR
  // ============================================

  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(Array.isArray(data.detail)).toBe(true);

  console.log(
    'Validation details:',
    JSON.stringify(data.detail, null, 2)
  );

  console.log('========================================');
  console.log('TEST 15 PASSED');
  console.log('Null email and password correctly rejected');
  console.log('========================================');
});
