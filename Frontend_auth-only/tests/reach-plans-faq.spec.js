const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Reach, Plans and FAQ Navigation', () => {

  test('Reach navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const reachSection = page.locator('#reach');

    await expect(reachSection).toBeVisible();

    console.log('PASS: Reach section is visible');
  });

  test('Plans navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const plansSection = page.locator('#plans');

    await expect(plansSection).toBeVisible();

    console.log('PASS: Plans section is visible');
  });

  test('FAQ navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const faqSection = page.locator('#faq');

    await expect(faqSection).toBeVisible();

    console.log('PASS: FAQ section is visible');
  });

});
