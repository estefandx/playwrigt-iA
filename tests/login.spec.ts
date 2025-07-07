import { test, expect } from '@playwright/test';
import { LoginPage } from './login.page';
import { InventoryPage, CartPage, CheckoutPage } from './shop.page';

// Primer escenario: iniciar sesión en https://www.saucedemo.com/
test('Login exitoso en SauceDemo', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  // Verifica que la URL cambió a la página de inventario
  await expect(page).toHaveURL(/.*inventory/);
});

// Escenario: login, agregar productos al carrito, validar y diligenciar formulario
test('Flujo de compra: login, agregar productos, validar carrito, diligenciar formulario y finalizar compra', async ({ page }) => {
  // Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory/);

  // Agregar productos al carrito por nombre
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addProductsToCartByName([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light'
  ]);
  await inventoryPage.goToCart();

  // Validar productos en el carrito
  const cartPage = new CartPage(page);
  await cartPage.validateProductsInCart(2);
  await cartPage.checkout();

  // Diligenciar formulario de checkout
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillForm('Estefania', 'DX', '12345');

  // Validar que se navega al siguiente paso (overview)
  await expect(page).toHaveURL(/.*checkout-step-two/);

  // Finalizar compra
  await checkoutPage.finishOrder();

  // Validar mensaje de compra exitosa
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
