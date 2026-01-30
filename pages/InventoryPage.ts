import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { INVENTORY_SELECTORS, PRODUCT_SELECTORS } from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils';

export class InventoryPage extends BasePage {
  readonly firstItemTitle: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemAddToCartButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortContainer: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstItemTitle = page.locator(INVENTORY_SELECTORS.ITEM_NAME).first();
    this.firstItemPrice = page.locator(INVENTORY_SELECTORS.ITEM_PRICE).first();
    this.firstItemAddToCartButton = page.locator(INVENTORY_SELECTORS.ADD_TO_CART_BUTTON).first();
    this.shoppingCartLink = page.locator(INVENTORY_SELECTORS.SHOPPING_CART_LINK);
    this.shoppingCartBadge = page.locator(INVENTORY_SELECTORS.SHOPPING_CART_BADGE);
    this.sortContainer = page.locator(INVENTORY_SELECTORS.PRODUCT_SORT_CONTAINER);
    this.pageHeader = page.locator(INVENTORY_SELECTORS.TITLE);
  }

  async getFirstItemName(): Promise<string> {
    try {
      await WaitUtils.waitForVisible(this.firstItemTitle, TIMEOUTS.MEDIUM);
      const name = await this.firstItemTitle.textContent();
      if (!name) {
        throw new Error('First item name is empty');
      }
      return name;
    } catch (error) {
      throw new Error(`Failed to get first item name: ${error.message}`);
    }
  }

  async getFirstItemPrice(): Promise<string> {
    try {
      await WaitUtils.waitForVisible(this.firstItemPrice, TIMEOUTS.MEDIUM);
      const price = await this.firstItemPrice.textContent();
      if (!price) {
        throw new Error('First item price is empty');
      }
      return price;
    } catch (error) {
      throw new Error(`Failed to get first item price: ${error.message}`);
    }
  }

  async addFirstItemToCart(): Promise<void> {
    try {
      await WaitUtils.safeClick(this.firstItemAddToCartButton, TIMEOUTS.MEDIUM);
      
      // Wait for cart badge to update to confirm item was added
      await WaitUtils.waitForVisible(this.shoppingCartBadge, TIMEOUTS.SHORT);
      await this.page.waitForTimeout(500); // Brief wait for cart badge animation
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async goToCart(): Promise<void> {
    try {
      await WaitUtils.safeClick(this.shoppingCartLink, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForURL(this.page, /cart\.html/, TIMEOUTS.NAVIGATION);
    } catch (error) {
      throw new Error(`Failed to navigate to cart: ${error.message}`);
    }
  }

  async waitForPageLoad(): Promise<void> {
    try {
      await WaitUtils.waitForVisible(this.pageHeader, TIMEOUTS.NAVIGATION);
      await WaitUtils.waitForVisible(this.firstItemTitle, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Inventory page failed to load: ${error.message}`);
    }
  }

  async filterByPrice(sortValue: string): Promise<void> {
    try {
      if (!sortValue) {
        throw new Error('Sort value is required for price filtering');
      }
      
      await WaitUtils.safeSelectOption(this.sortContainer, sortValue, TIMEOUTS.MEDIUM);
      await this.page.waitForTimeout(1000); // Allow time for sorting animation
    } catch (error) {
      throw new Error(`Price filtering failed: ${error.message}`);
    }
  }

  async addToCartByName(productName: string): Promise<void> {
    try {
      if (!productName) {
        throw new Error('Product name is required');
      }
      
      // Find the add to cart button for the specific product
      const productLocator = this.page.locator(`.inventory_item:has-text("${productName}")`);
      const addToCartButton = productLocator.locator('.btn_inventory');
      
      await WaitUtils.waitForVisible(addToCartButton, TIMEOUTS.MEDIUM);
      await WaitUtils.safeClick(addToCartButton, TIMEOUTS.MEDIUM);
      
      // Wait for cart badge to update
      await WaitUtils.waitForVisible(this.shoppingCartBadge, TIMEOUTS.SHORT);
    } catch (error) {
      throw new Error(`Failed to add '${productName}' to cart: ${error.message}`);
    }
  }
}