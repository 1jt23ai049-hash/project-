const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Reach, Plans and FAQ Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  // ==========================================
  // REACH
  // ==========================================
  test('Reach navigation works', async ({ page }) => {

    const reach = page
      .locator('a, button, [role="button"]')
      .filter({ hasText: /^Reach$/i })
      .first();

    await expect(reach).toBeVisible();

    console.log('Reach button found');

    await reach.click();

    await page.waitForTimeout(1000);

    console.log('URL after Reach click:', page.url());

    const scrollPosition = await page.evaluate(() => window.scrollY);

    console.log('Scroll position after Reach:', scrollPosition);

    expect(scrollPosition).toBeGreaterThan(0);
  });


  // ==========================================
  // PLANS
  // ==========================================
  test('Plans navigation works', async ({ page }) => {

    const plans = page
      .locator('a, button, [role="button"]')
      .filter({ hasText: /^Plans$/i })
      .first();

    await expect(plans).toBeVisible();

    console.log('Plans button found');

    await plans.click();

    await page.waitForTimeout(1000);

    console.log('URL after Plans click:', page.url());

    const scrollPosition = await page.evaluate(() => window.scrollY);

    console.log('Scroll position after Plans:', scrollPosition);

    expect(scrollPosition).toBeGreaterThan(0);
  });


  // ==========================================
  // FAQ
  // ==========================================
  test('FAQ navigation works', async ({ page }) => {

    const faq = page
      .locator('a, button, [role="button"]')
      .filter({ hasText: /^FAQ$/i })
      .first();

    await expect(faq).toBeVisible();

    console.log('FAQ button found');

    await faq.click();

    await page.waitForTimeout(1000);

    console.log('URL after FAQ click:', page.url());

    const scrollPosition = await page.evaluate(() => window.scrollY);

    console.log('Scroll position after FAQ:', scrollPosition);

    expect(scrollPosition).toBeGreaterThan(0);
  });

});
