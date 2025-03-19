import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { HomePage } from '../../pages/HomePage';
import { TestStep } from '../../shared/TestStep';

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
