const { test, expect } = require('@playwright/test');

test('Firefox can open homepage', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('body')).toBeVisible();
});
