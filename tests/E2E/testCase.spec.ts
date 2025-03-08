import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { TestCasePage } from '../../pages/TestCasePage';

test.describe('Test Cases Page Tests', () => {
    let sharedSteps: SharedSteps;
    let testCasePage: TestCasePage;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        testCasePage = new TestCasePage(page);
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test.only('TC07 Verify Test Cases Page', async ({ page }) => {
        await testCasePage.clickTestCasesButton();
        await testCasePage.verifyTestCasesPageTitle();
        await testCasePage.verifyTestCasesDescription();
        await testCasePage.verifyTestCasesList();
    });
});
