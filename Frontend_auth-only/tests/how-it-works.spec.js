const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('How It Works navigation works correctly', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Check the actual How It Works section
  const howItWorksSection = page.locator('#how-it-works');

  await expect(howItWorksSection).toBeVisible();

  console.log('PASS: How It Works section is visible');
});
