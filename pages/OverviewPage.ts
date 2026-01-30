import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { OVERVIEW_SELECTORS, COMPLETE_SELECTORS } from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils';

export class OverviewPage extends BasePage {
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.itemName = page.locator(OVERVIEW_SELECTORS.ITEM_NAME);
    this.itemPrice = page.locator(OVERVIEW_SELECTORS.ITEM_PRICE);
    this.finishButton = page.locator(OVERVIEW_SELECTORS.FINISH_BUTTON);
    this.completeHeader = page.locator(COMPLETE_SELECTORS.COMPLETE_HEADER);
  }

  async clickFinish(): Promise<void> {
    try {
      await WaitUtils.safeClick(this.finishButton, TIMEOUTS.MEDIUM);
      
      // Wait for completion page
      await WaitUtils.waitForURL(this.page, /checkout-complete/, TIMEOUTS.NAVIGATION);
      await WaitUtils.waitForVisible(this.completeHeader, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Failed to complete order: ${error.message}`);
    }
  }

  async validatePageLoaded(): Promise<void> {
    try {
      await WaitUtils.waitForVisible(this.itemName, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.itemPrice, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.finishButton, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Overview page not loaded properly: ${error.message}`);
    }
  }

  async validateOrderItem(expectedName: string, expectedPrice: string): Promise<void> {
    try {
      await WaitUtils.waitForTextToContain(this.itemName, expectedName, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForTextToContain(this.itemPrice, expectedPrice, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Order validation failed for '${expectedName}': ${error.message}`);
    }
  }
}