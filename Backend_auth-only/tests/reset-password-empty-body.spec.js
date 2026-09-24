const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 38 - Reset password with empty request body', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/reset-password`
  );

  console.log('----------------------------------------');
  console.log('TEST 38 - EMPTY REQUEST BODY');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Required fields are missing
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');
  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Empty request body correctly rejected.');
});
