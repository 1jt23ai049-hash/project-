const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 39 - Reset password with extra field', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`,
    {
      data: {
        token: 'invalid-reset-token-12345',
        new_password: 'NewTest@12345',
        extra_field: 'unexpected'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 39 - EXTRA FIELD');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // The request should at least be processed successfully by validation.
  // The token itself is intentionally invalid, so the endpoint should
  // return its reset-token error rather than a validation error.
  expect(response.status()).not.toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  console.log('Extra field was accepted by request validation.');
});
