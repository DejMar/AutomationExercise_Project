import { test, expect } from '@playwright/test';
import { SharedSteps } from '../../shared/SharedSteps';
import { SignUpPage } from '../../pages/SignUpPage';
const { generateUser } = require('../../shared/UserData');

test.describe('Manipulating users', () => {
let sharedSteps: SharedSteps
let signUpPage: SignUpPage

  test.beforeEach(async ({ page }) => {
    sharedSteps = new SharedSteps(page)
    signUpPage = new SignUpPage(page);
})

  test.afterEach(async ({ page }) => {
    await sharedSteps.takeScreenshotOnFailure(page, { status: test.info().status ?? '', title: test.info().title });
  });

  test.only('TC01 Register new user', async ({ page }) => {
  const newUser = generateUser();
  await page.goto('/')
  await signUpPage.clickLoginButton();
  await signUpPage.populateAndSubmitSignUpForm(newUser);
  await signUpPage.createNewUser(newUser);
  await signUpPage.isSignUpSuccessful();
  await signUpPage.clickContinueButton();
  await signUpPage.isLogoutButtonDisplayed();
  })
})