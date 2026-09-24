const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  timeout: 30000,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  webServer: {
    command: 'npm start',
    cwd: './frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ]
});
