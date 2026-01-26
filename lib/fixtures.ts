import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { BasePage } from '../pages/BasePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OverviewPage } from '../pages/OverviewPage';
import { CartPage } from '../pages/CartPage';

type MyFixtures = {
    basePage: BasePage;
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    overviewPage: OverviewPage;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    overviewPage: async ({ page }, use) => {
        await use(new OverviewPage(page));
    },
});

export { expect } from '@playwright/test';