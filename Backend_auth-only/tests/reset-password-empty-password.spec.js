const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 30 - Reset password with empty new password', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: ''
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 30 - EMPTY NEW PASSWORD');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Empty password should fail validation
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Empty new password correctly rejected.');
});
