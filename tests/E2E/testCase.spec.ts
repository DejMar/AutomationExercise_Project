import { expect, test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';

test.describe('Test Cases Page Tests', () => {
    let sharedSteps: SharedSteps;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC07 Verify Test Cases Page', async ({ page }) => {
        // Verify home page is visible
        //await expect(page.locator('.home-page')).toBeVisible();

        // Click on Test Cases button
        await page.click('a[href="/test_cases"]');

        // Verify user is navigated to test cases page
        await expect(page.locator('h2.title.text-center')).toHaveText('Test Cases');
        await expect(page.locator('.panel-group h5')).toContainText('Below is the list of test Cases for you to practice the Automation');
    });
});
