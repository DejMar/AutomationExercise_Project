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
        await testStep.log(homePage.selectCategory(Category.Kids.name, Category.Kids.subcategory.TopsAndShirts), 'Select Kids > Tops & Shirts');
        await testStep.log(homePage.verifyTitle(CategoryTitle.KidsTopsAndShirtsProducts), 'Verify Kids Tops & Shirts Products Title');
        await testStep.log(homePage.selectCategory(Category.Kids.name, Category.Kids.subcategory.Dress), 'Select Kids > Dress');
        await testStep.log(homePage.verifyTitle(CategoryTitle.KidsDressProducts), 'Verify Kids Dress Products Title');

        await testStep.log(homePage.selectCategory(Category.Men.name, Category.Men.subcategory.Tshirts), 'Select Men > Tshirts');
        await testStep.log(homePage.verifyTitle(CategoryTitle.MenTshirtsProducts), 'Verify Men Tshirts Products Title');
        await testStep.log(homePage.selectCategory(Category.Men.name, Category.Men.subcategory.Jeans), 'Select Men > Jeans');
        await testStep.log(homePage.verifyTitle(CategoryTitle.MenJeansProducts), 'Verify Men Jeans Products Title');

        await testStep.log(homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Tops), 'Select Women > Tops');
        await testStep.log(homePage.verifyTitle(CategoryTitle.WomenTopsProducts), 'Verify Women Tops Products Title');
        await testStep.log(homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Dress), 'Select Women > Dress');
        await testStep.log(homePage.verifyTitle(CategoryTitle.WomenDressProducts), 'Verify Women Dress Products Title');
        await testStep.log(homePage.selectCategory(Category.Women.name, Category.Women.subcategory.Saree), 'Select Women > Saree');
        await testStep.log(homePage.verifyTitle(CategoryTitle.WomenSareeProducts), 'Verify Women Saree Products Title');
    });

    test('TC19 View Brand Products', async ({ }) => {
        await testStep.log(homePage.clickBrand(Brand.Polo), 'Click Polo Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.Polo), 'Verify Polo Brand Title');
        await testStep.log(homePage.clickBrand(Brand.Hm), 'Click H&M Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.Hm), 'Verify H&M Brand Title');
        await testStep.log(homePage.clickBrand(Brand.Madame), 'Click Madame Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.Madame), 'Verify Madame Brand Title');
        await testStep.log(homePage.clickBrand(Brand.MastAndHarbour), 'Click Mast & Harbour Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.MastAndHarbour), 'Verify Mast & Harbour Brand Title');
        await testStep.log(homePage.clickBrand(Brand.Babyhug), 'Click Babyhug Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.Babyhug), 'Verify Babyhug Brand Title');
        await testStep.log(homePage.clickBrand(Brand.AllenSollyJunior), 'Click Allen Solly Junior Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.AllenSollyJunior), 'Verify Allen Solly Junior Brand Title');
        await testStep.log(homePage.clickBrand(Brand.KookieKids), 'Click Kookie Kids Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.KookieKids), 'Verify Kookie Kids Brand Title');
        await testStep.log(homePage.clickBrand(Brand.Biba), 'Click Biba Brand');
        await testStep.log(homePage.verifyTitle(BrandTitle.Biba), 'Verify Biba Brand Title');
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
