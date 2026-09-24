const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('How It Works navigation works correctly', async ({ page }) => {

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Find How It Works
  const howItWorks = page
    .locator('a, button, [role="button"]')
    .filter({ hasText: /How\s+It\s+Works/i })
    .first();

  // 1. Check it exists
  await expect(howItWorks).toBeVisible();

  console.log('PASS: How It Works is visible');

  // 2. Get current scroll position
  const beforeScroll = await page.evaluate(() => window.scrollY);

  // 3. Click
  await howItWorks.click();

  // 4. Wait for scrolling
  await page.waitForTimeout(1000);

  // 5. Check scroll position changed
  const afterScroll = await page.evaluate(() => window.scrollY);

  console.log('Scroll before click:', beforeScroll);
  console.log('Scroll after click:', afterScroll);

  expect(afterScroll).toBeGreaterThan(beforeScroll);

  console.log('PASS: How It Works navigated to the section');
});
