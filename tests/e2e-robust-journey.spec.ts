import { test, expect } from '../lib/fixtures';
import * as allure from "allure-js-commons";

test.describe('@e2e Robust Purchase Journey Tests', () => {
    test.beforeEach(async () => {
        await allure.epic("E-commerce");
        await allure.feature("End-to-End Purchase");
        await allure.owner("Enwer");
        await allure.tags("e2e", "purchase", "critical-path", "robust");
    });

    test('User should be able to add item to cart and checkout successfully with error handling @sanity @regression @critical-path @robust', async ({ loginPage, inventoryPage, page }) => {
        await allure.story("Complete Purchase Journey");
        await allure.severity("critical");

        let firstName: string | null;
        let firstPrice: string | null;

        await test.step('I log into the application with resilient retry logic', async () => {
            await allure.parameter("Retry Strategy", "Exponential Backoff");

            // Navigate first, then login
            await loginPage.navigateTo('/');
            await loginPage.login(
                process.env.SAUCE_USERNAME || 'standard_user',
                process.env.SAUCE_PASSWORD || 'secret_sauce'
            );

            // Wait for page to stabilize
            await loginPage.waitForNetworkIdle();
        });

        await test.step('I select the first available product with stability checks', async () => {
            // Wait for inventory to be fully loaded
            await page.waitForSelector('.inventory_item');

            // Get product details with direct page access
            firstName = await page.locator('.inventory_item_name').first().textContent();
            firstPrice = await page.locator('.inventory_item_price').first().textContent();

            if (!firstName || !firstPrice) {
                throw new Error('Failed to retrieve product information');
            }

            await allure.attachment("Selected Item", `Name: ${firstName}, Price: ${firstPrice}`, "text/plain");

            // Add to cart with direct page access
            await page.locator('.btn_inventory').first().click();

            // Verify cart badge appears
            await expect(page.locator('.shopping_cart_badge')).toBeVisible();

            // Navigate to cart
            await page.locator('.shopping_cart_link').click();
        });

        await test.step('I verify cart contents and proceed to checkout with validation', async () => {
            await expect(page).toHaveURL(/cart.html/, { timeout: 10000 });

            // Verify item in cart with retry
            await inventoryPage.waitForElement('.inventory_item_name');
            await expect(page.locator('.inventory_item_name')).toHaveText(firstName!, { timeout: 5000 });
            await expect(page.locator('.inventory_item_price')).toHaveText(firstPrice!, { timeout: 5000 });

            // Proceed to checkout
            await inventoryPage.safeClick('#checkout');
        });

        await test.step('I fill shipping information with validation', async () => {
            await expect(page).toHaveURL(/checkout-step-one.html/, { timeout: 10000 });

            const suffix = Math.floor(Math.random() * 1000);

            // Fill form with safe fill and validation
            await inventoryPage.safeFill('[data-test="firstName"]', `User${suffix}`);
            await inventoryPage.safeFill('[data-test="lastName"]', `Tester${suffix}`);
            await inventoryPage.safeFill('[data-test="postalCode"]', `123${suffix}`);

            // Continue to overview
            await inventoryPage.safeClick('[data-test="continue"]');
        });

        await test.step('I review order and complete purchase with stability checks', async () => {
            await expect(page).toHaveURL(/checkout-step-two.html/, { timeout: 10000 });

            // Verify order summary
            await inventoryPage.waitForElement('.summary_info');
            await expect(page.locator('.inventory_item_name')).toHaveText(firstName!);
            await expect(page.locator('.inventory_item_price')).toHaveText(firstPrice!);

            // Complete order
            await inventoryPage.safeClick('[data-test="finish"]');
        });

        await test.step('I confirm successful order completion', async () => {
            await expect(page).toHaveURL(/checkout-complete.html/, { timeout: 10000 });
            await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!', { timeout: 5000 });

            await allure.attachment("Order Status", "Order completed successfully", "text/plain");
        });
    });
});