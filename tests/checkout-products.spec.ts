import { test, expect } from '../lib/fixtures';
import { env } from '../lib/env';
import { URLS, INVENTORY_SELECTORS, COMPLETE_SELECTORS } from '../lib/constants';
import { TEST_DATA, SUCCESS_MESSAGES } from '../lib/testData';
import * as allure from "allure-js-commons";
import products from '../data/products.json';

products.forEach((product) => {
    test(`E2E Checkout Flow for: ${product.name}`, async ({ 
        loginPage, 
        inventoryPage, 
        cartPage, 
        checkoutPage, 
        overviewPage, 
        page 
    }) => {
        await allure.owner("Enwer");
        await allure.parameter("Product Name", product.name);

        await test.step('Given I log into the application', async () => {
            await loginPage.navigateTo(URLS.LOGIN);
            await loginPage.login(env.SAUCE_USERNAME, env.SAUCE_PASSWORD);
        });

        await test.step(`When I add ${product.name} to the cart`, async () => {
            await page.click(`//div[text()="${product.name}"]/../../..//button`);
            await inventoryPage.goToCart();
        });

        await test.step('And I verify the item and proceed to checkout', async () => {
            await expect(page.locator(INVENTORY_SELECTORS.ITEM_NAME)).toHaveText(product.name);
            await expect(page.locator(INVENTORY_SELECTORS.ITEM_PRICE)).toHaveText(product.price);
            await cartPage.clickCheckout();
        });

        await test.step('And I complete the shipping information', async () => {
            await checkoutPage.fillInformation(TEST_DATA.FIRST_NAME, TEST_DATA.LAST_NAME, TEST_DATA.POSTAL_CODE);
        });

        await test.step('Then the order should be successful', async () => {
            await overviewPage.clickFinish();
            await expect(page.locator(COMPLETE_SELECTORS.COMPLETE_HEADER)).toHaveText(SUCCESS_MESSAGES.ORDER_COMPLETE);
        });
    });
});