const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test.describe('TEST 9 - Login validation', () => {

  // ============================================
  // TEST 9A - MISSING EMAIL
  // ============================================

  test('TEST 9A - Login without email', async ({ request }) => {

    console.log('========================================');
    console.log('TEST 9A - MISSING EMAIL');
    console.log('========================================');

    const response = await request.post(
      `${BASE_URL}/auth/login`,
      {
        data: {
          password: 'Test@12345'
        }
      }
    );

    console.log('Status:', response.status());

    const responseText = await response.text();

    console.log('Response:', responseText);

    // FastAPI validation error
    expect(response.status()).toBe(422);

    const data = JSON.parse(responseText);

    expect(data).toHaveProperty('detail');

    console.log('Missing email correctly rejected');
    console.log('========================================');
  });


  // ============================================
  // TEST 9B - MISSING PASSWORD
  // ============================================

  test('TEST 9B - Login without password', async ({ request }) => {

    console.log('========================================');
    console.log('TEST 9B - MISSING PASSWORD');
    console.log('========================================');

    const response = await request.post(
      `${BASE_URL}/auth/login`,
      {
        data: {
          email: `test${Date.now()}@example.com`
        }
      }
    );

    console.log('Status:', response.status());

    const responseText = await response.text();

    console.log('Response:', responseText);

    // FastAPI validation error
    expect(response.status()).toBe(422);

    const data = JSON.parse(responseText);

    expect(data).toHaveProperty('detail');

    console.log('Missing password correctly rejected');
    console.log('========================================');
  });

});
