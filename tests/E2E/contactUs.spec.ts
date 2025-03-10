import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { generateUser } from '../../shared/UserData';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { TestStep } from '../../shared/TestStep';

test.describe('Contact Us Form Tests', () => {
    let sharedSteps: SharedSteps;
    let testStep: TestStep;
    let contactUsPage: ContactUsPage;
    
    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        contactUsPage = new ContactUsPage(page);
        testStep = new TestStep();
        await page.goto('/');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC06 Submit Contact Us form successfully', async ({ page }) => {
        const user = generateUser();
        await testStep.log(contactUsPage.clickContactUsButton(), 'Click Contact Us Button');
        await testStep.log(contactUsPage.verifyGetInTouchIsVisible(), 'Verify Get In Touch is Visible');
        await testStep.log(contactUsPage.fillContactForm(user, 'Test Subject', 'This is a test message'), 'Fill Contact Form');
        await testStep.log(contactUsPage.uploadFile('data/test-file.txt'), 'Upload File');
        await testStep.log(contactUsPage.submitForm(), 'Submit Form');

        //await contactUsPage.handleAlert();
        //await testStep.log(contactUsPage.verifySuccessMessage(), 'Verify Success Message');
    });
});
