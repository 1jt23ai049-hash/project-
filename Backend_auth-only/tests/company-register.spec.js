const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('POST /auth/company/register - Company registration', async ({ request }) => {

  // Create a unique email for every test run
  const email = `testuser${Date.now()}@example.com`;

  // Send registration request
  const response = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: {
        full_name: 'Playwright Test User',
        email: email,
        phone: '9876543210',
        password: 'Test@12345',
        company_name: 'Playwright Test Company',
        address: {
          line1: '123 Test Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        }
      }
    }
  );

  // Print response
  console.log('Status:', response.status());
  console.log('Response:', await response.text());

  // Registration should be successful
  expect(response.status()).toBe(201);

  // Read JSON response
  const data = await response.json();

  // Check that important response fields exist
  expect(data).toHaveProperty('access_token');
  expect(data).toHaveProperty('refresh_token');
  expect(data).toHaveProperty('user');
  expect(data).toHaveProperty('company');

  console.log('Registration successful');
  console.log('Email:', email);
});
