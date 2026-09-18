import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,

    trace: 'on-first-retry',

    acceptDownloads: true,

    screenshot: 'only-on-failure',

    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },
  ],
});