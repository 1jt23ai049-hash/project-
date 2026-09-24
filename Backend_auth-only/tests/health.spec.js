const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';

test('GET /health - Backend health check', async ({ request }) => {

  // Send GET request to backend
  const response = await request.get(`${BASE_URL}/health`);

  // Print response information
  console.log('Status:', response.status());
  console.log('Response:', await response.text());

  // Check HTTP status
  expect(response.status()).toBe(200);

  // Convert response to JSON
  const data = await response.json();

  // Check response body
  expect(data.status).toBe('ok');
});
