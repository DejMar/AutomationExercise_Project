import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { SignUpPage } from '../../pages/SignUpPage';
import { generateUser, User } from '../../shared/UserData';

test.describe('Manipulating users', () => {
    let sharedSteps: SharedSteps;
    let signUpPage: SignUpPage;
    let newUser: User;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        signUpPage = new SignUpPage(page);
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC01 Register new user', async ({ page }) => {
        await page.goto('/')
        newUser = generateUser();
        await signUpPage.clickLoginButton();
        await signUpPage.populateAndSubmitSignUpForm(newUser);
        await signUpPage.createNewUser(newUser);
        await signUpPage.isSignUpSuccessful();
        await signUpPage.clickContinueButton();
        await signUpPage.isLogoutButtonDisplayed();
    });

    test.only('TC02 Login with new user', async ({ page }) => {
        await page.goto('/')
        await signUpPage.clickLoginButton();
        await signUpPage.loginWithCredentials('Ana_Kihn2@hotmail.com', 'gVkmR3KjKdeKIE2');
        await signUpPage.isLogoutButtonDisplayed();
    });
});