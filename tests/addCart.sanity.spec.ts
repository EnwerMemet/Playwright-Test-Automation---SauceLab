import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';
import { OverviewPage } from '../pages/OverviewPage';
import { faker } from '@faker-js/faker/locale/en';

test('User should be able to add item to cart and checkout successfully @sanity @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    // --- STEP 1: LOGIN ---
    await loginPage.navigateTo('/');
    await loginPage.login(process.env.SAUCE_USERNAME || '', process.env.SAUCE_PASSWORD || '');
    console.log('✅ Login successful');

    // --- STEP 2: SELECT PRODUCT ---
    const firstName = await inventoryPage.getFirstItemName();
    const firstPrice = await inventoryPage.getFirstItemPrice();
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.goToCart();
    console.log(`✅ Selected: ${firstName} (${firstPrice})`);

    // --- STEP 3: CART VALIDATION ---
    await expect(page).toHaveURL(/cart.html/);
    expect(await page.locator('.inventory_item_name').textContent()).toBe(firstName);
    expect(await page.locator('.inventory_item_price').textContent()).toBe(firstPrice);
    await cartPage.clickCheckout();
    console.log('✅ Cart validated and checkout clicked');

    // --- STEP 4: CUSTOMER INFO ---
    const fName = faker.person.firstName();
    const lName = faker.person.lastName();
    const zip = faker.location.zipCode();
    await checkoutPage.fillInformation(fName, lName, zip);
    console.log(`✅ Form filled for: ${fName} ${lName}`);

    // --- STEP 5: FINAL OVERVIEW ---
    await expect(page).toHaveURL(/checkout-step-two.html/);
    expect(await overviewPage.itemName.textContent()).toBe(firstName);
    expect(await overviewPage.itemPrice.textContent()).toBe(firstPrice);
    await overviewPage.clickFinish();
    console.log('✅ Overview validated and order finished');

    // --- STEP 6: CONFIRMATION ---
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    console.log('✅ Order confirmed: Thank you for your order!');
});