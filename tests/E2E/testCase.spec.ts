import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { TestCasePage } from '../../pages/TestCasePage';
import { TestStep } from '../../shared/TestStep';
import { testCasePageTitles } from '../../messages/pageTitles';
import testCasesData from '../../data/testCases.json';
import apiTestCasesData from '../../data/testCases-API.json';

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

    test('TC07.1 Verify Test Cases Page', async ({ }) => {
        await testStep.log(testCasePage.clickTestCasesButton(), 'Click Test Cases Button');
        await testStep.log(testCasePage.verifyTestCasesPageTitle(testCasePageTitles.TestCase), 'Verify Test Cases Page Title');
        await testStep.log(testCasePage.verifyTestCasesDescription(testCasePageTitles.TestCasesDescription), 'Verify Test Cases Description');
        await testStep.log(testCasePage.verifyTestCasesList(testCasesData, 'TC07.1'), 'Verify Test Cases List');
    });

    test('TC07.2 Verify API Test Cases Page', async ({ }) => {
        await testStep.log(testCasePage.clickApiTestCasesButton(), 'Click API Test Cases Button');
        await testStep.log(testCasePage.verifyTestCasesPageTitle(testCasePageTitles.ApiTestCases), 'Verify Test Cases Page Title');
        await testStep.log(testCasePage.verifyTestCasesDescription(testCasePageTitles.ApiTestCasesDescription), 'Verify Test Cases Description');
        await testStep.log(testCasePage.verifyTestCasesList(apiTestCasesData, 'TC07.2'), 'Verify Test Cases List');
    });
});
