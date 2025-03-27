import { Page, expect } from '@playwright/test';
import { User } from '../shared/UserData';

export class ContactUsPage {
    private page: Page;

    // Locators
    private contactUsLink: string;
    private getInTouchTitle: string;
    private nameInput: string;
    private emailInput: string;
    private subjectInput: string;
    private messageInput: string;
    private fileUploadInput: string;
    private submitButton: string;
    private successMessage: string;
    private homeButton: string;

    constructor(page: Page) {
        this.page = page;
        this.contactUsLink = 'a[href="/contact_us"]';
        this.getInTouchTitle = 'h2.title.text-center:has-text("Get In Touch")';
        this.nameInput = '[data-qa="name"]';
        this.emailInput = '[data-qa="email"]';
        this.subjectInput = '[data-qa="subject"]';  
        this.messageInput = '[data-qa="message"]';
        this.fileUploadInput = 'input[name="upload_file"]';
        this.submitButton = '[data-qa="submit-button"]';
        this.successMessage = "//div[contains(@class, 'status') and contains(@class, 'alert-success') and text()='Success! Your details have been submitted successfully.']";
        this.homeButton = 'a[href="/"]';
    }

    async clickContactUsButton() {
        await this.page.click(this.contactUsLink);
    }

    async verifyGetInTouchIsVisible() {
        await this.page.waitForSelector(this.getInTouchTitle);
    }

    async fillContactForm(user: User, subject: string, message: string) {
        await this.page.fill(this.nameInput, user.name);
        await this.page.fill(this.emailInput, user.email);
        await this.page.fill(this.subjectInput, subject);
        await this.page.fill(this.messageInput, message);
    }

    async uploadFile(filePath: string) {
        const fileInput = await this.page.locator(this.fileUploadInput);
        await fileInput.setInputFiles(filePath);
    }

    async submitForm() {
        await this.page.click(this.submitButton);
    }
    //TODO: This is a temporary solution to handle the alert. We need to find a better way to handle this.
    //TODO: Needs to be fixed
    async handleAlert() {
        await this.page.waitForTimeout(10000);
        await this.page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
    }

    async verifySuccessMessage() {
        await this.page.waitForSelector(this.successMessage);
    }

    async clickHomeButton() {
        await this.page.click(this.homeButton);
    }
}
