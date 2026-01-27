import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { getEnvironment } from './config/environments';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get current environment configuration
const env = getEnvironment();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: env.retries.test,
  reporter: [
    ['line'], // Shows progress in terminal
    ['html'], 
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      environmentInfo: {
        'Environment': env.name,
        'BaseURL': env.baseURL,
        'Browser': '${browserName}',
        'TestDate': '${testDate}'
      }
    }]
  ],
  
  // globalSetup: require.resolve('./global-setup.ts'),
  // globalTeardown: require.resolve('./global-teardown.ts'),
  
  use: {
    baseURL: env.baseURL,
    screenshot: env.screenshot,
    video: env.video,
    trace: env.trace,
    actionTimeout: env.timeout.action,
    navigationTimeout: env.timeout.navigation,
    headless: env.headless,
    slowMo: env.slowMo,
  },
  
  projects: [
    { 
      name: 'chromium', 
      use: { ...devices['Desktop Chrome'] } 
    },
    { 
      name: 'firefox', 
      use: { ...devices['Desktop Firefox'] } 
    },
    { 
      name: 'webkit', 
      use: { ...devices['Desktop Safari'] } 
    },
  ],
});