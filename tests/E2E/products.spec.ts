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
    const testDataFilePath = './data/products.json';
    const products = JSON.parse(fs.readFileSync(testDataFilePath, 'utf-8'));

    test.beforeEach(async ({ page }) => {
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
        await testStep.log(productPage.clickViewProductButton('1'), 'Click View Product Button');
        await testStep.log(productPage.verifyProductDetailsPage(), 'Verify Product Details Page');
        await testStep.log(productPage.verifyReviewSection(), 'Verify Review Section');
    });

    test('TC09 Search Product', async ({ }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        await testStep.log(productPage.searchProduct('blue'), 'Search Product');
        await testStep.log(productPage.verifySearchResults('blue'), 'Verify Search Results');
    });

    test('TC10 Verify Subscription in home page', async ({ }) => {
        await productPage.scrollToFooter();
        await testStep.log(productPage.verifySubscriptionText(), 'Verify Subscription Text');
        await testStep.log(productPage.enterSubscriptionEmail('test@example.com'), 'Enter Subscription Email');
        await testStep.log(productPage.clickSubscribeButton(), 'Click Subscribe Button');
        await testStep.log(productPage.verifySubscriptionSuccess(validationMessages.subscriptionSuccessMessage), 'Verify Subscription Success');
    });

    test('TC11 Verify Subscription in Cart page', async ({ page }) => {
        await testStep.log(productPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(productPage.scrollToFooter(), 'Scroll to Footer');
        await testStep.log(productPage.verifySubscriptionText(), 'Verify Subscription Text');
        await testStep.log(productPage.enterSubscriptionEmail('test@example.com'), 'Enter Subscription Email');
        await testStep.log(productPage.clickSubscribeButton(), 'Click Subscribe Button');
        await testStep.log(productPage.verifySubscriptionSuccess(validationMessages.subscriptionSuccessMessage), 'Verify Subscription Success');
    });

    test('TC12 Add Products in Cart', async ({ }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');

        for (const product of products.products) {
            await productPage.searchProduct(product.name);
            await productPage.addToCart(product.name);
            await cartPage.clickContinueShoppingButton();
        }

        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        
        for (const product of products.products) {
            await testStep.log(cartPage.verifyCartContainsText(product.name, products.expectedName), `Verify Cart Contains Product: ${product.name}`);
        }
        
        await testStep.log(cartPage.verifyCartNotContainsText(products.UnexpectedName), 'Verify Cart Does Not Contain Unexpected Product');
    });

    test('TC13 Verify Product quantity in Cart', async ({ }) => {
        const increaseQuantity = Math.floor(Math.random() * 6) + 5;
        const decreaseQuantity = Math.floor(Math.random() * 4) + 1;
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        await testStep.log(productPage.clickViewProductButton('1'), 'Click View Product Button');
        await testStep.log(productPage.increaseQuantity(increaseQuantity), `Increase Quantity by ${increaseQuantity}`);
        await testStep.log(productPage.decreaseQuantity(decreaseQuantity), `Decrease Quantity by ${decreaseQuantity}`);
    });

    test('TC14 Place Order: Register while Checkout', async ({ page }) => {
      /*  const user = generateUser();
        const cardDetails = {
            nameOnCard: faker.person.fullName(),
            cardNumber: faker.finance.creditCardNumber(),
            cvc: faker.finance.creditCardCVV(),
            expiryMonth: String(faker.number.int({ min: 1, max: 12 })),
            expiryYear: String(faker.number.int({ min: 2024, max: 2030 }))
        };

        // Add products to cart
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await productPage.searchProduct(product.name);
            await productPage.addToCart(product.name);
            await cartPage.clickContinueShoppingButton();
        }

        // Navigate to cart and checkout
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.verifyCartPageDisplayed(), 'Verify Cart Page is Displayed');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.clickRegisterLoginButton(), 'Click Register/Login Button');

        // Register new account
        await testStep.log(signupPage.fillSignupDetails(user.name, user.email), 'Fill Signup Details');
        await testStep.log(signupPage.createAccount({
            title: user.title,
            password: user.password,
            dateOfBirth: user.dateOfBirth,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            address1: user.address1,
            address2: user.address2,
            country: user.country,
            state: user.state,
            city: user.city,
            zipcode: user.zipcode,
            mobileNumber: user.mobileNumber
        }), 'Create Account');

        await testStep.log(signupPage.verifyAccountCreated(), 'Verify Account Created');
        await testStep.log(signupPage.clickContinueButton(), 'Click Continue Button');
        await testStep.log(signupPage.verifyLoggedInAsUsername(user.name), 'Verify Logged in as Username');

        // Complete checkout process
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.verifyAddressDetails(), 'Verify Address Details');
        await testStep.log(cartPage.verifyOrderDetails(), 'Verify Order Details');
        await testStep.log(cartPage.enterOrderComment('Please deliver during business hours'), 'Enter Order Comment');
        await testStep.log(cartPage.clickPlaceOrderButton(), 'Click Place Order Button');

        // Enter payment details and confirm
        await testStep.log(cartPage.enterPaymentDetails(cardDetails), 'Enter Payment Details');
        await testStep.log(cartPage.clickPayAndConfirmOrderButton(), 'Click Pay and Confirm Order');
        await testStep.log(cartPage.verifyOrderPlacedSuccessfully(), 'Verify Order Placed Successfully');

        // Delete account
        await testStep.log(signupPage.clickDeleteAccountButton(), 'Click Delete Account Button');
        await testStep.log(signupPage.verifyAccountDeleted(), 'Verify Account Deleted');
        await testStep.log(signupPage.clickContinueButton(), 'Click Final Continue Button');
        */
    });
    

});
