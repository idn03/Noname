import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: process.env.NONAME_APP_URL ?? 'http://127.0.0.1:3000',
    ...devices['Desktop Chrome'],
    screenshot: 'on',
    trace: 'on',
  },
  ...(process.env.NONAME_APP_URL ? {} : {
    webServer: {
      command: 'HOST=127.0.0.1 PORT=3000 npm run dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  }),
});
