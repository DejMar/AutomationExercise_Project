import { Page, expect } from "@playwright/test";

export class CartPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickContinueShoppingButton() {
        await this.page.click("text=Continue Shopping");
    }

    async verifyCartContainsText(productName: string, expectedText: string) {
        const cartItemText = await this.page.textContent(`text=${productName}`);
        expect(cartItemText).toContain(expectedText);
    }

    async verifyCartNotContainsText(unexpectedText: string) {
        const productRows = await this.page.$$("tbody tr");

        for (const row of productRows) {
            const productName = await row.$eval(".cart_description h4 a", (anchor) =>
                (anchor?.textContent ?? "").trim()
            );

            console.log(productName);
            expect(productName).not.toContain(unexpectedText);
        }
    }

    async verifyProductInCart(
        productIndex: number,
        expectedQuantity: number,
        expectedPrice: string
    ) {
        const productSelector = `.cart-item:nth-child(${productIndex})`;

        // Verify quantity
        const quantityText = await this.page.textContent(
            `${productSelector} .quantity`
        );
        expect(quantityText).toContain(`Quantity: ${expectedQuantity}`);

        // Verify price
        const priceText = await this.page.textContent(`${productSelector} .price`);
        expect(priceText).toContain(`Price: ${expectedPrice}`);

        // Verify total price
        const totalPriceText = await this.page.textContent(
            `${productSelector} .total-price`
        );
        const calculatedTotal = (
            parseInt(expectedPrice.replace("$", "")) * expectedQuantity
        ).toFixed(2);
        expect(totalPriceText).toContain(`Total: $${calculatedTotal}`);
    }

    async clickCartButton() {
        await this.page.click("text=Cart");
    }s

    async clickProceedToCheckoutButton() {
        await this.page.click("text=Proceed To Checkout");
    }

    async clickRegisterLoginButton() {
        await this.page.getByRole('link', { name: 'Register / Login' }).click();
    }
}