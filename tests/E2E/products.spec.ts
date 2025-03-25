import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { ProductPage } from '../../pages/ProductPage';
import { SignUpPage } from '../../pages/SignUpPage';
import { validationMessages } from '../../messages/validationMessages';
import { TestStep } from '../../shared/TestStep';
import { CartPage } from '../../pages/CartPage';
import * as fs from 'fs';
import { generateUser } from '../../shared/UserData';
import { userData } from '../../data/userData';

test.describe('Product Page Tests', () => {
    let sharedSteps: SharedSteps;
    let productPage: ProductPage;
    let testStep: TestStep;
    let cartPage: CartPage;
    let signUpPage: SignUpPage;
    const testDataFilePath = './data/products.json';
    const products = JSON.parse(fs.readFileSync(testDataFilePath, 'utf-8'));

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        productPage = new ProductPage(page);
        testStep = new TestStep();
        cartPage = new CartPage(page);
        signUpPage = new SignUpPage(page);
        await testStep.log(page.goto('/'), 'Navigate to Homepage');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC08 Verify All Products and product detail page', async ({ }) => {
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

    test('TC11 Verify Subscription in Cart page', async ({ }) => {
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
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
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
        const user = generateUser();

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }

        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.clickRegisterLoginButton(), 'Click Register/Login Button');
        await testStep.log(signUpPage.signInWithCredentials(user.name, user.email), `Sign In With Credentials: ${user.name} and ${user.email}`);
        await testStep.log(signUpPage.fillSignUpFormAndCreateAccount(user), 'Create New User');
        await testStep.log(signUpPage.isSignUpSuccessful(), 'Verify Sign Up Successful');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Continue Button');
        //await testStep.log(signUpPage.verifyLoggedInAsUsername(user.name), `Verify Logged in as ${user.name}`);
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.verifyAddressDetails(user), 'Verify Address Details');
        await testStep.log(cartPage.verifyBillingAddress(user), 'Verify Billing Address');
        //await testStep.log(cartPage.verifyOrderDetails(products.products), 'Verify Order Details');
        await testStep.log(cartPage.enterOrderComment('Please deliver during business hours'), 'Enter Order Comment');
        await testStep.log(cartPage.clickPlaceOrderButton(), 'Click Place Order Button');
        await testStep.log(cartPage.enterPaymentDetails(), 'Enter Payment Details');
        await testStep.log(cartPage.clickPayAndConfirmOrderButton(), 'Click Pay and Confirm Order');
        await testStep.log(cartPage.verifyOrderPlacedSuccessfully(validationMessages.orderPlacedMessage), 'Verify Order Placed Successfully');
        await testStep.log(signUpPage.clickDeleteAccountButton(), 'Click Delete Account Button');
        await testStep.log(signUpPage.verifyAccountDeletedText(), 'Verify Account Deleted');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Final Continue Button');
    });

    test('TC15 Place Order: Register before Checkout', async ({ }) => {
        const user = generateUser();

        await testStep.log(signUpPage.clickLoginButton(), 'Click Signup / Login button');

        await testStep.log(signUpPage.signInWithCredentials(user.name, user.email), 'Sign In With Credentials');
        await testStep.log(signUpPage.fillSignUpFormAndCreateAccount(user), 'Create New User');
        await testStep.log(signUpPage.isSignUpSuccessful(), 'Verify Sign Up Successful');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Continue Button');

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }

        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.verifyAddressDetails(user), 'Verify Address Details');
        await testStep.log(cartPage.verifyBillingAddress(user), 'Verify Billing Address');
        //await testStep.log(cartPage.verifyOrderDetails(products), 'Review Your Order');
        await testStep.log(cartPage.enterOrderComment('Please deliver during business hours'), 'Enter Order Comment');
        await testStep.log(cartPage.clickPlaceOrderButton(), 'Click Place Order Button');
        await testStep.log(cartPage.enterPaymentDetails(), 'Enter Payment Details');
        await testStep.log(cartPage.clickPayAndConfirmOrderButton(), 'Click Pay and Confirm Order');
        await testStep.log(cartPage.verifyOrderPlacedSuccessfully(validationMessages.orderPlacedMessage), 'Verify Order Placed Successfully');
        await testStep.log(signUpPage.clickDeleteAccountButton(), 'Click Delete Account Button');
        await testStep.log(signUpPage.verifyAccountDeletedText(), 'Verify Account Deleted');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Final Continue Button');
    });

    test('TC16 Place Order: Login before Checkout', async ({ }) => {
        await testStep.log(signUpPage.clickLoginButton(), 'Click Signup / Login button');
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword), 'Sign In With Credentials');
        //await testStep.log(signUpPage.verifyLoggedInAsUsername(user.name), 'Verify Logged in as Username');

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        //await testStep.log(cartPage.verifyCartPageIsDisplayed(), 'Verify Cart Page is Displayed');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');

        //await testStep.log(cartPage.verifyOrderDetails(products), 'Review Your Order');
        await testStep.log(cartPage.enterOrderComment('Please deliver during business hours'), 'Enter Order Comment');
        await testStep.log(cartPage.clickPlaceOrderButton(), 'Click Place Order Button');
        await testStep.log(cartPage.enterPaymentDetails(), 'Enter Payment Details');
        await testStep.log(cartPage.clickPayAndConfirmOrderButton(), 'Click Pay and Confirm Order');
        await testStep.log(cartPage.verifyOrderPlacedSuccessfully(validationMessages.orderPlacedMessage), 'Verify Order Placed Successfully');
        await testStep.log(signUpPage.clickLogoutButton(), 'Click Logout Button');
    });

    test('TC17 Remove Products From Cart', async ({ }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');

        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.removeProductFromCart(products.products[1].name), `Remove Product from Cart: ${products.products[1].name}`);
        await testStep.log(cartPage.verifyProductRemovedFromCart(products.products[1].name), `Verify Product Removed from Cart: ${products.products[1].name}`);
    });

    //TODO Test is failing, need to fix
    test('TC20 Search Products and Verify Cart After Login', async ({ page }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        
        const searchProductName = 'blue';
        await testStep.log(productPage.searchProduct(searchProductName), `Search Product: ${searchProductName}`);
        await testStep.log(productPage.verifySearchResults(searchProductName), 'Verify Searched Products are visible');
        
        const searchResults = await Promise.all(await productPage.getSearchResults());
        for (const product of searchResults) {
            if (product.name) {
                await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            }
        }
        
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        for (const product of searchResults) {
            if (product.name) {
                await testStep.log(cartPage.verifyCartContainsText(product.name, product.name), `Verify Product in Cart: ${product.name}`);
            }
        }
        
        await testStep.log(signUpPage.clickLoginButton(), 'Click Signup / Login button');
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword), 'Sign In With Credentials');
        
        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        for (const product of searchResults) {
            if (product.name) {
                await testStep.log(cartPage.verifyCartContainsText(product.name, product.name), `Verify Product in Cart after Login: ${product.name}`);
            }
        }
    });

    test('TC21 Add review on product', async ({ page }) => {
        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        await testStep.log(productPage.verifyAllProductsTitle(), 'Verify All Products Title');
        
        await testStep.log(productPage.clickViewProductButton('1'), 'Click View Product Button');
        await page.pause();
        await testStep.log(productPage.verifyWriteYourReviewIsVisible(), 'Verify Write Your Review is visible');
        await page.pause();
        
        const reviewName = 'John Doe';
        const reviewEmail = 'john.doe@example.com';
        const reviewText = 'This is a great product!';
        
        await testStep.log(productPage.enterReviewDetails(reviewName, reviewEmail, reviewText), 'Enter review details');
        await testStep.log(productPage.clickSubmitReviewButton(), 'Click Submit Button');
        //TODO: Fix this test, it is failing because of the success message disapear fast
        //await testStep.log(productPage.verifyReviewSuccessMessage('Thank you for your review.'), 'Verify success message');
    });

    test('TC22 Add to cart from Recommended items', async ({ }) => {
 
        
    });

    test('TC23 Verify address details in checkout page', async ({ }) => {
        const user = generateUser();

        await testStep.log(signUpPage.clickLoginButton(), 'Click Signup / Login button');

        await testStep.log(signUpPage.signInWithCredentials(user.name, user.email), 'Sign In With Credentials');
        await testStep.log(signUpPage.fillSignUpFormAndCreateAccount(user), 'Create New User');
        await testStep.log(signUpPage.isSignUpSuccessful(), 'Verify Sign Up Successful');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Continue Button');

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }

        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.verifyAddressDetails(user), 'Verify Address Details');
        await testStep.log(cartPage.verifyBillingAddress(user), 'Verify Billing Address');
        
        await testStep.log(signUpPage.clickDeleteAccountButton(), 'Click Delete Account Button');
        await testStep.log(signUpPage.verifyAccountDeletedText(), 'Verify Account Deleted');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Final Continue Button');
    });

    test('TC24 Download Invoice after purchase order', async ({ }) => {
        const user = generateUser();

        await testStep.log(signUpPage.clickLoginButton(), 'Click Signup / Login button');

        await testStep.log(signUpPage.signInWithCredentials(user.name, user.email), 'Sign In With Credentials');
        await testStep.log(signUpPage.fillSignUpFormAndCreateAccount(user), 'Create New User');
        await testStep.log(signUpPage.isSignUpSuccessful(), 'Verify Sign Up Successful');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Continue Button');

        await testStep.log(productPage.clickProductsButton(), 'Click Products Button');
        for (const product of products.products) {
            await testStep.log(productPage.searchProduct(product.name), `Search Product: ${product.name}`);
            await testStep.log(productPage.addToCart(product.name), `Add Product to Cart: ${product.name}`);
            await testStep.log(cartPage.clickContinueShoppingButton(), 'Click Continue Shopping Button');
        }

        await testStep.log(cartPage.clickCartButton(), 'Click Cart Button');
        await testStep.log(cartPage.clickProceedToCheckoutButton(), 'Click Proceed To Checkout');
        await testStep.log(cartPage.verifyAddressDetails(user), 'Verify Address Details');
        await testStep.log(cartPage.verifyBillingAddress(user), 'Verify Billing Address');
        //await testStep.log(cartPage.verifyOrderDetails(products), 'Review Your Order');
        await testStep.log(cartPage.enterOrderComment('Please deliver during business hours'), 'Enter Order Comment');
        await testStep.log(cartPage.clickPlaceOrderButton(), 'Click Place Order Button');
        await testStep.log(cartPage.enterPaymentDetails(), 'Enter Payment Details');
        await testStep.log(cartPage.clickPayAndConfirmOrderButton(), 'Click Pay and Confirm Order');
        await testStep.log(cartPage.verifyOrderPlacedSuccessfully(validationMessages.orderPlacedMessage), 'Verify Order Placed Successfully');
        //Continue with download invoice test
    });
});
