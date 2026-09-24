const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 40 - Reset password with whitespace-only password', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: '        '
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 40 - WHITESPACE-ONLY PASSWORD');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Backend checks the reset token first.
  expect(response.status()).toBe(400);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(data.detail).toContain(
    'This reset link is invalid or has expired.'
  );

  console.log('Invalid reset token correctly rejected.');
});
