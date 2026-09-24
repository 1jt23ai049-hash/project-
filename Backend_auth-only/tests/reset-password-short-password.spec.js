const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 29 - Reset password with short new password', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: '123'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 29 - SHORT NEW PASSWORD');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Short password should fail validation
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Short new password correctly rejected.');
});
