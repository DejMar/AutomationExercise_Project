import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { generateUser } from '../../shared/UserData';
import { ContactUsPage } from '../../pages/ContactUsPage';

test.describe('Contact Us Form Tests', () => {
    let sharedSteps: SharedSteps;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC06 Submit Contact Us form successfully', async ({ page }) => {
        const contactUsPage = new ContactUsPage(page);
        const user = generateUser();
        await contactUsPage.clickContactUsButton();
        await contactUsPage.verifyGetInTouchIsVisible();
        await contactUsPage.fillContactForm(user, 'Test Subject', 'This is a test message');
        await contactUsPage.uploadFile('data/test-file.txt');
        await contactUsPage.submitForm();

        //await contactUsPage.handleAlert();
        await contactUsPage.verifySuccessMessage();
    });
});
