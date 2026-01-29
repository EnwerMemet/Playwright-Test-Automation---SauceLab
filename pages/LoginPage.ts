import { Locator, Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOGIN_SELECTORS, COOKIE_CONFIG } from '../lib/constants'; 

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page); 
    this.usernameInput = page.locator(LOGIN_SELECTORS.USERNAME_INPUT);
    this.passwordInput = page.locator(LOGIN_SELECTORS.PASSWORD_INPUT);
    this.loginButton = page.locator(LOGIN_SELECTORS.LOGIN_BUTTON);
  }
  
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async loginViaCookie(context: BrowserContext, username: string) {
    await context.addCookies([{
        name: COOKIE_CONFIG.SESSION_USERNAME,
        value: username,
        domain: COOKIE_CONFIG.DOMAIN,
        path: COOKIE_CONFIG.PATH
    }]);
  }
}