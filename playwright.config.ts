// Playwright configuration for different environments
import { defineConfig, devices } from '@playwright/test';
import { env } from './lib/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: !env.SLOW_MO, // Disable parallel for slow mode
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? env.RETRY_COUNT : 0,
  reporter: [
    ['line'], // Shows progress in terminal
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  
  use: {
    baseURL: env.BASE_URL,
    screenshot: 'only-on-failure',
    video: env.SLOW_MO ? 'on' : 'retain-on-failure', // Always record in slow mode
    trace: 'retain-on-failure',
    headless: env.HEADLESS === true,
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
  
  // Environment-specific settings (disabled for now - no dev server)
  // webServer: env.NODE_ENV === 'development' ? {
  //   command: 'npm run dev',
  //   port: 3000,
  // } : undefined,
  
  // Global timeout adjustments
  timeout: 30 * 1000 * (env.TIMEOUT_MULTIPLIER || 1), // Base 30s with multiplier
  
  // Worker configuration for CI/CD
  workers: process.env.CI ? 1 : 4,
});