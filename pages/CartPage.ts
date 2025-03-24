import { Page, expect } from "@playwright/test";
import { generateUser } from "../shared/UserData";

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

    async verifyAddressDetails(user: { name: string; company: string; address1: string; address2: string; city: string; state: string; zipcode: string; country: string; mobileNumber: string; }) {
        const addressDetails = await this.page.$eval("#address_delivery", (element) => {
            return {
                title: element.querySelector(".address_title")?.textContent?.trim(),
                name: element.querySelector(".address_firstname.address_lastname")?.textContent?.trim(),
                company: element.querySelectorAll(".address_address1.address_address2")[0]?.textContent?.trim(),
                address1: element.querySelectorAll(".address_address1.address_address2")[1]?.textContent?.trim(),
                address2: element.querySelectorAll(".address_address1.address_address2")[2]?.textContent?.trim(),
                cityStatePostcode: element.querySelector(".address_city.address_state_name.address_postcode")?.textContent?.trim(),
                country: element.querySelector(".address_country_name")?.textContent?.trim(),
                phone: element.querySelector(".address_phone")?.textContent?.trim(),
            };
        });

        expect(addressDetails.title).toBe("Your delivery address");
        expect(addressDetails.name).toContain(user.name);
        expect(addressDetails.company).toContain(user.company);
        expect(addressDetails.address1).toContain(user.address1);
        expect(addressDetails.address2).toContain(user.address2);
        const formattedCityStatePostcode = `${user.city} ${user.state} ${user.zipcode}`.replace(/\s+/g, ' ').trim();
        expect(addressDetails.cityStatePostcode?.replace(/\s+/g, ' ').trim()).toContain(formattedCityStatePostcode);
        expect(addressDetails.country).toBe(user.country);
        expect(addressDetails.phone).toBe(user.mobileNumber);
    }
        //await this.page.waitForSelector("text=Address");
    async verifyBillingAddress(user: { name: string; company: string; address1: string; address2: string; city: string; state: string; zipcode: string; country: string; mobileNumber: string; }) {
        const billingAddressDetails = await this.page.$eval("#address_invoice", (element) => {
            return {
                title: element.querySelector(".address_title")?.textContent?.trim(),
                name: element.querySelector(".address_firstname.address_lastname")?.textContent?.trim(),
                company: element.querySelectorAll(".address_address1.address_address2")[0]?.textContent?.trim(),
                address1: element.querySelectorAll(".address_address1.address_address2")[1]?.textContent?.trim(),
                address2: element.querySelectorAll(".address_address1.address_address2")[2]?.textContent?.trim(),
                cityStatePostcode: element.querySelector(".address_city.address_state_name.address_postcode")?.textContent?.trim(),
                country: element.querySelector(".address_country_name")?.textContent?.trim(),
                phone: element.querySelector(".address_phone")?.textContent?.trim(),
            };
        });

        expect(billingAddressDetails.title).toBe("Your billing address");
        expect(billingAddressDetails.name).toContain(user.name);
        expect(billingAddressDetails.company).toBe(user.company);
        expect(billingAddressDetails.address1).toBe(user.address1);
        expect(billingAddressDetails.address2).toBe(user.address2);
        const formattedCityStatePostcode = `${user.city} ${user.state} ${user.zipcode}`.replace(/\s+/g, ' ').trim();
        expect(billingAddressDetails.cityStatePostcode?.replace(/\s+/g, ' ').trim()).toContain(formattedCityStatePostcode);
        expect(billingAddressDetails.country).toBe(user.country);
        expect(billingAddressDetails.phone).toBe(user.mobileNumber);
    }

    async verifyOrderDetails(products: { products: Array<{ name: string; price: number; quantity: number }> }) {
        await this.page.waitForSelector("text=Order Details");
        const orderDetails = await this.page.$$eval("tbody tr[id^='product-']", (rows) => {
            return rows.map(row => {
                const id = row.id.split('-')[1];
                const name = row.querySelector(".cart_description h4 a")?.textContent?.trim();
                const category = row.querySelector(".cart_description p")?.textContent?.trim();
                const price = row.querySelector(".cart_price p")?.textContent?.trim();
                const quantity = row.querySelector(".cart_quantity button")?.textContent?.trim();
                const total = row.querySelector(".cart_total .cart_total_price")?.textContent?.trim();
                return { id, name, category, price, quantity, total };
            });
        });

        for (const product of products.products) {
            const orderProduct = orderDetails.find(item => item.name === product.name);
            expect(orderProduct).toBeDefined();
            expect(orderProduct?.price).toBe(`Rs. ${product.price}`);
            expect(orderProduct?.quantity).toBe(`${product.quantity}`);
            expect(orderProduct?.total).toBe(`Rs. ${product.price * product.quantity}`);
        }

        const totalAmount = await this.page.$eval("tbody tr:last-child .cart_total_price", el => el.textContent?.trim());
        const expectedTotalAmount = products.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        expect(totalAmount).toBe(`Rs. ${expectedTotalAmount}`);
    }
}