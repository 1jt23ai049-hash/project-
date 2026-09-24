const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 31 - Reset password with empty token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: '',
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 31 - EMPTY RESET TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Empty token should fail request validation
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');
  expect(Array.isArray(data.detail)).toBe(true);

  // Verify the validation error is for the token
  expect(data.detail[0].loc).toContain('token');

  // Verify the backend rejected the empty token
  expect(data.detail[0].type).toBe('string_too_short');

  console.log('Empty reset token correctly rejected.');
});

