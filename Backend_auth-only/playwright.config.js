const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  timeout: 30000,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    baseURL: 'http://localhost:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});

