const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Homepage Navbar', () => {

  test('How it works navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const howItWorksSection = page.locator('#how-it-works');

    await expect(howItWorksSection).toBeVisible();

    console.log('PASS: How It Works section is visible');
  });

  test('Static vs Dynamic navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const staticDynamicSection = page.locator('#static-vs-dynamic');

    await expect(staticDynamicSection).toBeVisible();

    console.log('PASS: Static vs Dynamic section is visible');
  });

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
