const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 26 - Reset password with invalid token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 26 - INVALID RESET TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Invalid or expired reset token should return 400
  expect(response.status()).toBe(400);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(data.detail).toBe(
    'This reset link is invalid or has expired. Please request a new one.'
  );

  console.log('Invalid reset token correctly rejected.');
});
