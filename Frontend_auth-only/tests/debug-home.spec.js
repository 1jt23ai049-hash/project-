
const { test } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test('Debug Home Page', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.waitForLoadState('domcontentloaded');

  console.log('\n==============================');
  console.log('PAGE URL:', page.url());
  console.log('==============================');

  console.log('\n--- PAGE TEXT ---');
  console.log(await page.locator('body').innerText());

  console.log('\n--- BUTTONS ---');
  console.log(await page.locator('button').allTextContents());

  console.log('\n--- LINKS ---');
  console.log(await page.locator('a').allTextContents());

  console.log('\n--- START YOUR TRIAL COUNT ---');
  console.log(
    await page.getByText(/Start Your Trial/i).count()
  );

  console.log('\n--- HOW IT WORKS COUNT ---');
  console.log(
    await page.getByText(/How It Works/i).count()
  );

  console.log('\n==============================');
});
