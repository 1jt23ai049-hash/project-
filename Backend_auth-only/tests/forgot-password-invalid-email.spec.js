const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('TEST 25 - Forgot password with invalid email format', async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/auth/forgot-password`,
    {
      data: {
        email: 'not-a-valid-email'
      }
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 25 - INVALID EMAIL FORMAT');
  console.log('Status:', response.status());

  const responseText = await response.text();

  console.log('Response:', responseText);
  console.log('----------------------------------------');

  // Expected: FastAPI/Pydantic validation error
  expect(response.status()).toBe(422);

  const data = JSON.parse(responseText);

  expect(data).toHaveProperty('detail');

  expect(Array.isArray(data.detail)).toBe(true);

  console.log('Invalid email correctly rejected.');
});
