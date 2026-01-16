import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly titleText: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCart: Locator;

  constructor(page: Page) {
    super(page);
    this.titleText = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCart = page.locator('.shopping_cart_link');
  }

  async getTitle() {
    return await this.titleText.textContent();
  }
}