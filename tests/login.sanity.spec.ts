import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('User should be able to login successfully @sanity', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = process.env.SAUCE_USERNAME || '';
  const pass = process.env.SAUCE_PASSWORD || '';

  await loginPage.navigateTo('/');
  await loginPage.login(user, pass);
  await expect(page).toHaveURL(/inventory.html/);
});


test('Login page should show error for locked out user @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo('/');
  await loginPage.login('locked_out_user', 'secret_sauce');
  const errorLocator = page.locator('[data-test="error"]');
  await expect(errorLocator).toContainText('Sorry, this user has been locked out.');
});