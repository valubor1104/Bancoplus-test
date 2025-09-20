import { test, expect } from '@playwright/test';

const BASE = 'https://the-internet.herokuapp.com';

test.describe('Login en The Internet', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
  });

  test('Login válido (tomsmith / SuperSecretPassword!)', async ({ page }) => {
    // Completar login
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    // Redirección a /secure
    await expect(page).toHaveURL(/\/secure\/?$/);

    // Mensaje de éxito en el flash
    const flash = page.locator('#flash');
    await expect(flash).toBeVisible();
    await expect(flash).toContainText('You logged into a secure area!');
  });

  test('Login inválido (password incorrecta)', async ({ page }) => {
    // Intento con password incorrecta
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Permanece en /login
    await expect(page).toHaveURL(/\/login\/?$/);

    // Mensaje de error
    const flash = page.locator('#flash');
    await expect(flash).toBeVisible();
    await expect(flash).toContainText('Your password is invalid!');
  });

  test('Logout tras login válido', async ({ page }) => {
    // Login válido primero
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/secure\/?$/);

    // Click en Logout
    await page.click('a[href="/logout"]');

    // Redirección a /login
    await expect(page).toHaveURL(/\/login\/?$/);

    // Mensaje de salida
    const flash = page.locator('#flash');
    await expect(flash).toBeVisible();
    await expect(flash).toContainText('You logged out of the secure area!');
  });

});
