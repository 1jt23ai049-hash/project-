const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('Backend health check', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/health`);

  console.log('Status:', response.status());
  console.log('Response:', await response.text());

  expect(response.status()).toBe(200);

  const data = await response.json();

  expect(data.status).toBe('ok');
});

