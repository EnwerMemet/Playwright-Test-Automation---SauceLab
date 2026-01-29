import { test, expect } from '../lib/fixtures';
import { env } from '../lib/env';
import { URLS, LOGIN_SELECTORS, INVENTORY_SELECTORS, } from '../lib/constants';
import { USERS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../lib/testData';
import * as allure from "allure-js-commons";


test.describe('Authentication Suite', () => {

  test('User should be able to login successfully @sanity @regression', async ({ loginPage, page }) => {
    await allure.description("Valid login verification");
    await allure.owner("Enwer");
    await allure.severity("critical");

    await test.step('I navigate to the landing page and enter my valid credentials', async () => {
      await loginPage.navigateTo('/');
      await loginPage.login(env.SAUCE_USERNAME, env.SAUCE_PASSWORD);
    });

    await test.step('I should be redirected to the products inventory page', async () => {
      await expect(page).toHaveURL(/inventory.html/);
    });
  });


  test('Login page should show error for locked out user @regression', async ({ loginPage, page }) => {
    await allure.description("Locked out user verification");
    await allure.owner("Enwer");
    await allure.severity("critical");

    const expectedError = ERROR_MESSAGES.LOCKED_OUT;

    await test.step('I attempt to log in using a locked-out account', async () => {
      await loginPage.navigateTo(URLS.LOGIN);
      await loginPage.login(USERS.LOCKED_OUT, env.SAUCE_PASSWORD);
    });

    await test.step('I should see an error message stating that my account is locked out', async () => {
      const errorLocator = page.locator(LOGIN_SELECTORS.ERROR_MESSAGE);
      await expect.soft(errorLocator).toBeVisible();
      await expect(errorLocator).toContainText(expectedError);
    });
  });
});