const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 32 - Reset password with null token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: null,
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 32 - NULL RESET TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Null token should fail request validation
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');
  expect(Array.isArray(data.detail)).toBe(true);

  // Confirm validation error is related to token
  expect(data.detail[0].loc).toContain('token');

  console.log('Null reset token correctly rejected.');
});
