import { test, expect } from '../lib/fixtures';
import * as allure from "allure-js-commons";

test.describe('@e2e Purchase Journey Tests', () => {
    test.beforeEach(async () => {
        await allure.epic("E-commerce");
        await allure.feature("End-to-End Purchase");
        await allure.owner("Enwer");
        await allure.tags("e2e", "purchase", "critical-path");
    });

    test('User should be able to add item to cart and checkout successfully @sanity @regression @critical-path', async ({ loginPage, inventoryPage, cartPage, checkoutPage, overviewPage, page }) => {
        await allure.story("Complete Purchase Journey");
        await allure.severity("critical");

        await allure.owner("Enwer");
        await allure.severity("critical");

        await test.step('I log into the application with my credentials', async () => {
            await loginPage.navigateTo('/');
            await loginPage.login(process.env.SAUCE_USERNAME || 'standard_user', process.env.SAUCE_PASSWORD || 'secret_sauce');
        });

        let firstName: string | null;
        let firstPrice: string | null;

        await test.step('I select the first available product and navigate to my cart', async () => {
            firstName = await inventoryPage.getFirstItemName();
            firstPrice = await inventoryPage.getFirstItemPrice();
            await allure.attachment("Selected Item", `Name: ${firstName}, Price: ${firstPrice}`, "text/plain");
            await inventoryPage.addFirstItemToCart();
            await inventoryPage.goToCart();
        });

        await test.step('I verify that the correct item is in my cart and proceed to checkout', async () => {
            await expect(page).toHaveURL(/cart.html/);
            await expect(page.locator('.inventory_item_name')).toHaveText(firstName!);
            await expect(page.locator('.inventory_item_price')).toHaveText(firstPrice!);
            await cartPage.clickCheckout();
        });

        await test.step('I fill in my personal shipping information', async () => {
            const suffix = Math.floor(Math.random() * 1000);
            await checkoutPage.fillInformation(`User${suffix}`, `Tester${suffix}`, `123${suffix}`);
        });

        await test.step('I review my order summary and finalize the purchase', async () => {
            await expect(page).toHaveURL(/checkout-step-two.html/);
            await expect(page.locator('.inventory_item_name')).toHaveText(firstName!);
            await expect(page.locator('.inventory_item_price')).toHaveText(firstPrice!);
            await overviewPage.clickFinish();
        });

        await test.step('I should see a confirmation message for my successful order', async () => {
            await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        });
    });
});