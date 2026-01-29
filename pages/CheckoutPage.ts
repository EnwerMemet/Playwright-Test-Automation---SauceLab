import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CHECKOUT_SELECTORS } from '../lib/constants';

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

  async fillInformation(fName: string, lName: string, zip: string) {
    await this.firstNameInput.fill(fName);
    await this.lastNameInput.fill(lName);
    await this.zipCodeInput.fill(zip);
    await this.continueButton.click();
  }
}