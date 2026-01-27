import { Page, Locator } from '@playwright/test';

export class RetryHelper {
  /**
   * Retry an operation with exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
        }
        
        // Exponential backoff
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Wait for element to be stable (not moving/changing)
   */
  static async waitForStableElement(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<Locator> {
    const element = page.locator(selector);
    
    await RetryHelper.withRetry(async () => {
      await element.waitFor({ state: 'visible', timeout });
      
      // Check if element is stable (not moving)
      const boundingBox1 = await element.boundingBox();
      await new Promise(resolve => setTimeout(resolve, 100));
      const boundingBox2 = await element.boundingBox();
      
      if (!boundingBox1 || !boundingBox2) {
        throw new Error('Element bounding box not available');
      }
      
      if (Math.abs(boundingBox1.x - boundingBox2.x) > 1 || 
          Math.abs(boundingBox1.y - boundingBox2.y) > 1) {
        throw new Error('Element is still moving');
      }
    }, 3, 500);
    
    return element;
  }

  /**
   * Safe click with retry and hover preparation
   */
  static async safeClick(
    page: Page,
    selector: string,
    options: { force?: boolean; timeout?: number } = {}
  ): Promise<void> {
    const element = await RetryHelper.waitForStableElement(page, selector, options.timeout);
    
    await RetryHelper.withRetry(async () => {
      // Hover first to ensure element is interactive
      await element.hover();
      await element.click({ force: options.force });
    }, 3, 500);
  }

  /**
   * Safe fill with retry and validation
   */
  static async safeFill(
    page: Page,
    selector: string,
    value: string,
    options: { clear?: boolean; timeout?: number } = {}
  ): Promise<void> {
    const element = await RetryHelper.waitForStableElement(page, selector, options.timeout);
    
    await RetryHelper.withRetry(async () => {
      if (options.clear !== false) {
        await element.clear();
        await element.fill('');
      }
      await element.fill(value);
      
      // Validate the fill worked
      const filledValue = await element.inputValue();
      if (filledValue !== value) {
        throw new Error(`Fill validation failed. Expected: ${value}, Got: ${filledValue}`);
      }
    }, 3, 500);
  }

  /**
   * Network retry wrapper for API calls
   */
  static async withNetworkRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 5,
    timeout: number = 30000
  ): Promise<T> {
    return RetryHelper.withRetry(operation, maxRetries, 1000);
  }
}