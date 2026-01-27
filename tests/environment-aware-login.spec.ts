import { test, expect } from '../lib/fixtures';
import * as allure from "allure-js-commons";

test.describe('@authentication Environment-Aware Login Tests', () => {
  const env = process.env.TEST_ENV || 'development';
  
  test.beforeEach(async () => {
    await allure.epic("Authentication");
    await allure.feature("Environment-Aware Login");
    await allure.owner("Enwer");
    await allure.tags("authentication", "login", "environment");
    await allure.parameter("Environment", env);
  });

  test(`Environment validation for ${env}`, async ({ page }) => {
    await allure.story("Environment Configuration Validation");
    await allure.severity("critical");
    
    const baseURL = process.env.TEST_BASE_URL || 'https://www.saucedemo.com';
    const standardUser = process.env.TEST_STANDARD_USER || 'standard_user';
    const password = process.env.TEST_PASSWORD || 'secret_sauce';
    
    await allure.parameter("Base URL", baseURL);
    await allure.parameter("User", standardUser);
    
    await test.step(`I navigate to ${env} environment`, async () => {
      await page.goto(baseURL);
      await expect(page.locator('.login_logo')).toBeVisible({ timeout: 10000 });
    });

    await test.step('I verify the login form is available', async () => {
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('I login with environment-specific credentials', async () => {
      await page.locator('[data-test="username"]').fill(standardUser);
      await page.locator('[data-test="password"]').fill(password);
      await page.locator('[data-test="login-button"]').click();
      
      // Wait for successful login
      await expect(page).toHaveURL(/inventory.html/, { timeout: 15000 });
    });

    await test.step('I verify successful login in current environment', async () => {
      await expect(page.locator('.title')).toHaveText('Products');
      await expect(page.locator('.inventory_list')).toBeVisible();
      
      await allure.attachment("Login Success", `Successfully logged into ${env} environment`, "text/plain");
    });
  });

  test('Environment timeout validation', async ({ page }) => {
    await allure.story("Environment Configuration");
    await allure.severity("normal");
    
    const actionTimeout = parseInt(process.env.TEST_TIMEOUT || '10000');
    await allure.parameter("Action Timeout", actionTimeout + "ms");
    
    await test.step(`I validate timeout settings for ${env}`, async () => {
      const start = Date.now();
      
      try {
        // Try to find an element that doesn't exist to test timeout
        await page.locator('#non-existent-element').waitFor({ timeout: actionTimeout });
      } catch (error) {
        const elapsed = Date.now() - start;
        
        // Validate timeout is within reasonable range (Playwright may have delays)
        expect(elapsed).toBeGreaterThan(actionTimeout - 1000);
        expect(elapsed).toBeLessThan(actionTimeout + 2000);
        
        await allure.attachment("Timeout Validation", `Expected: ${actionTimeout}ms, Actual: ${elapsed}ms`, "text/plain");
      }
    });
  });
});