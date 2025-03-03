import { Page, Locator, expect } from '@playwright/test';
import { User } from '../shared/UserData';

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
    private loginButton = 'a[href="/login"]';
    private continueButton = '//a[@data-qa="continue-button"]';
    private logoutButton = 'a[href="/logout"]';

    constructor(page: Page) {
        this.page = page;
        this.passwordInput = this.page.getByLabel('Password *');
    }

    // Methods
    async navigateTo() {
        await this.page.goto('/signup');
    }

    async clickLoginButton() {
        await this.page.click(this.loginButton);
    }
    async populateAndSubmitSignUpForm(user: User) {
        await this.page.fill('input[data-qa="signup-name"]', user.name);
        await this.page.fill('input[data-qa="signup-email"]', user.email);
        await this.page.click('button[data-qa="signup-button"]');
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

    async createNewUser(user: User) {
        await this.fillSignUpForm(user);
        await this.clickCreateAccountButton();
    }

    async isSignUpSuccessful() {
        const congratsMessage = await this.page.locator('p').first().textContent();
        const privilegesMessage = await this.page.locator('p').nth(1).textContent();
        expect(congratsMessage).toBe('Congratulations! Your new account has been successfully created!');
        expect(privilegesMessage).toBe('You can now take advantage of member privileges to enhance your online shopping experience with us.');
        const successMessage = await this.page.locator('b').textContent();
        return successMessage === 'Account Created!';
    }
    async clickContinueButton() {
        await this.page.click(this.continueButton);
    }

    async isLogoutButtonDisplayed(): Promise<boolean> {
        const logoutButton = this.page.locator(this.logoutButton);
        await logoutButton.waitFor({state: 'visible'});
        return await logoutButton.isVisible();
    }
}