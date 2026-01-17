import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OverviewPage extends BasePage {
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemName = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}