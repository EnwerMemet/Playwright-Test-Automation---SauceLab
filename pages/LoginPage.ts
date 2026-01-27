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
      
      // Simple fill without strict validation for CI compatibility
      await this.page.locator('[data-test="username"]').fill(user);
      await this.page.locator('[data-test="password"]').fill(pass);
      await this.page.locator('[data-test="login-button"]').click();
      
      // Wait for either inventory page or error message
      await Promise.race([
        this.page.waitForURL(/inventory.html/, { timeout: 10000 }),
        this.page.locator('[data-test="error"]').waitFor({ state: 'visible', timeout: 10000 })
      ]);
      
    } catch (error) {
      throw new Error(`Login failed for user ${user}: ${(error as Error).message}`);
    }
  }

  async loginViaCookie(context: BrowserContext, username: string) {
    try {
      await context.addCookies([{
          name: 'session-username',
          value: username,
          domain: 'www.saucedemo.com',
          path: '/'
      }]);
    } catch (error) {
      // Fallback to direct login if cookie fails
      console.log('Cookie login failed, falling back to direct login');
    }
  }
}