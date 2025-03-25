import { test } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { SignUpPage } from '../../pages/SignUpPage';
import { generateUser, User } from '../../shared/UserData';
import { validationMessages } from '../../messages/validationMessages';
import { userData } from '../../data/userData';
import { TestStep } from '../../shared/TestStep';

test.describe('Users manipulation positive cases', () => {
    let sharedSteps: SharedSteps;
    let signUpPage: SignUpPage;
    let newUser: User;
    let testStep: TestStep;

    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        signUpPage = new SignUpPage(page);
        testStep = new TestStep();
        await testStep.log(page.goto('/'), 'Navigate to Homepage');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC01 Register new user', async ({ }) => {
        newUser = generateUser();
        await testStep.log(signUpPage.clickLoginButton(), 'Click Login Button');
        await testStep.log(signUpPage.signInWithCredentials(newUser.name, newUser.email), 'Sign In With Credentials');
        await testStep.log(signUpPage.fillSignUpFormAndCreateAccount(newUser), 
            `------------Create New User with------------ \n` +
            `NAME: ${newUser.name}, \n` +
            `EMAIL: ${newUser.email},  \n` +
            `PASSWORD: ${newUser.password},  \n` +
            `ADDRESS: ${newUser.address1},  \n` +
            `CITY: ${newUser.city},  \n` +
            `STATE: ${newUser.state},  \n` +
            `ZIP: ${newUser.zipcode},  \n` +
            `PHONE: ${newUser.mobileNumber} `);
        await testStep.log(signUpPage.isSignUpSuccessful(), 'Verify Sign Up Successful');
        await testStep.log(signUpPage.clickContinueButton(), 'Click Continue Button');
        await testStep.log(signUpPage.isLogoutButtonDisplayed(), 'Verify Logout Button Displayed');
    });

    test('TC02 Login with new user', async ({ }) => {
        await testStep.log(signUpPage.clickLoginButton(), 'Click Login Button');
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword), 'Login With Credentials');
        await testStep.log(signUpPage.verifyLoggedInAsUsername(userData.validName), `Verify Logged in as ${userData.validName}`);
        await testStep.log(signUpPage.isLogoutButtonDisplayed(), 'Verify Logout Button Displayed');
    });

    test('TC04 Logout User', async ({ }) => {
        await signUpPage.clickLoginButton();
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword), 'Login With Credentials');
        await testStep.log(signUpPage.verifyLoggedInAsUsername(userData.validName), `Verify Logged in as ${userData.validName}`);
        await testStep.log(signUpPage.isLogoutButtonDisplayed(), 'Verify Logout Button Displayed');
        await testStep.log(signUpPage.clickLogoutButton(), 'Click Logout Button');
        //TODO add verification that user is logged out
    });
});

test.describe('Users manipulation negative cases', () => {
    let sharedSteps: SharedSteps;
    let signUpPage: SignUpPage;
    let testStep: TestStep;
    
    test.beforeEach(async ({ page }) => {
        sharedSteps = new SharedSteps(page);
        signUpPage = new SignUpPage(page);
        testStep = new TestStep();
        await testStep.log(page.goto('/'), 'Navigate to Homepage');
    });

    test.afterEach(async ({ page }) => {
        await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
        await sharedSteps.saveTestSteps(test.info().title, testStep.getSteps());
    });

    test('TC03 Login with invalid user', async ({ }) => {
        await testStep.log(signUpPage.clickLoginButton(), 'Click Login Button');
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.invalidPassword), 'Login With Credentials');
        await testStep.log(signUpPage.verifyErrorMessage(validationMessages.invalidLoginMessage), 'Verify Error Message');
    });

    test('TC05 Register User with existing email', async ({ }) => {
        await testStep.log(signUpPage.clickLoginButton(), 'Click Login Button');
        await testStep.log(signUpPage.loginWithCredentials(userData.validUsername, userData.validPassword), 'Login With Credentials');
        await testStep.log(signUpPage.verifyLoggedInAsUsername(userData.validName), `Verify Logged in as ${userData.validName}`);
        await testStep.log(signUpPage.isLogoutButtonDisplayed(), 'Verify Logout Button Displayed');
        await testStep.log(signUpPage.clickLogoutButton(), 'Click Logout Button');
        await testStep.log(signUpPage.clickLoginButton(), 'Click Login Button');
        await testStep.log(signUpPage.signInWithCredentials(userData.validName, userData.validUsername), 'Sign In With Same Credentials');
        await testStep.log(signUpPage.verifyErrorMessage(validationMessages.emailExistsMessage), 'Verify Error Message');
    });
});
