const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 22 - Change password with invalid authentication token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      headers: {
        Authorization: 'Bearer invalid-token-12345'
      },

      data: {
        current_password: 'Test@12345',
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 22 - INVALID AUTHENTICATION TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Invalid token should be rejected
  expect(response.status()).toBe(401);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  console.log('Invalid authentication token correctly rejected.');
});
