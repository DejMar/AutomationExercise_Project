import { expect, Page } from '@playwright/test';

export class HomePage {
    private page: Page;
    private subscriptionLocator = '//*[@id="footer"]/div[1]/div/div/div[2]/div/h2';
    private scrollUpArrowLocator = '//*[@id="scrollUp"]';
    private scrollUpSuccessLocator = '//*[@id="full-width-banner-1"]/div/div/div/div[2]/div[2]/h2';

    constructor(page: Page) {
        this.page = page;
    }

    async verifyHomePageIsVisible() {
        await expect(this.page).toHaveURL('http://automationexercise.com');
    }

    async verifySubscriptionIsVisible() {
        await expect(this.page.locator(this.subscriptionLocator)).toBeVisible();
    }

    async clickScrollUpArrow() {
        await this.page.locator(this.scrollUpArrowLocator).click();
    }

    async verifyScrollUpIsSuccessful() {
        await expect(this.page.locator(this.scrollUpSuccessLocator)).toBeVisible();
    }
}