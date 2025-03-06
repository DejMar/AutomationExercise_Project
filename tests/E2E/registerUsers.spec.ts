import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { SignUpPage } from '../../pages/SignUpPage';
import { generateUser, User } from '../../shared/UserData';
import { validationMessages } from '../../messages/validationMessages';
import { userData } from '../../data/userData';

test.describe('Users manipulation positive cases', () => {
    let sharedSteps: SharedSteps;
    let signUpPage: SignUpPage;
    let newUser: User;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        signUpPage = new SignUpPage(page);
        await page.goto('/')
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC01 Register new user', async ({ }) => {
        newUser = generateUser();
        await signUpPage.clickLoginButton();
        await signUpPage.populateAndSubmitSignUpForm(newUser);
        await signUpPage.createNewUser(newUser);
        await signUpPage.isSignUpSuccessful();
        await signUpPage.clickContinueButton();
        await signUpPage.isLogoutButtonDisplayed();
    });

    test('TC02 Login with new user', async ({ }) => {
        await signUpPage.clickLoginButton();
        await signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword);
        await signUpPage.isLogoutButtonDisplayed();
    });

    test('TC04 Logout User', async ({ }) => {
        await signUpPage.clickLoginButton();
        await signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword);
        await signUpPage.isLogoutButtonDisplayed();
        await signUpPage.clickLogoutButton();
        //TODO add verification that user is logged out
    });
});

test.describe('Users manipulation negative cases', () => {
    let sharedSteps: SharedSteps;
    let signUpPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        signUpPage = new SignUpPage(page);
        await page.goto('/')
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
    });

    test('TC03 Login with invalid user', async ({ }) => {
        await signUpPage.clickLoginButton();
        await signUpPage.loginWithCredentials(userData.validUsername, userData.invalidPassword);
        await signUpPage.verifyErrorMessage(validationMessages.invalidLoginMessage);
    });

    test('TC05 Register User with existing email', async ({ }) => {
        
    });
});
