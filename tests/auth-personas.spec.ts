import { test, expect } from '../lib/fixtures';
import * as allure from "allure-js-commons";
import users from '../data/user.json';

test.describe('@authentication User Persona Validation', () => {
    test.beforeEach(async () => {
        await allure.epic("Authentication");
        await allure.feature("Login Management");
        await allure.owner("Enwer");
        await allure.tags("authentication", "user-personas", "data-driven");
    });

    users.forEach((user) => {
        test(`Login Validation: ${user.description} (${user.username}) @sanity @regression`, async ({ loginPage, page }) => {
        await allure.feature("Authentication");
        await allure.story("User Personas");

        await allure.parameter("User Type", user.description);
            await allure.parameter("Username", user.username);
            await allure.story("User Persona Authentication");

            await test.step(`Given I attempt to login as a ${user.description}`, async () => {
                await loginPage.navigateTo('/');
                await loginPage.login(user.username, 'secret_sauce');
            });

            if (user.shouldSucceed) {
                await test.step('Then I should reach the inventory page', async () => {
                    await expect(page).toHaveURL(/inventory.html/);
                });
            } else {
                await test.step('Then I should see the appropriate error message', async () => {
                    const errorMessage = page.locator('[data-test="error"]');
                    await expect(errorMessage).toHaveText(user.error!);
                });
            }
        });
    });
});