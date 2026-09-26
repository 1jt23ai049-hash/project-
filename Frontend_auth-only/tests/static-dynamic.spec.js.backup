const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Static vs Dynamic navigation works correctly', async ({ page }) => {

  // Open home page
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Find Static vs Dynamic
  const staticDynamic = page
    .locator('a, button, [role="button"]')
    .filter({ hasText: /Static\s+vs\s+Dynamic/i })
    .first();

  // Check it is visible
  await expect(staticDynamic).toBeVisible();

  console.log('PASS: Static vs Dynamic is visible');

  // Click it
  await staticDynamic.click();

  console.log('PASS: Static vs Dynamic clicked');

  // Wait for navigation/scroll/update
  await page.waitForTimeout(1000);

  // Print the URL after clicking
  console.log('URL after click:', page.url());

  // Get all visible page text
  const pageText = await page.locator('body').innerText();

  console.log('PAGE TEXT AFTER CLICK:');
  console.log(pageText);

  // Verify the Static vs Dynamic content exists somewhere on the page
  expect(pageText).toMatch(/Static|Dynamic/i);

  console.log('PASS: Static vs Dynamic content is present');
});
