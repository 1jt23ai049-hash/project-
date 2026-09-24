import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('Check Start Your Trial button', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.waitForLoadState('networkidle');

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());

  console.log('PAGE TEXT:');
  console.log(await page.locator('body').innerText());

  const startTrial = page.getByText('Start Your Trial', { exact: false });

  console.log('Start Your Trial count:', await startTrial.count());

  await expect(startTrial.first()).toBeVisible();
});
