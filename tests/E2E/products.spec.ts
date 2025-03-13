import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { ProductPage } from '../../pages/ProductPage';
import { validationMessages } from '../../messages/validationMessages';
import { TestStep } from '../../shared/TestStep';
import * as fs from 'fs';
import { CartPage } from '../../pages/CartPage';

test.describe('Product Page Tests', () => {
    let sharedSteps: SharedSteps;
    let productPage: ProductPage;
    let testStep: TestStep;
    let cartPage: CartPage;
    const testDataFilePath = "./data/products.json";
    test.beforeEach(async ({ page }) => {
        //await page.setViewportSize({ width: 1920, height: 1080 });
        sharedSteps = new SharedSteps(page);
        productPage = new ProductPage(page);
        testStep = new TestStep();
        cartPage = new CartPage(page);
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

    test.only('TC09 Search Product', async ({ }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        await testStep.log(productPage.searchProduct('blue'), 'Search Product');
        await testStep.log(productPage.verifySearchResults('blue'), 'Verify Search Results');
    });

    test('TC10 Verify Subscription in home page', async ({ }) => {
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

    test.only('TC12 Add Products in Cart', async ({ page }) => {
        //await sharedSteps.verifyHomePageIsVisible();
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        
        // Add first product to cart
        await testStep.log(productPage.searchProduct('Blue'), 'Search Product');
        const products = JSON.parse(fs.readFileSync(testDataFilePath, "utf-8"));

        for (const product of products.products) {
            await productPage.searchProduct(product.name);
            await productPage.addToCart(product.name);
            await cartPage.clickContinueShoppingButton();
          }

          await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        
          for (const product of products.products) {
            await testStep.log(cartPage.verifyCartContainsText(product.name, products.expectedName), `Verify Cart Contains Product: ${product.name}`);
          }
          // Assert whether no added product in the Cart contains the text ‘Yellow’
          await testStep.log(cartPage.verifyCartNotContainsText(products.UnexpectedName), 'Verify Cart Does Not Contain Unexpected Product');
    });

    test('TC13 Verify Product quantity in Cart', async ({ page }) => {
        await testStep.log(sharedSteps.verifyHomePageIsVisible(), 'Verify Home Page is Visible');
        
        // View first product details
        //await testStep.log(productPage.clickViewProductButton('1'), 'Click View Product Button');
        //await testStep.log(productPage.verifyProductDetailsPage(), 'Verify Product Detail Page');
        
        // Set quantity and add to cart
        await testStep.log(productPage.setQuantity('4'), 'Set Quantity to 4');
        await testStep.log(productPage.clickAddToCartButton(1), 'Click Add to Cart Button');
        await testStep.log(productPage.clickViewCartButton(), 'Click View Cart Button');
        
        // Verify cart quantity
        await testStep.log(productPage.verifyProductInCart(1), 'Verify Product In Cart');
        await testStep.log(productPage.verifyProductQuantity(1, '4'), 'Verify Product Quantity is 4');
    });
});
