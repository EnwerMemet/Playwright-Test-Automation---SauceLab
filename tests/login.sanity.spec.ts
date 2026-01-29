import { test, expect } from '../lib/fixtures';
import * as allure from "allure-js-commons";

test.describe('Authentication Suite', () => {
  const user = process.env.SAUCE_USERNAME || 'standard_user';
  const pass = process.env.SAUCE_PASSWORD || 'secret_sauce';

  test('User should be able to login successfully @sanity @regression', async ({ loginPage, page }) => {
    await allure.description("Valid login verification");
    await allure.owner("Enwer");
    await allure.severity("critical");

    await test.step('I navigate to the landing page and enter my valid credentials', async () => {
      await loginPage.navigateTo('/');
      await loginPage.login(user, pass);
    });

    await test.step('I should be redirected to the products inventory page', async () => {
      await expect(page).toHaveURL(/inventory.html/);
    });
  });

  test('API Login with Password bypass @advanced @performance', async ({ loginPage, page, context, request }) => {
    await allure.severity("critical");
    await allure.story("Authentication Bypass");

    await test.step('I bypass the login UI by authenticating via API and injecting my session cookies', async () => {
      const response = await request.post('https://www.saucedemo.com/api/login', {
        data: { username: user, password: pass }
      });
      await allure.attachment("API Response", await response.text(), "application/json");

      await context.addCookies([{
        name: 'session-username', value: user, domain: 'www.saucedemo.com', path: '/'
      }]);
    });

    await test.step('I navigate directly to the inventory and confirm I have access to the products', async () => {
      await loginPage.navigateTo('/inventory.html');
      await expect(page.locator('.title')).toHaveText('Products');
    });
  });

  test('Login page should show error for locked out user @regression', async ({ loginPage, page }) => {
    await allure.description("Locked out user verification");
    await allure.owner("Enwer");
    await allure.severity("critical");

    const expectedError = 'Sorry, this user has been locked out.';

    await test.step('I attempt to log in using a locked-out account', async () => {
      await loginPage.navigateTo('/');
      await loginPage.login('locked_out_user', 'secret_sauce');
    });

    await test.step('I should see an error message stating that my account is locked out', async () => {
      const errorLocator = page.locator('[data-test="error"]');
      await expect.soft(errorLocator).toBeVisible();
      await expect(errorLocator).toContainText(expectedError);
    });
  });
});