

import { test, expect } from '@playwright/test';

test('Start Your Trial button is visible', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const trialButton = page.getByRole('button', {
    name: 'Start Your Trial',
  });

  await expect(trialButton).toBeVisible();
});
