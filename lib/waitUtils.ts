// Wait and Timeout Configurations
import { expect } from '@playwright/test';
import { getTimeouts } from './timeoutConfig';

export const TIMEOUTS = getTimeouts(1); // Default to 1x multiplier

export class WaitUtils {
  /**
   * Wait for element to be visible with timeout
   */
  static async waitForVisible(locator: any, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout || TIMEOUTS.MEDIUM
    });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForHidden(locator: any, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: timeout || TIMEOUTS.MEDIUM
    });
  }

  /**
   * Wait for element to be enabled
   */
  static async waitForEnabled(locator: any, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'attached',
      timeout: timeout || TIMEOUTS.MEDIUM
    });
    await expect(locator).toBeEnabled({ timeout: timeout || TIMEOUTS.SHORT });
  }

  /**
   * Wait for element with retry logic
   */
  static async waitForWithRetry(
    locator: any, 
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await locator.waitFor({
          state,
          timeout: TIMEOUTS.SHORT
        });
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to wait for element state '${state}' after ${maxRetries} attempts: ${error}`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  /**
   * Wait for navigation to complete
   */
  static async waitForNavigation(page: any, timeout?: number): Promise<void> {
    await page.waitForLoadState('networkidle', {
      timeout: timeout || TIMEOUTS.NAVIGATION
    });
  }

  /**
   * Safe click with wait and error handling
   */
  static async safeClick(locator: any, timeout?: number): Promise<void> {
    try {
      await this.waitForVisible(locator, timeout);
      await this.waitForEnabled(locator, timeout);
      await locator.click();
    } catch (error) {
      throw new Error(`Failed to click element: ${error.message}`);
    }
  }

  /**
   * Safe fill with wait and error handling
   */
  static async safeFill(locator: any, value: string, timeout?: number): Promise<void> {
    try {
      if (!value) {
        throw new Error('Value cannot be empty for fill operation');
      }
      
      await this.waitForVisible(locator, timeout);
      await this.waitForEnabled(locator, timeout);
      await locator.clear();
      await locator.fill(value);
    } catch (error) {
      throw new Error(`Failed to fill element with value '${value}': ${error.message}`);
    }
  }

  /**
   * Safe select option with wait
   */
  static async safeSelectOption(locator: any, value: string, timeout?: number): Promise<void> {
    try {
      if (!value) {
        throw new Error('Select option value cannot be empty');
      }
      
      await this.waitForVisible(locator, timeout);
      await this.waitForEnabled(locator, timeout);
      await locator.selectOption(value);
    } catch (error) {
      throw new Error(`Failed to select option '${value}': ${error.message}`);
    }
  }

  /**
   * Wait for element text to contain value
   */
  static async waitForTextToContain(
    locator: any, 
    expectedText: string, 
    timeout?: number
  ): Promise<void> {
    try {
      await this.waitForVisible(locator, timeout);
      await expect(locator).toContainText(expectedText, { 
        timeout: timeout || TIMEOUTS.SHORT 
      });
    } catch (error) {
      throw new Error(`Expected text to contain '${expectedText}': ${error.message}`);
    }
  }

  /**
   * Wait for element count to be at least minimum
   */
  static async waitForElementCount(
    locator: any, 
    minCount: number, 
    timeout?: number
  ): Promise<void> {
    try {
      await locator.waitFor({
        state: 'attached',
        timeout: timeout || TIMEOUTS.MEDIUM
      });
      const count = await locator.count();
      if (count < minCount) {
        throw new Error(`Expected at least ${minCount} elements, found ${count}`);
      }
    } catch (error) {
      throw new Error(`Element count validation failed: ${error.message}`);
    }
  }

  /**
   * Wait for URL to match pattern
   */
  static async waitForURL(page: any, urlPattern: RegExp | string, timeout?: number): Promise<void> {
    try {
      await page.waitForURL(urlPattern, {
        timeout: timeout || TIMEOUTS.NAVIGATION
      });
    } catch (error) {
      const urlStr = typeof urlPattern === 'string' ? urlPattern : urlPattern.toString();
      throw new Error(`Failed to navigate to URL matching '${urlStr}': ${error.message}`);
    }
  }

  /**
   * Handle race conditions - wait for one of multiple conditions
   */
  static async waitForRace<T>(promises: Promise<T>[], timeout?: number): Promise<T> {
    try {
      return await Promise.race(promises);
    } catch (error) {
      throw new Error(`Race condition failed: ${error.message}`);
    }
  }
}