import { Locator, Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage'; 

// 1. 'extends' tells TypeScript that LoginPage is a "child" of BasePage
export class LoginPage extends BasePage {
// 2. Define the locators (selectors) that only exist on the Login page
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    // 3. 'super(page)' calls the constructor of the BasePage.
    // This is like saying: "Hey BasePage, here is the browser page, please set it up!"
    super(page); 
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
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