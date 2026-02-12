import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CART_SELECTORS , INVENTORY_SELECTORS} from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;


  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(CART_SELECTORS.CARD_ITEM);
    this.checkoutButton = page.locator(CART_SELECTORS.CHECKOUT_BUTTON);
    this.continueShoppingButton = page.locator(CART_SELECTORS.CONTINUE_SHOPPING_BUTTON);
  }

  async clickCheckout(): Promise<void> {
    try {
      await WaitUtils.safeClick(this.checkoutButton, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForURL(this.page, /checkout-step-one/, TIMEOUTS.NAVIGATION);
    } catch (error) {
      throw new Error(`Checkout navigation failed: ${error.message}`);
    }
  }

  async waitForItemsToLoad(): Promise<void> {
    try {
      await WaitUtils.waitForElementCount(this.cartItems, 1, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Cart items failed to load: ${error.message}`);
    }
  }

  async getItemCount(): Promise<number> {
    try {
      await this.waitForItemsToLoad();
      return await this.cartItems.count();
    } catch (error) {
      throw new Error(`Failed to get item count: ${error.message}`);
    }
  }

  async validateCartItem(itemName: string, itemPrice: string): Promise<void> {
    try {
      const itemLocator = this.page.locator(`.cart_item:has-text("${itemName}")`);
      await WaitUtils.waitForVisible(itemLocator, TIMEOUTS.MEDIUM);
      
      const nameLocator = itemLocator.locator(INVENTORY_SELECTORS.ITEM_NAME);
      const priceLocator = itemLocator.locator(INVENTORY_SELECTORS.ITEM_PRICE);
      
      await WaitUtils.waitForTextToContain(nameLocator, itemName, TIMEOUTS.SHORT);
      await WaitUtils.waitForTextToContain(priceLocator, itemPrice, TIMEOUTS.SHORT);
    } catch (error) {
      throw new Error(`Cart item validation failed for '${itemName}': ${error.message}`);
    }
  }
}
