import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Product Page Tests', () => {
    let sharedSteps: SharedSteps;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        productPage = new ProductPage(page);
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC08 Verify All Products and product detail page', async ({ page }) => {
        await productPage.clickProductsButton();
        await productPage.verifyAllProductsTitle();
        //await productPage.verifyProductsAreDisplayed();
        await productPage.clickViewProductButton('1');
        await productPage.verifyProductDetailsPage();
        await productPage.verifyReviewSection();
    });

    test('TC09 Search Product', async ({ page }) => {
        await productPage.clickProductsButton();
        await productPage.verifyAllProductsTitle();
        await productPage.searchProduct('blue');
        await productPage.verifySearchResults('blue');
    });
});
