import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CHECKOUT_SELECTORS } from '../lib/constants';
import { WaitUtils, TIMEOUTS } from '../lib/waitUtils';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(CHECKOUT_SELECTORS.FIRST_NAME);
    this.lastNameInput = page.locator(CHECKOUT_SELECTORS.LAST_NAME);
    this.zipCodeInput = page.locator(CHECKOUT_SELECTORS.POSTAL_CODE);
    this.continueButton = page.locator(CHECKOUT_SELECTORS.CONTINUE_BUTTON);
  }

  async fillInformation(fName: string, lName: string, zip: string): Promise<void> {
    try {
      // Input validation
      if (!fName || !lName || !zip) {
        throw new Error('First name, last name, and zip code are required');
      }

      if (fName.length < 1 || lName.length < 1 || zip.length < 1) {
        throw new Error('All checkout fields must be at least 1 character long');
      }

      // Wait for form elements to be ready
      await WaitUtils.waitForVisible(this.firstNameInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.lastNameInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.zipCodeInput, TIMEOUTS.MEDIUM);

      // Fill form with safe operations
      await WaitUtils.safeFill(this.firstNameInput, fName, TIMEOUTS.MEDIUM);
      await WaitUtils.safeFill(this.lastNameInput, lName, TIMEOUTS.MEDIUM);
      await WaitUtils.safeFill(this.zipCodeInput, zip, TIMEOUTS.MEDIUM);
      
      // Click continue button
      await WaitUtils.safeClick(this.continueButton, TIMEOUTS.MEDIUM);
      
      // Wait for navigation to overview page or error
      await WaitUtils.waitForRace([
        this.page.waitForURL(/checkout-step-two/, { timeout: TIMEOUTS.NAVIGATION }),
        this.page.waitForTimeout(2000) // Brief wait for potential error
      ], TIMEOUTS.NAVIGATION);
      
      // Check for error after continue click
      const errorElement = this.page.locator('[data-test="error"]');
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new Error(`Checkout error: ${errorText}`);
      }
    } catch (error) {
      throw new Error(`Checkout failed: ${error.message}`);
    }
  }

  async validatePageLoaded(): Promise<void> {
    try {
      await WaitUtils.waitForVisible(this.firstNameInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.lastNameInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.zipCodeInput, TIMEOUTS.MEDIUM);
      await WaitUtils.waitForVisible(this.continueButton, TIMEOUTS.MEDIUM);
    } catch (error) {
      throw new Error(`Checkout page not loaded properly: ${error.message}`);
    }
  }
}