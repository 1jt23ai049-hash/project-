const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 10 - Login with empty request body', async ({ request }) => {

  console.log('========================================');
  console.log('TEST 10 - EMPTY LOGIN REQUEST');
  console.log('========================================');

  // Send an empty JSON object
  const response = await request.post(
    `${BASE_URL}/auth/login`,
    {
      data: {}
    }
  );

  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);

  // ============================================
  // VERIFY VALIDATION ERROR
  // ============================================

  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  // There should be validation errors for
  // the missing required fields.
  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Validation details:', JSON.stringify(data.detail, null, 2));

  console.log('========================================');
  console.log('TEST 10 PASSED');
  console.log('Empty login request correctly rejected');
  console.log('========================================');
});
