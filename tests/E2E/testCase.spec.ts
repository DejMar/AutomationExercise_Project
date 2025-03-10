import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { TestCasePage } from '../../pages/TestCasePage';
import { TestStep } from '../../shared/TestStep';

test.describe('Test Cases Page Tests', () => {
    let sharedSteps: SharedSteps;
    let testCasePage: TestCasePage;
    let testStep: TestStep;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        testCasePage = new TestCasePage(page);
        testStep = new TestStep();
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC07 Verify Test Cases Page', async ({ page }) => {
        await testStep.log(testCasePage.clickTestCasesButton(), 'Click Test Cases Button');
        await testStep.log(testCasePage.verifyTestCasesPageTitle(), 'Verify Test Cases Page Title');
        await testStep.log(testCasePage.verifyTestCasesDescription(), 'Verify Test Cases Description');
        await testStep.log(testCasePage.verifyTestCasesList(), 'Verify Test Cases List');
    });
});
