import { expect, Page } from '@playwright/test';
import { pageTitles } from '../messages/pageTitles';

export class ProductPage {
    private page: Page;

    //#region Locators
    private productsButton = '//a[@href="/products"]';
    private titleLocator = 'h2.title.text-center';
    private viewProductButton = (productId: string) => `a[href="/product_details/${productId}"]`;

    // Product details locators 
    private productImage = '.view-product img';
    private newArrivalBadge = '.newarrival';
    private productCategory = '.product-information p:first-of-type';
    private ratingImage = 'img[src*="rating.png"]';
    private priceSpan = '.product-information span span';
    private quantityInput = '#quantity';
    private addToCartButton = 'button.cart';
    private availabilityText = '.product-information p:nth-of-type(2)';
    private conditionText = '.product-information p:nth-of-type(3)';
    private brandText = '.product-information p:nth-of-type(4)';

    // Review section locators
    private reviewTab = 'a[href="#reviews"]';
    private nameInput = '#name';
    private emailInput = '#email';
    private reviewTextarea = '#review';
    private submitReviewButton = '#button-review';
    private searchInput = '#search_product';
    private submitSearchButton = '#submit_search';
    private searchedProductTitle = '.features_items .productinfo p';
    private footerLocator = 'footer';
    private subscriptionEmailInput = 'input#susbscribe_email';
    private subscriptionTextLocator = '//*[@id="footer"]/div[1]/div/div/div[2]/div/h2';
    private subscribeButtonLocator = 'button#subscribe.btn.btn-default';
    private subscriptionSuccessLocator = 'div.alert-success.alert';
    private cartButtonLocator = 'a[href="/view_cart"] i.fa.fa-shopping-cart';
    private addToCartButtonLocator = 'a.add-to-cart';
    private inputQuantity = 'input#quantity';

    //#endregion

    constructor(page: Page) {
        this.page = page;
    }

    //#region Methods
    async clickProductsButton() {
        await this.page.click(this.productsButton);
    }

    async verifyAllProductsTitle() {
        await expect(this.page.locator(this.titleLocator)).toHaveText(pageTitles.AllProduct);
    }

    async clickViewProductButton(productId: string) {
        await this.page.click(this.viewProductButton(productId));
    }

    async verifyProductDetailsPage() {
        // Verify product main elements
        await expect(this.page.locator(this.productImage)).toBeVisible();
        await expect(this.page.locator(this.newArrivalBadge)).toBeVisible();
        await expect(this.page.locator(this.productCategory)).toBeVisible();
        await expect(this.page.locator(this.ratingImage)).toBeVisible();
        await expect(this.page.locator(this.priceSpan)).toBeVisible();
        await expect(this.page.locator(this.quantityInput)).toBeVisible();
        await expect(this.page.locator(this.addToCartButton)).toBeVisible();

        // Verify product information text
        await expect(this.page.locator(this.availabilityText)).toContainText('Availability');
        await expect(this.page.locator(this.conditionText)).toContainText('Condition');
        await expect(this.page.locator(this.brandText)).toContainText('Brand');
    }

    async verifyReviewSection() {
        await expect(this.page.locator(this.reviewTab)).toBeVisible();
        await expect(this.page.locator(this.nameInput)).toBeVisible();
        await expect(this.page.locator(this.emailInput)).toBeVisible();
        await expect(this.page.locator(this.reviewTextarea)).toBeVisible();
        await expect(this.page.locator(this.submitReviewButton)).toBeVisible();
    }

    async searchProduct(searchTerm: string) {
        await this.page.waitForSelector(this.searchInput);
        await this.page.fill(this.searchInput, searchTerm);
        await this.page.click(this.submitSearchButton);
    }
    
    async verifySearchResults(searchTerm: string) {
        try {
            // Get all product titles
            const productTitles = await this.page.locator(this.searchedProductTitle).all();
            
            // Verify each product title contains the search term
            for (const title of productTitles) {
                const titleText = await title.textContent();
                if (!titleText?.toLowerCase().includes(searchTerm.toLowerCase())) {
                    throw new Error(`Expected title to contain: ${searchTerm.toLowerCase()}, but received: ${titleText?.toLowerCase()}`);
                }
            }
        } catch (error) {
            throw new Error(`Error verifying search results: ${error.message}`);
        }
    }

    async scrollToFooter() {
        await this.page.locator(this.footerLocator).scrollIntoViewIfNeeded();
    }

    async verifySubscriptionText() {
        await expect(this.page.locator(this.subscriptionTextLocator)).toBeVisible();
    }

    async enterSubscriptionEmail(email: string) {
        await this.page.fill(this.subscriptionEmailInput, email);
    }

    async clickSubscribeButton() {
        await this.page.click(this.subscribeButtonLocator);
    }

    async verifySubscriptionSuccess(expectedMessage: string) {
        await expect(this.page.locator(this.subscriptionSuccessLocator)).toHaveText(expectedMessage);
    }

    async clickCartButton() {
        await this.page.click(this.cartButtonLocator);
    }

    async addToCart(productName: string) {
        const productSelector = `text=${productName}`;
        await this.page.hover(productSelector);
        await this.page.click(this.addToCartButtonLocator);
    }

    async increaseQuantity(amount: number) {
        const quantityInput = this.page.locator(this.inputQuantity);
        const currentValue = await quantityInput.inputValue();
        const newValue = parseInt(currentValue) + amount;
        await quantityInput.fill(newValue.toString());
        await expect(quantityInput).toHaveValue(newValue.toString());
    }

    async decreaseQuantity(amount: number) {
        const quantityInput = this.page.locator(this.inputQuantity);
        const currentValue = await quantityInput.inputValue();
        const newValue = Math.max(1, parseInt(currentValue) - amount); // Prevent going below min=1
        await quantityInput.fill(newValue.toString());
        await expect(quantityInput).toHaveValue(newValue.toString());
    }

    async getSearchResults() {
        const productTitles = await this.page.locator(this.searchedProductTitle).all();
        return productTitles.map(async (title) => ({
            name: await title.textContent(),
            price: await title.locator(this.priceSpan).textContent(),
        }));
    }
    
    async verifyWriteYourReviewIsVisible() {
        await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    }

    async enterReviewDetails(name: string, email: string, review: string) {
        await this.page.fill(this.nameInput, name);
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.reviewTextarea, review);
    }

    async clickSubmitReviewButton() {
        await this.page.click(this.submitReviewButton);
    }

    async verifyReviewSuccessMessage(expectedMessage: string) {
        const successMessageLocator = this.page.locator('#reviews div').filter({ hasText: 'Thank you for your review.' });
        await expect(successMessageLocator).toHaveText(expectedMessage);
    }
    

    //#endregion
}
