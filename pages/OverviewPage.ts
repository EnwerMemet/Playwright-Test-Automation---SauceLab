import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { OVERVIEW_SELECTORS } from '../lib/constants';

export class OverviewPage extends BasePage {
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemName = page.locator(OVERVIEW_SELECTORS.ITEM_NAME);
    this.itemPrice = page.locator(OVERVIEW_SELECTORS.ITEM_PRICE);
    this.finishButton = page.locator(OVERVIEW_SELECTORS.FINISH_BUTTON);
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}