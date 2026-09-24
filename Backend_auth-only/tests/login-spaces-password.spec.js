const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 14 - Login with spaces-only password', async ({ request }) => {

  console.log('========================================');
  console.log('TEST 14 - SPACES-ONLY PASSWORD');
  console.log('========================================');

  const response = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {
        email: 'test@example.com',
        password: '     '
      }
    }
  );

  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);

  // ============================================
  // VERIFY LOGIN IS REJECTED
  // ============================================

  expect(response.status()).toBe(401);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(data.detail).toBe('Incorrect email or password.');

  console.log('========================================');
  console.log('TEST 14 PASSED');
  console.log('Spaces-only password was rejected');
  console.log('========================================');
});
