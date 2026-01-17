import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly firstItemTitle: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemAddToCartButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstItemTitle = page.locator('.inventory_item_name').first();
    this.firstItemPrice = page.locator('.inventory_item_price').first();
    this.firstItemAddToCartButton = page.locator('.btn_inventory').first();
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async getFirstItemName() {
    return await this.firstItemTitle.textContent();
  }
  async getFirstItemPrice() {
    return await this.firstItemPrice.textContent();
  }

  async addFirstItemToCart() {
    await this.firstItemAddToCartButton.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}