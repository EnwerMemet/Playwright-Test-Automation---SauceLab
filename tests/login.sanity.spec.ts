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