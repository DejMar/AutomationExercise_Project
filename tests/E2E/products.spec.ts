import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { ProductPage } from '../../pages/ProductPage';
import { validationMessages } from '../../messages/validationMessages';
import { TestStep } from '../../shared/TestStep';

test.describe('Product Page Tests', () => {
    let sharedSteps: SharedSteps;
    let productPage: ProductPage;
    let testStep: TestStep;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        productPage = new ProductPage(page);
        testStep = new TestStep();
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC08 Verify All Products and product detail page', async ({ page }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        //await productPage.verifyProductsAreDisplayed();
        await testStep.log(productPage.clickViewProductButton('1'), 'Click View Product Button');
        await testStep.log(productPage.verifyProductDetailsPage(), 'Verify Product Details Page');
        await testStep.log(productPage.verifyReviewSection(), 'Verify Review Section');
    });

    test('TC09 Search Product', async ({ page }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        await testStep.log(productPage.searchProduct('blue'), 'Search Product');
        await testStep.log(productPage.verifySearchResults('blue'), 'Verify Search Results');
    });

    test('TC10 Verify Subscription in home page', async ({ page }) => {
        //await sharedSteps.verifyHomePageIsVisible();
        await productPage.scrollToFooter();
        await testStep.log(productPage.verifySubscriptionText(), 'Verify Subscription Text');
        await testStep.log(productPage.enterSubscriptionEmail('test@example.com'), 'Enter Subscription Email');
        await testStep.log(productPage.clickSubscribeButton(), 'Click Subscribe Button');
        await testStep.log(productPage.verifySubscriptionSuccess(validationMessages.subscriptionSuccessMessage), 'Verify Subscription Success');
    });

    test('TC11 Verify Subscription in Cart page', async ({ page }) => {
        //await sharedSteps.verifyHomePageIsVisible();
        await testStep.log(productPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(productPage.scrollToFooter(), 'Scroll to Footer');
        await testStep.log(productPage.verifySubscriptionText(), 'Verify Subscription Text');
        await testStep.log(productPage.enterSubscriptionEmail('test@example.com'), 'Enter Subscription Email');
        await testStep.log(productPage.clickSubscribeButton(), 'Click Subscribe Button');
        await testStep.log(productPage.verifySubscriptionSuccess(validationMessages.subscriptionSuccessMessage), 'Verify Subscription Success');
    });

    test('TC12 Add Products in Cart', async ({ page }) => {
        //await sharedSteps.verifyHomePageIsVisible();
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        
        // Add first product to cart
        await testStep.log(productPage.hoverOverProduct(1), 'Hover Over Product');
        await testStep.log(productPage.clickAddToCartButton(1), 'Click Add to Cart Button');
        await testStep.log(productPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        
        // Add second product to cart
        await testStep.log(productPage.hoverOverProduct(2), 'Hover Over Product');
        await testStep.log(productPage.clickAddToCartButton(2), 'Click Add to Cart Button');
        await testStep.log(productPage.clickViewCartButton(), 'Click View Cart Button');
        
        // Verify cart contents
        await testStep.log(productPage.verifyProductInCart(1), 'Verify Product In Cart');
        await testStep.log(productPage.verifyProductInCart(2), 'Verify Product In Cart');
        await testStep.log(productPage.verifyProductPrice(1), 'Verify Product Price');
        await testStep.log(productPage.verifyProductPrice(2), 'Verify Product Price');
        await testStep.log(productPage.verifyProductQuantity(1, '1'), 'Verify Product Quantity');
        await testStep.log(productPage.verifyProductQuantity(2, '1'), 'Verify Product Quantity');
        await testStep.log(productPage.verifyProductTotalPrice(1), 'Verify Product Total Price');
        await testStep.log(productPage.verifyProductTotalPrice(2), 'Verify Product Total Price');
    });
});
