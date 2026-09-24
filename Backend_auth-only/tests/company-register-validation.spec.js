const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('POST /auth/company/register - Missing required email', async ({ request }) => {

  // Registration data WITHOUT email
  const invalidData = {
    full_name: 'Validation Test User',
    phone: '9876543210',
    password: 'Test@12345',
    company_name: 'Validation Test Company',
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
  console.log('TEST 4 - INVALID REGISTRATION');
  console.log('Status:', response.status());
  console.log('Response:', await response.text());
  console.log('----------------------------------------');

  // FastAPI validation error
  expect(response.status()).toBe(422);

  const data = await response.json();

  // FastAPI should return validation details
  expect(data).toHaveProperty('detail');

  console.log('Validation error correctly returned');
});
