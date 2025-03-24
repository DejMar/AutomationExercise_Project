import { Page, Locator, expect } from '@playwright/test';
import { User } from '../shared/UserData';
import { validationMessages } from '../messages/validationMessages';

export class SignUpPage {
    private page: Page;

    // Locators
    private titleMr = '#id_gender1';
    private titleMrs = '#id_gender2';
    private nameInput = '#name';
    private emailInput = '#email';
    private passwordInput: Locator;
    private daySelect = '#days';
    private monthSelect = '#months';
    private yearSelect = '#years';
    private newsletterCheckbox = '#newsletter';
    private specialOffersCheckbox = '#optin';
    private firstNameInput = '#first_name';
    private lastNameInput = '#last_name';
    private companyInput = '#company';
    private address1Input = '#address1';
    private address2Input = '#address2';
    private countrySelect = '#country';
    private stateInput = '#state';
    private cityInput = '#city';
    private zipcodeInput = '#zipcode';
    private mobileNumberInput = '#mobile_number';
    private createAccountButton = 'button[data-qa="create-account"]';
    private loginSignInButton: Locator;
    private continueButton: Locator;
    private logoutButton = 'a[href="/logout"]';
    private loginEmailInput = '[data-qa="login-email"]';
    private loginPasswordInput = '[data-qa="login-password"]';
    private loginButton = '[data-qa="login-button"]';
    private errorMessage: Locator;
    private signupNameInput = 'input[data-qa="signup-name"]';
    private signupEmailInput = 'input[data-qa="signup-email"]';
    private signupButton = 'button[data-qa="signup-button"]';
    private deleteAccountButton: Locator;
    private accountDeletedHeader: Locator;
    private accountDeletedMessage1: Locator;
    private accountDeletedMessage2: Locator;
    constructor(page: Page) {
        this.page = page;
        this.passwordInput = this.page.getByLabel('Password *');
        this.errorMessage = this.page.locator('p[style="color: red;"]');
        this.continueButton = this.page.getByRole('link', { name: 'Continue' });
        this.loginSignInButton = this.page.getByRole('link', { name: 'Login' });
        this.deleteAccountButton = this.page.getByRole('link', { name: ' Delete Account' });
        // Locators for Account Deleted Text need to be updated
        this.accountDeletedHeader = this.page.getByText('Account Deleted!');
        this.accountDeletedMessage1 = this.page.getByText('Your account has been permanently deleted!');
        this.accountDeletedMessage2 = this.page.getByText('You can create new account to take advantage of member privileges to enhance your online shopping experience with us.');
    }

    // Methods
    async clickLoginButton() {
        await this.loginSignInButton.click();
    }

    async fillSignUpForm(user: User) {
        await this.page.click(user.title === 'Mr' ? this.titleMr : this.titleMrs);
        await this.page.fill(this.nameInput, user.name);
        //await this.page.getByLabel('Email *').fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.page.selectOption(this.daySelect, user.dateOfBirth.day);
        await this.page.selectOption(this.monthSelect, user.dateOfBirth.month);
        await this.page.selectOption(this.yearSelect, user.dateOfBirth.year);
        if (user.newsletter) await this.page.check(this.newsletterCheckbox);
        if (user.specialOffers) await this.page.check(this.specialOffersCheckbox);
        await this.page.fill(this.firstNameInput, user.firstName);
        await this.page.fill(this.lastNameInput, user.lastName);
        await this.page.fill(this.companyInput, user.company);
        await this.page.fill(this.address1Input, user.address1);
        await this.page.fill(this.address2Input, user.address2);
        await this.page.selectOption(this.countrySelect, user.country);
        await this.page.fill(this.stateInput, user.state);
        await this.page.fill(this.cityInput, user.city);
        await this.page.fill(this.zipcodeInput, user.zipcode);
        await this.page.fill(this.mobileNumberInput, user.mobileNumber);
    }

    async clickCreateAccountButton() {
        await this.page.click(this.createAccountButton);
    }

    async fillSignUpFormAndCreateAccount(user: User) {
        await this.fillSignUpForm(user);
        await this.clickCreateAccountButton();
    }

    async isSignUpSuccessful() {
        const congratsMessage = await this.page.locator('p').first().textContent();
        const privilegesMessage = await this.page.locator('p').nth(1).textContent();
        expect(congratsMessage).toBe(validationMessages.congratsMessage);
        expect(privilegesMessage).toBe(validationMessages.privilegesMessage);
        const successMessage = await this.page.locator('b').textContent();
        return successMessage === 'Account Created!';
    }
    async clickContinueButton() {
        await this.continueButton.click();
    }

    async isLogoutButtonDisplayed(): Promise<boolean> {
        const logoutButton = this.page.locator(this.logoutButton);
        await logoutButton.waitFor({state: 'visible'});
        return await logoutButton.isVisible();
    }

    async loginWithCredentials(email: string, password: string) {
        await this.page.fill(this.loginEmailInput, email);
        await this.page.fill(this.loginPasswordInput, password);
        await this.page.click(this.loginButton);
    }

    async signInWithCredentials(name: string, email: string) {
        await this.page.fill(this.signupNameInput, name);
        await this.page.fill(this.signupEmailInput, email);
        await this.page.click(this.signupButton);
    }
    
    async verifyErrorMessage(expectedMessage: string) {
        await this.errorMessage.waitFor({ state: 'visible' });
        await expect(this.errorMessage).toHaveText(expectedMessage);
        return true;
    }

    async clickLogoutButton() {
        await this.page.click(this.logoutButton);
    }

    async clickDeleteAccountButton() {
        await this.deleteAccountButton.click();
    }

    async verifyAccountDeletedText() {
        const accountDeletedHeader = await this.accountDeletedHeader.textContent();
        const accountDeletedMessage1 = await this.accountDeletedMessage1.textContent();
        const accountDeletedMessage2 = await this.accountDeletedMessage2.textContent();

        expect(accountDeletedHeader).toBe(validationMessages.accountDeletedTitle);
        expect(accountDeletedMessage1).toBe(validationMessages.accountDeletedMessage1);
        expect(accountDeletedMessage2).toBe(validationMessages.accountDeletedMessage2);
    }
}