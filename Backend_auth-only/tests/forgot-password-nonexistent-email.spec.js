const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 24 - Forgot password with non-existing email', async ({ request }) => {

  const email = `doesnotexist${Date.now()}@example.com`;

  const response = await request.post(
    `${BASE_URL}/auth/forgot-password`,
    {
      data: {
        email: email
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 24 - NON-EXISTING EMAIL');
  console.log('Email:', email);
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  /*
   * We first check that the API returns a valid HTTP response.
   * The exact status depends on how the backend handles
   * non-existing accounts.
   */

  expect([200, 404]).toContain(response.status());

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('message');

  console.log('Non-existing email handled correctly.');
});
