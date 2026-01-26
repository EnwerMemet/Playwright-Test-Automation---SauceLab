import { test, expect } from '../lib/fixtures';
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
            await loginPage.navigateTo('/');
            await loginPage.login(process.env.SAUCE_USERNAME || 'standard_user', process.env.SAUCE_PASSWORD || 'secret_sauce');
        });

        await test.step(`When I add ${product.name} to the cart`, async () => {
            await page.click(`//div[text()="${product.name}"]/../../..//button`);
            await inventoryPage.goToCart();
        });

        await test.step('And I verify the item and proceed to checkout', async () => {
            await expect(page.locator('.inventory_item_name')).toHaveText(product.name);
            await expect(page.locator('.inventory_item_price')).toHaveText(product.price);
            await cartPage.clickCheckout();
        });

        await test.step('And I complete the shipping information', async () => {
            await checkoutPage.fillInformation('Data', 'Tester', '12345');
        });

        await test.step('Then the order should be successful', async () => {
            await overviewPage.clickFinish();
            await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        });
    });
});