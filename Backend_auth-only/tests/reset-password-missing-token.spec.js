const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 27 - Reset password with missing token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 27 - MISSING RESET TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Token is required
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Missing reset token correctly rejected.');
});
