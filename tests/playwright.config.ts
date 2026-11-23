import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: '../test-results',
  use: {
    baseURL: process.env.NONAME_APP_URL ?? 'http://127.0.0.1:3000',
    ...devices['Desktop Chrome'],
    screenshot: 'on',
    trace: 'on',
  },
  ...(process.env.NONAME_APP_URL ? {} : {
    webServer: {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      command: 'HOST=127.0.0.1 PORT=3000 pnpm dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  }),
});
