import { test, expect } from '../lib/fixtures';
import { env } from '../lib/env';
import * as allure from "allure-js-commons";

test('User should be able to add item to cart and checkout successfully @sanity @regression', async ({ loginPage, inventoryPage, cartPage, checkoutPage, overviewPage, page }) => {

    await allure.owner("Enwer");
    await allure.severity("critical");

    await test.step('I log into the application with my credentials', async () => {
        await loginPage.navigateTo('/');
        await loginPage.login(env.SAUCE_USERNAME, env.SAUCE_PASSWORD);
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
        await expect(overviewPage.itemName).toHaveText(firstName!);
        await expect(overviewPage.itemPrice).toHaveText(firstPrice!);
        await overviewPage.clickFinish();
    });

    await test.step('I should see a confirmation message for my successful order', async () => {
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });
});