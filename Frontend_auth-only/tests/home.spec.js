const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('AgriQR - Complete Frontend Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================
  // 1. HOME PAGE
  // =========================================================

  test('01 - Home page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(BASE_URL + '/');

    await expect(page.locator('body')).not.toBeEmpty();

    console.log('PASS: Home page loaded successfully');
  });

  // =========================================================
  // 2. LOGIN PAGE
  // =========================================================

  test('02 - Login page opens successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/auth\/login/);

    console.log('PASS: Login page opens successfully');
  });

  // =========================================================
  // 3. CREATE ACCOUNT / SIGNUP PAGE
  // =========================================================

  test('03 - Create Account page opens successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/company/register`);

    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/company\/register/);

    console.log('PASS: Create Account page opens successfully');
  });

  // =========================================================
  // 4. HOW IT WORKS
  // =========================================================

  test('04 - How It Works section is visible', async ({ page }) => {
    const howItWorks = page
      .getByText(/How It Works/i)
      .first();

    await expect(howItWorks).toBeVisible();

    console.log('PASS: How It Works is visible');
  });

  // =========================================================
  // 5. STATIC
  // =========================================================

  test('05 - Static content is visible', async ({ page }) => {
    const staticText = page
      .getByText(/Static/i)
      .first();

    await expect(staticText).toBeVisible();

    console.log('PASS: Static content is visible');
  });

  // =========================================================
  // 6. DYNAMIC
  // =========================================================

  test('06 - Dynamic content is visible', async ({ page }) => {
    const dynamicText = page
      .getByText(/Dynamic/i)
      .first();

    await expect(dynamicText).toBeVisible();

    console.log('PASS: Dynamic content is visible');
  });

  // =========================================================
  // 7. STATIC VS DYNAMIC
  // =========================================================

  test('07 - Static vs Dynamic content is available', async ({ page }) => {
    await expect(
      page.getByText(/Static/i).first()
    ).toBeVisible();

    await expect(
      page.getByText(/Dynamic/i).first()
    ).toBeVisible();

    console.log('PASS: Static vs Dynamic content is available');
  });

  // =========================================================
  // 8. REACH NAVIGATION
  // =========================================================

  test('08 - Reach navigation works', async ({ page }) => {
    const reachLink = page.locator('a[href="#reach"]');

    await expect(reachLink).toBeVisible();

    await reachLink.click();

    await expect(page).toHaveURL(/#reach$/);

    console.log('PASS: Reach navigation works');
  });

  // =========================================================
  // 9. REACH SECTION
  // =========================================================

  test('09 - Reach section exists', async ({ page }) => {
    const reachSection = page.locator('#reach');

    await expect(reachSection).toBeAttached();

    console.log('PASS: Reach section exists');
  });

  // =========================================================
  // 10. PLANS NAVIGATION
  // =========================================================

  test('10 - Plans navigation works', async ({ page }) => {
    const plansLink = page.locator('a[href="#plans"]');

    await expect(plansLink).toBeVisible();

    await plansLink.click();

    await expect(page).toHaveURL(/#plans$/);

    console.log('PASS: Plans navigation works');
  });

  // =========================================================
  // 11. PLANS SECTION
  // =========================================================

  test('11 - Plans section exists', async ({ page }) => {
    const plansSection = page.locator('#plans');

    await expect(plansSection).toBeAttached();

    console.log('PASS: Plans section exists');
  });

  // =========================================================
  // 12. PLANS SECTION HAS CONTENT
  // =========================================================

  test('12 - Plans section contains content', async ({ page }) => {
    const plansSection = page.locator('#plans');

    await expect(plansSection).toBeAttached();

    const text = await plansSection.innerText();

    expect(text.trim().length).toBeGreaterThan(0);

    console.log('PASS: Plans section contains content');
  });

  // =========================================================
  // 13. PLANS SECTION IS VISIBLE AFTER NAVIGATION
  // =========================================================

  test('13 - Plans section becomes visible', async ({ page }) => {
    const plansLink = page.locator('a[href="#plans"]');

    await plansLink.click();

    const plansSection = page.locator('#plans');

    await expect(plansSection).toBeVisible();

    console.log('PASS: Plans section is visible');
  });

  // =========================================================
  // 14. PLANS NAVIGATION TARGET
  // =========================================================

  test('14 - Plans navigation points to correct section', async ({ page }) => {
    const plansLink = page.locator('a[href="#plans"]');

    await expect(plansLink).toHaveAttribute('href', '#plans');

    console.log('PASS: Plans link points to #plans');
  });

  // =========================================================
  // 15. FAQ NAVIGATION
  // =========================================================

  test('15 - FAQ navigation works', async ({ page }) => {
    const faqLink = page.locator('a[href="#faq"]');

    await expect(faqLink).toBeVisible();

    await faqLink.click();

    await expect(page).toHaveURL(/#faq$/);

    console.log('PASS: FAQ navigation works');
  });

  // =========================================================
  // 16. FAQ SECTION
  // =========================================================

  test('16 - FAQ section exists', async ({ page }) => {
    const faqSection = page.locator('#faq');

    await expect(faqSection).toBeAttached();

    console.log('PASS: FAQ section exists');
  });

  // =========================================================
  // 17. FAQ SECTION HAS CONTENT
  // =========================================================

  test('17 - FAQ section contains content', async ({ page }) => {
    const faqSection = page.locator('#faq');

    await expect(faqSection).toBeAttached();

    const text = await faqSection.innerText();

    expect(text.trim().length).toBeGreaterThan(0);

    console.log('PASS: FAQ section contains content');
  });

  // =========================================================
  // 18. START YOUR TRIAL
  // =========================================================

  test('18 - Start Your Trial is available if present', async ({ page }) => {
    const startTrial = page
      .locator('a, button')
      .filter({
        hasText: /Start Your Trial/i
      })
      .first();

    const count = await startTrial.count();

    if (count === 0) {
      console.log(
        'INFO: Start Your Trial is not present on the current home page'
      );
      return;
    }

    await expect(startTrial).toBeVisible();

    console.log('PASS: Start Your Trial is visible');
  });

  // =========================================================
  // 19. NAVIGATION
  // =========================================================

  test('19 - Main navigation is visible', async ({ page }) => {
    const navigation = page.locator('nav');

    const count = await navigation.count();

    if (count === 0) {
      console.log('INFO: No nav element found');
      return;
    }

    await expect(navigation.first()).toBeVisible();

    console.log('PASS: Main navigation is visible');
  });

  // =========================================================
  // 20. PAGE CONTENT
  // =========================================================

  test('20 - Home page contains content', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();

    expect(bodyText.trim().length).toBeGreaterThan(0);

    console.log('PASS: Home page contains content');
  });

});
