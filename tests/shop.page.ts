import { Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartIcon = '.shopping_cart_link';

  constructor(page: Page) {
    this.page = page;
  }

  async addProductsToCartByName(productNames: string[]) {
    for (const name of productNames) {
      // Convierte el nombre a minúsculas y reemplaza espacios por guiones para coincidir con el id
      const id = `#add-to-cart-${name.toLowerCase().replace(/ /g, '-')}`;
      await this.page.click(id);
    }
  }

  async goToCart() {
    await this.page.click(this.cartIcon);
  }
}

export class CartPage {
  readonly page: Page;
  readonly cartItems = '.cart_item';
  readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    this.page = page;
  }

  async validateProductsInCart(expectedCount: number) {
    const items = await this.page.$$(this.cartItems);
    if (items.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} items, found ${items.length}`);
    }
  }

  async checkout() {
    await this.page.click(this.checkoutButton);
  }
}

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput = '[data-test="firstName"]';
  readonly lastNameInput = '[data-test="lastName"]';
  readonly postalCodeInput = '[data-test="postalCode"]';
  readonly continueButton = '[data-test="continue"]';
  readonly finishButton = '[data-test="finish"]';

  constructor(page: Page) {
    this.page = page;
  }

  async fillForm(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
    await this.page.click(this.continueButton);
  }

  async finishOrder() {
    await this.page.click(this.finishButton);
  }

  // NUEVO: método para obtener el texto del mensaje final
  async getSuccessMessage() {
    return this.page.textContent('.complete-header');
  }
}
