const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('POST /auth/company/register - Duplicate email registration', async ({ request }) => {

  // Use one fixed email for both registration attempts
  const email = `duplicate${Date.now()}@example.com`;

  const userData = {
    full_name: 'Duplicate Test User',
    email: email,
    phone: '9876543210',
    password: 'Test@12345',
    company_name: 'Duplicate Test Company',
    address: {
      line1: '123 Test Street',
      line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    }
  };

  // ==========================================================
  // FIRST REGISTRATION
  // ==========================================================

  const firstResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: userData
    }
  );

  console.log('----------------------------------------');
  console.log('FIRST REGISTRATION');
  console.log('Status:', firstResponse.status());
  console.log('Response:', await firstResponse.text());

  // First registration must succeed
  expect(firstResponse.status()).toBe(201);

  // ==========================================================
  // SECOND REGISTRATION USING SAME EMAIL
  // ==========================================================

  const duplicateResponse = await request.post(
    `${BASE_URL}/auth/company/register`,
    {
      data: userData
    }
  );

  console.log('----------------------------------------');
  console.log('DUPLICATE REGISTRATION');
  console.log('Status:', duplicateResponse.status());
  console.log('Response:', await duplicateResponse.text());

  // Duplicate email must be rejected
  expect(duplicateResponse.status()).toBe(409);

  const duplicateData = await duplicateResponse.json();

  // Check the exact error message returned by backend
  expect(duplicateData.detail).toBe(
    'An account with this email already exists.'
  );

  console.log('----------------------------------------');
  console.log('Duplicate registration correctly rejected');
  console.log('Email:', email);
});
