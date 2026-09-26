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
    // CHROMIUM - DESKTOP
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

        baseURL: 'http://localhost:3000',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    },

    // ==========================================
    // FIREFOX - DESKTOP
    // ==========================================
    {
      name: 'firefox-ui',

      testMatch: [
        /Frontend_auth-only\/tests\/.*\.spec\.js$/
      ],

      testIgnore: [
        /.*debug.*/,
        /.*example.*/,
        /.*firefox-test.*/
      ],

      use: {
        ...devices['Desktop Firefox'],

        baseURL: 'http://localhost:3000',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    },

    // ==========================================
    // WEBKIT - DESKTOP / SAFARI
    // ==========================================
    {
      name: 'webkit-ui',

      testMatch: [
        /Frontend_auth-only\/tests\/.*\.spec\.js$/
      ],

      testIgnore: [
        /.*debug.*/,
        /.*example.*/,
        /.*firefox-test.*/
      ],

      use: {
        ...devices['Desktop Safari'],

        baseURL: 'http://localhost:3000',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    },

    // ==========================================
    // MOBILE CHROME
    // ==========================================
    {
      name: 'mobile-chrome',

      testMatch: [
        /Frontend_auth-only\/tests\/.*\.spec\.js$/
      ],

      testIgnore: [
        /.*debug.*/,
        /.*example.*/,
        /.*firefox-test.*/
      ],

      use: {
        ...devices['Pixel 5'],

        baseURL: 'http://localhost:3000',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    },

    // ==========================================
    // MOBILE SAFARI
    // ==========================================
    {
      name: 'mobile-safari',

      testMatch: [
        /Frontend_auth-only\/tests\/.*\.spec\.js$/
      ],

      testIgnore: [
        /.*debug.*/,
        /.*example.*/,
        /.*firefox-test.*/
      ],

      use: {
        ...devices['iPhone 13'],

        baseURL: 'http://localhost:3000',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    }
  ]
});
