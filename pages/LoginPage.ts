import { Locator, Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOGIN_SELECTORS, COOKIE_CONFIG } from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils'; 

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page); 
    this.usernameInput = page.locator(LOGIN_SELECTORS.USERNAME_INPUT);
    this.passwordInput = page.locator(LOGIN_SELECTORS.PASSWORD_INPUT);
    this.loginButton = page.locator(LOGIN_SELECTORS.LOGIN_BUTTON);
    this.errorMessage = page.locator(LOGIN_SELECTORS.ERROR_MESSAGE);
  }
  
  async login(user: string, pass: string): Promise<void> {
    try {
      // Input validation
      if (!user || !pass) {
        throw new Error('Username and password are required');
      }

      // Wait for form elements to be ready
      await WaitUtils.waitForVisible(this.usernameInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.passwordInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.loginButton, TIMEOUTS.MEDIUM);

      // Fill form with safe operations
      await WaitUtils.safeFill(this.usernameInput, user, TIMEOUTS.MEDIUM);
      await WaitUtils.safeFill(this.passwordInput, pass, TIMEOUTS.MEDIUM);
      
      // Click login button
      await WaitUtils.safeClick(this.loginButton, TIMEOUTS.MEDIUM);

      // Wait for either successful navigation or error message
      await WaitUtils.waitForRace([
        this.page.waitForURL(/inventory.html/, { timeout: TIMEOUTS.NAVIGATION }),
        this.errorMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
      ], TIMEOUTS.NAVIGATION);

    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async loginViaCookie(context: BrowserContext, username: string): Promise<void> {
    try {
      if (!username) {
        throw new Error('Username is required for cookie login');
      }

      await context.addCookies([{
        name: COOKIE_CONFIG.SESSION_USERNAME,
        value: username,
        domain: COOKIE_CONFIG.DOMAIN,
        path: COOKIE_CONFIG.PATH
      }]);
    } catch (error) {
      throw new Error(`Cookie login failed: ${error.message}`);
    }
  }

  async waitForLoginSuccess(timeout?: number): Promise<void> {
    try {
      await WaitUtils.waitForURL(this.page, /inventory.html/, timeout);
    } catch (error) {
      throw new Error(`Login success timeout: ${error.message}`);
    }
  }

  async waitForErrorMessage(timeout?: number): Promise<string> {
    try {
      await WaitUtils.waitForVisible(this.errorMessage, timeout);
      const errorText = await this.errorMessage.textContent();
      if (!errorText) {
        throw new Error('Error message element is visible but contains no text');
      }
      return errorText;
    } catch (error) {
      throw new Error(`Error message not found: ${error.message}`);
    }
  }

  async isLoginSuccessful(): Promise<boolean> {
    try {
      await this.page.waitForURL(/inventory.html/, { timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  async hasError(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }
}