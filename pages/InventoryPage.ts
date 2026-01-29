import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { INVENTORY_SELECTORS } from '../lib/constants';

export class InventoryPage extends BasePage {
  readonly firstItemTitle: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemAddToCartButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstItemTitle = page.locator(INVENTORY_SELECTORS.ITEM_NAME).first();
    this.firstItemPrice = page.locator(INVENTORY_SELECTORS.ITEM_PRICE).first();
    this.firstItemAddToCartButton = page.locator(INVENTORY_SELECTORS.ADD_TO_CART_BUTTON).first();
    this.shoppingCartLink = page.locator(INVENTORY_SELECTORS.SHOPPING_CART_LINK);
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