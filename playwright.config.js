const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never'
      }
    ]
  ],

  projects: [
    // ==========================================
    // BACKEND API TESTS
    // ==========================================
    {
      name: 'api',

      testMatch: [
        /Backend_auth-only\/tests\/.*\.spec\.js$/
      ],

      use: {
        baseURL: 'http://localhost:8000'
      }
    },

    // ==========================================
    // FRONTEND UI TESTS
    // ==========================================
    {
      name: 'chromium-ui',

      testMatch: [
        /Frontend_auth-only\/tests\/.*\.spec\.js$/
      ],

      testIgnore: [
        /.*debug.*/,
        /.*example.*/,
        /.*firefox-test.*/
      ],

      use: {
        ...devices['Desktop Chrome'],

        baseURL: 'http://localhost:3000'
      }
    }
  ]
});

