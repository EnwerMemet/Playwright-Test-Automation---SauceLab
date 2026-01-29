import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CART_SELECTORS } from '../lib/constants';

export class CartPage extends BasePage {
  static clickCheckout() {
      throw new Error('Method not implemented.');
  }
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;


  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator(CART_SELECTORS.CHECKOUT_BUTTON);
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
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