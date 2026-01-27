import { Page, Locator } from '@playwright/test';
import { RetryHelper } from '../lib/retry-helper';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string, options: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' } = {}) {
    await RetryHelper.withRetry(async () => {
      await this.page.goto(path, {
        timeout: options.timeout || 30000,
        waitUntil: options.waitUntil || 'domcontentloaded'
      });
    }, 3, 1000);
  }

  async safeClick(selector: string, options: { force?: boolean; timeout?: number } = {}) {
    await RetryHelper.safeClick(this.page, selector, options);
  }

  async safeFill(selector: string, value: string, options: { clear?: boolean; timeout?: number } = {}) {
    await RetryHelper.safeFill(this.page, selector, value, options);
  }

  async waitForElement(selector: string, state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible', timeout: number = 10000) {
    await RetryHelper.withRetry(async () => {
      await this.page.locator(selector).waitFor({ state, timeout });
    }, 3, 500);
  }

  async waitForNetworkIdle(timeout: number = 10000) {
    await RetryHelper.withRetry(async () => {
      await this.page.waitForLoadState('networkidle', { timeout });
    }, 2, 1000);
  }

  async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.waitForElement(selector, 'visible', timeout);
      return true;
    } catch {
      return false;
    }
  }

  async getElementText(selector: string, timeout: number = 5000): Promise<string | null> {
    try {
      const element = await RetryHelper.waitForStableElement(this.page, selector, timeout);
      return await element.textContent();
    } catch {
      return null;
    }
  }
}



