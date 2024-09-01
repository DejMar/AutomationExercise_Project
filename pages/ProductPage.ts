import { Page } from '@playwright/test';

export class ProductPage {
    private page: Page;

    // Locators
    private productTitle = '.product-title';
    private productPrice = '.product-price';
    private addToCartButton = 'button[data-testid="add-to-cart"]';
    private quantityInput = 'input[data-testid="quantity-input"]';
    private productDescription = '.product-description';
    private reviewsSection = '#reviews';

    constructor(page: Page) {
        this.page = page;
    }

    // Methods
    async navigateTo(productId: string) {
        await this.page.goto(`/product/${productId}`);
    }

    async getProductTitle(): Promise<string> {
        return (await this.page.textContent(this.productTitle)) || '';
    }
}
