import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CART_SELECTORS } from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;


  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator(CART_SELECTORS.CHECKOUT_BUTTON);
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
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
      
      const nameLocator = itemLocator.locator('.inventory_item_name');
      const priceLocator = itemLocator.locator('.inventory_item_price');
      
      await WaitUtils.waitForTextToContain(nameLocator, itemName, TIMEOUTS.SHORT);
      await WaitUtils.waitForTextToContain(priceLocator, itemPrice, TIMEOUTS.SHORT);
    } catch (error) {
      throw new Error(`Cart item validation failed for '${itemName}': ${error.message}`);
    }
  }
}


/*
1. I should be anle to select an intem and add it to the card. 
2. I should be able to view the item in the cart page.
3. i should click the shipping cart icon to navigate to the cart page.
4. verify the item details in the cart page.
5. I should be able to click the checkout button to proceed to checkout.
6. I should be able to fill in the checkout information and continue to the next step.
7. ishould check the checkout overview page for item details.
8. i should click the finish button to complete the purchase.
9. i should see the order confirmation message.
10. I should be able to navigate to the home page.

*/