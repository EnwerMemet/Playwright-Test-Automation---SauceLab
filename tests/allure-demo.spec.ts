import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as allure from "allure-js-commons";

test.describe('Allure Reporting Demonstration', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page, context }) => {
        await allure.epic("Web Shop 1.0");
        await allure.feature("Inventory Management");
        await allure.owner("QA Engineer");
        await allure.tags("UI", "Regression");
        await allure.link("https://saucedemo.com", "Main Site");

        loginPage = new LoginPage(page);
        const user = process.env.SAUCE_USERNAME || '';
        
        await test.step('Global Setup: Inject Session Cookie', async () => {
            await loginPage.loginViaCookie(context, user);
            await loginPage.navigateTo('/inventory.html');
        });
    });

    test('Professional E2E Purchase Flow @report-demo', async ({ page }) => {
        await allure.story("E2E Purchase Journey");
        await allure.description("E2E flow with enriched reporting.");
        await allure.severity("critical");

        await test.step('Action: Add Item and Log Detail', async () => {
            await page.click('#add-to-cart-sauce-labs-backpack');
            await allure.attachment("Product Info", "Added: Sauce Labs Backpack", "text/plain");
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });

        await test.step('Cleanup: Remove item from cart', async () => {
            await page.click('#remove-sauce-labs-backpack');
            await expect(page.locator('.shopping_cart_badge')).toBeHidden();
        });
    });

    test('User can filter products by price @regression', async ({ page }) => {
        await allure.story("Inventory Sorting Logic");
        await allure.description("Tests price filter reordering.");
        await allure.severity("normal");

        await test.step('Apply "Low to High" filter', async () => {
            await page.selectOption('.product_sort_container', 'lohi');
            const firstPrice = await page.locator('.inventory_item_price').first().innerText();
            expect(firstPrice).toBe('$7.99');
        });
    });
});