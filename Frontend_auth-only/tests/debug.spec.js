import { test } from '@playwright/test';

test('debug AgriQR page', async ({ page }) => {
  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle'
  });

  console.log('\n===== URL =====');
  console.log(page.url());

  console.log('\n===== PAGE TITLE =====');
  console.log(await page.title());

  console.log('\n===== PAGE TEXT =====');
  console.log(await page.locator('body').innerText());

  console.log('\n===== BUTTON TEXT =====');
  console.log(await page.locator('button').allInnerTexts());

  console.log('\n===== LINK TEXT =====');
  console.log(await page.locator('a').allInnerTexts());
});
