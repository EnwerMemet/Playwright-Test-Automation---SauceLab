import { test, expect } from '../lib/fixtures';
import { env } from '../lib/env';
import * as allure from "allure-js-commons";

test.describe('Inventory & Storefront Functionality', () => {

    test.beforeEach(async ({ loginPage, context, page }) => {
        await allure.epic("Web Shop 1.0");
        await allure.feature("Inventory Management");
        await allure.owner("Enwer");
        await allure.tags("UI", "Regression");
        await allure.link("https://saucedemo.com", "Main Site");

        
        await test.step('I am logged in and navigating to the product inventory', async () => {
            await loginPage.navigateTo('/');
            await loginPage.login(env.SAUCE_USERNAME, env.SAUCE_PASSWORD);
            await loginPage.navigateTo('/inventory.html');
        });
    });

    test('Add & Remove item from cart @report-demo', async ({ page }) => {
        await allure.story("E2E Purchase Journey");
        await allure.severity("critical");

        await test.step('I add the Sauce Labs Backpack to my cart', async () => {
            await page.click('#add-to-cart-sauce-labs-backpack');
            await allure.attachment("Action Log", "User added Sauce Labs Backpack to cart", "text/plain");
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });

        await test.step('I remove the item from my cart', async () => {
            await page.click('#remove-sauce-labs-backpack');
            await expect(page.locator('.shopping_cart_badge')).toBeHidden();
        });
    });

    test('User can filter products by price @regression', async ({ page }) => {
        await allure.story("Inventory Sorting Logic");
        await allure.severity("normal");

        await test.step('I apply the "Low to High" price filter', async () => {
            await page.selectOption('.product_sort_container', 'lohi');
        });

        await test.step('I verify the cheapest item is listed first', async () => {
            const firstPrice = await page.locator('.inventory_item_price').first().innerText();
            expect(firstPrice).toBe('$7.99');
        });
    });
});