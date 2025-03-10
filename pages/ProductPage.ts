import { expect, Page } from '@playwright/test';
import { pageTitles } from '../messages/pageTitles';

export class ProductPage {
    private page: Page;

    // Locators
    private productsButton = '//a[@href="/products"]';
    private productTitle = '.product-title';
    private productPrice = '.product-price';
    //private addToCartButton = 'button[data-testid="add-to-cart"]';
    //private quantityInput = 'input[data-testid="quantity-input"]';
    private productDescription = '.product-description';
    private reviewsSection = '#reviews';
    private titleLocator = 'h2.title.text-center';

    private productCard = '.col-sm-4';
    private productInfo = '.productinfo';
    //private productImage = '.productinfo img';
    private productName = '.productinfo p';
    private productPriceInfo = '.productinfo h2';
    private productPriceHeading = 'h2:has-text("Rs.")';
    
    private viewProductButton = (productId: string) => `a[href="/product_details/${productId}"]`;

    // Modal locators
    private cartModal = '#cartModal';
    private modalTitle = '.modal-title';
    private modalBody = '.modal-body';
    private viewCartLink = '.modal-body a[href="/view_cart"]';
    private continueShoppingBtn = '.close-modal';

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
    private reviewSuccessMessage = '#review-section .alert-success';

    private searchInput = '#search_product';
    private submitSearchButton = '#submit_search';
    private searchedProductTitle = '.features_items .productinfo p';

    constructor(page: Page) {
        this.page = page;
    }

    // Methods
    async clickProductsButton() {
        await this.page.click(this.productsButton);
    }

    async verifyAllProductsTitle() {
        await expect(this.page.locator(this.titleLocator)).toHaveText(pageTitles.AllProduct);
    }

    async navigateTo(productId: string) {
        await this.page.goto(`/product/${productId}`);
    }

    async getProductTitle(): Promise<string> {
        return (await this.page.textContent(this.productTitle)) || '';
    }

    async verifyProductsAreDisplayed() {
        // Wait for at least one product card to be visible
        await this.page.waitForSelector(this.productCard);

        // Get all product cards
        const products = await this.page.locator(this.productCard).all();

        // Verify at least one product exists
        expect(products.length).toBeGreaterThan(0);

        // Verify first product has all required elements
        const firstProduct = products[0];
        
        // Add explicit waits for elements to be visible
        await this.page.waitForSelector(this.productInfo, { state: 'visible', timeout: 10000 });
        await this.page.waitForSelector(this.productImage, { state: 'visible', timeout: 10000 });
        await this.page.waitForSelector(this.productName, { state: 'visible', timeout: 10000 });
        await this.page.waitForSelector(this.productPriceInfo, { state: 'visible', timeout: 10000 });

        // Now verify they are visible
        await expect(firstProduct.locator(this.productInfo)).toBeVisible();
        await expect(firstProduct.locator(this.productImage)).toBeVisible(); 
        await expect(firstProduct.locator(this.productName)).toBeVisible();
        await expect(firstProduct.locator(this.productPriceHeading)).toBeVisible();
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

    async verifyCartModal() {
        await expect(this.page.locator(this.cartModal)).toBeVisible();
        await expect(this.page.locator(this.modalTitle)).toHaveText('Added!');
        await expect(this.page.locator(this.modalBody)).toContainText('Your product has been added to cart');
        await expect(this.page.locator(this.viewCartLink)).toBeVisible();
        await expect(this.page.locator(this.continueShoppingBtn)).toBeVisible();
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
        // Get all product titles
        const productTitles = await this.page.locator(this.searchedProductTitle).all();
        
        // Verify each product title contains the search term
        for (const title of productTitles) {
            const titleText = await title.textContent();
            await expect(titleText?.toLowerCase()).toContain(searchTerm.toLowerCase());
        }
    }

    async scrollToFooter() {
        await this.page.locator('footer').scrollIntoViewIfNeeded();
    }

    async verifySubscriptionText() {
        await expect(this.page.locator('//*[@id="footer"]/div[1]/div/div/div[2]/div/h2')).toBeVisible();
    }

    async enterSubscriptionEmail(email: string) {
        await this.page.fill('input#susbscribe_email', email);
    }

    async clickSubscribeButton() {
        await this.page.click('button#subscribe.btn.btn-default');
    }

    async verifySubscriptionSuccess(expectedMessage: string) {
        await expect(this.page.locator('div.alert-success.alert')).toHaveText(expectedMessage);
    }

    async clickCartButton() {
        await this.page.click('a[href="/view_cart"] i.fa.fa-shopping-cart');
    }

    async verifyProductInCart(productId: number) {
        await expect(this.page.locator(`//*[@id="cart_info"]/ul/li[${productId}]/a`)).toBeVisible();
    }

    async verifyProductPrice(productId: number) {
        await expect(this.page.locator(`//*[@id="cart_info"]/ul/li[${productId}]/p`)).toContainText('Rs.');
    }

    async verifyProductQuantity(productId: number, quantity: string) {
        await expect(this.page.locator(`//*[@id="cart_info"]/ul/li[${productId}]/div/div/a`)).toHaveText(quantity);
    }

    async verifyProductTotalPrice(productId: number) {
        await expect(this.page.locator(`//*[@id="cart_info"]/ul/li[${productId}]/p`)).toContainText('Rs.');
    }

    async clickContinueShoppingButton() {
        await this.page.click('a.btn.btn-default.checkout');
    }

    async clickViewCartButton() {
        await this.page.click('a[href="/view_cart"] i.fa.fa-shopping-cart');
    }

    async clickAddToCartButton(productId: number) {
        await this.page.click(`//*[@id="cart_info"]/ul/li[${productId}]/div/div/a`);
    }
    
    async hoverOverProduct(productId: number) {
        await this.page.hover(`//*[@id="cart_info"]/ul/li[${productId}]/div/div/a`);
    }
}
