import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { HomePage } from '../../pages/HomePage';
import { TestStep } from '../../shared/TestStep';
import { Brand, BrandTitle, Category, CategoryTitle } from '../../messages/pageTitles';

test.describe('Home Page Tests', () => {
    let sharedSteps: SharedSteps;
    let testStep: TestStep;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        homePage = new HomePage(page);
        testStep = new TestStep();
        await testStep.log(page.goto('http://automationexercise.com'), 'Navigate to Homepage');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC18 View Category Products', async ({ }) => {   
        await homePage.selectCategory(Category.Kids.name, Category.Kids.subcategory.TopsAndShirts);
        await homePage.verifyTitle(CategoryTitle.KidsTopsAndShirtsProducts);
        await homePage.selectCategory(Category.Kids.name, Category.Kids.subcategory.Dress);
        await homePage.verifyTitle(CategoryTitle.KidsDressProducts);

        await homePage.selectCategory(Category.Men.name, Category.Men.subcategory.Tshirts);
        await homePage.verifyTitle(CategoryTitle.MenTshirtsProducts);
        await homePage.selectCategory(Category.Men.name, Category.Men.subcategory.Jeans);
        await homePage.verifyTitle(CategoryTitle.MenJeansProducts);

        await homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Tops);
        await homePage.verifyTitle(CategoryTitle.WomenTopsProducts);
        await homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Dress);
        await homePage.verifyTitle(CategoryTitle.WomenDressProducts);
        await homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Saree);
        await homePage.verifyTitle(CategoryTitle.WomenSareeProducts);
    });

    test('TC19 View Brand Products', async ({ }) => {
        await homePage.clickBrand(Brand.Polo);
        await homePage.verifyTitle(BrandTitle.Polo);
        await homePage.clickBrand(Brand.Hm);
        await homePage.verifyTitle(BrandTitle.Hm);
        await homePage.clickBrand(Brand.Madame);
        await homePage.verifyTitle(BrandTitle.Madame);
        await homePage.clickBrand(Brand.MastAndHarbour);
        await homePage.verifyTitle(BrandTitle.MastAndHarbour);
        await homePage.clickBrand(Brand.Babyhug);
        await homePage.verifyTitle(BrandTitle.Babyhug);
        await homePage.clickBrand(Brand.AllenSollyJunior);
        await homePage.verifyTitle(BrandTitle.AllenSollyJunior);
        await homePage.clickBrand(Brand.KookieKids);
        await homePage.verifyTitle(BrandTitle.KookieKids);
        await homePage.clickBrand(Brand.Biba);
        await homePage.verifyTitle(BrandTitle.Biba);
    });

    test.skip('TC25 Verify Scroll Up using "Arrow" button and Scroll Down functionality', async ({ page }) => {
        // Verify that home page is visible successfully
        await testStep.log(homePage.verifyHomePageIsVisible(), 'Verify Home Page is Visible');

        // Scroll down page to bottom
        await testStep.log(page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)), 'Scroll Down to Bottom');
        
        // Verify 'SUBSCRIPTION' is visible
        await testStep.log(homePage.verifySubscriptionIsVisible(), 'Verify SUBSCRIPTION is Visible');

        // Click on arrow at bottom right side to move upward
        await testStep.log(homePage.clickScrollUpArrow(), 'Click Scroll Up Arrow');

        // Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
        await testStep.log(homePage.verifyScrollUpIsSuccessful(), 'Verify Scroll Up is Successful');
    });
    
    test.skip('TC26 Verify Scroll Up without "Arrow" button and Scroll Down functionality', async ({ page }) => {
        // Verify that home page is visible successfully
        await testStep.log(homePage.verifyHomePageIsVisible(), 'Verify Home Page is Visible');

        // Scroll down page to bottom
        await testStep.log(page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)), 'Scroll Down to Bottom');

        // Verify 'SUBSCRIPTION' is visible
        await testStep.log(homePage.verifySubscriptionIsVisible(), 'Verify SUBSCRIPTION is Visible');

        // Scroll up page to top
        await testStep.log(page.evaluate(() => window.scrollTo(0, 0)), 'Scroll Up to Top');

        // Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
        await testStep.log(homePage.verifyScrollUpIsSuccessful(), 'Verify Scroll Up is Successful');
    });
});
