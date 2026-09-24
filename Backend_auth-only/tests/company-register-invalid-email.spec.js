const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('POST /auth/company/register - Invalid email format', async ({ request }) => {

  const invalidData = {
    full_name: 'Invalid Email Test User',

    // INVALID EMAIL
    email: 'not-an-email',

    phone: '9876543210',
    password: 'Test@12345',
    company_name: 'Invalid Email Test Company',

    address: {
      line1: '123 Test Street',
      line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    }
  };

  const response = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: invalidData
    }
  );

  console.log('----------------------------------------');
  console.log('TEST 5 - INVALID EMAIL');
  console.log('Status:', response.status());
  console.log('Response:', await response.text());
  console.log('----------------------------------------');

  // Invalid email should be rejected by validation
  expect(response.status()).toBe(422);

  const data = await response.json();

  // FastAPI validation response should contain detail
  expect(data).toHaveProperty('detail');

  console.log('Invalid email correctly rejected');
});
