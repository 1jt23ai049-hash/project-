const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 19 - Change password without authentication token', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/change-password`,
    {
      data: {
        current_password: 'Test@12345',
        new_password: 'NewTest@12345'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 19 - CHANGE PASSWORD WITHOUT TOKEN');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected: Unauthorized
  expect(response.status()).toBe(401);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  console.log('Unauthenticated password change correctly rejected.');
});
