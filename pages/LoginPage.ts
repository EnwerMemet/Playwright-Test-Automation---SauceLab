import { Locator, Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage'; 

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page); 
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }
  
  async login(user: string, pass: string) {
    try {
      // Wait for inputs to be ready
      await this.waitForElement('[data-test="username"]');
      await this.waitForElement('[data-test="password"]');
      
      // Fill credentials with validation
      await this.safeFill('[data-test="username"]', user);
      await this.safeFill('[data-test="password"]', pass);
      
      // Ensure button is clickable
      await this.waitForElement('[data-test="login-button"]');
      await this.safeClick('[data-test="login-button"]');
      
      // Wait for either inventory page or error message
      await Promise.race([
        this.page.waitForURL(/inventory.html/, { timeout: 5000 }),
        this.page.locator('[data-test="error"]').waitFor({ state: 'visible', timeout: 5000 })
      ]);
      
    } catch (error) {
      throw new Error(`Login failed for user ${user}: ${(error as Error).message}`);
    }
  }

  async loginViaCookie(context: BrowserContext, username: string) {
    await context.addCookies([{
        name: 'session-username',
        value: username,
        domain: 'www.saucedemo.com',
        path: '/'
    }]);
  }
}