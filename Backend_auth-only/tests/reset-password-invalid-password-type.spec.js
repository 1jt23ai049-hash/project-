const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 35 - Reset password with numeric new password', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: 12345678
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 35 - NUMERIC NEW PASSWORD');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // new_password must be a string
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');
  expect(Array.isArray(data.detail)).toBe(true);

  // Confirm the validation error is related to new_password
  expect(data.detail[0].loc).toContain('new_password');

  console.log('Numeric new password correctly rejected.');
});
