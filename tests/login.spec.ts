import { test, expect } from '@playwright/test';
import { LoginPage } from './login.page';

// Primer escenario: iniciar sesión en https://www.saucedemo.com/
test('Login exitoso en SauceDemo', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  // Verifica que la URL cambió a la página de inventario
  await expect(page).toHaveURL(/.*inventory/);
});
