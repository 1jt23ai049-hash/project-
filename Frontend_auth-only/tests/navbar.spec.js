const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Homepage Navbar', () => {

  // Open the homepage before every test
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // 1. Test How it works
  test('How it works navigation works', async ({ page }) => {

    await expect(
      page.getByRole('link', {
        name: 'How it works',
        exact: true
      })
    ).toBeVisible();

    await page.getByRole('link', {
      name: 'How it works',
      exact: true
    }).click();

    await expect(
      page.locator('#how-it-works')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'How It Works'
      })
    ).toBeVisible();
  });


  // 2. Test Static vs Dynamic
  test('Static vs Dynamic navigation works', async ({ page }) => {

    await expect(
      page.getByRole('link', {
        name: 'Static vs Dynamic',
        exact: true
      })
    ).toBeVisible();

    await page.getByRole('link', {
      name: 'Static vs Dynamic',
      exact: true
    }).click();

    await expect(
      page.locator('#static-vs-dynamic')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Static vs Dynamic'
      })
    ).toBeVisible();
  });


  // 3. Test Reach
  test('Reach navigation works', async ({ page }) => {

    await expect(
      page.getByRole('link', {
        name: 'Reach',
        exact: true
      })
    ).toBeVisible();

    await page.getByRole('link', {
      name: 'Reach',
      exact: true
    }).click();

    await expect(
      page.locator('#reach')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Reach'
      })
    ).toBeVisible();
  });


  // 4. Test Plans
  test('Plans navigation works', async ({ page }) => {

    await expect(
      page.getByRole('link', {
        name: 'Plans',
        exact: true
      })
    ).toBeVisible();

    await page.getByRole('link', {
      name: 'Plans',
      exact: true
    }).click();

    await expect(
      page.locator('#plans')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Plans'
      })
    ).toBeVisible();
  });


  // 5. Test FAQ
  test('FAQ navigation works', async ({ page }) => {

    await expect(
      page.getByRole('link', {
        name: 'FAQ',
        exact: true
      })
    ).toBeVisible();

    await page.getByRole('link', {
      name: 'FAQ',
      exact: true
    }).click();

    await expect(
      page.locator('#faq')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'FAQ'
      })
    ).toBeVisible();
  });

});
