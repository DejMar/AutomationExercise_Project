import { expect, Page } from '@playwright/test';

export class HomePage {
    private page: Page;
    private subscriptionLocator: string;
    private scrollUpArrowLocator: string;
    private scrollUpSuccessLocator: string;

    constructor(page: Page) {
        this.page = page;
        this.subscriptionLocator = '//*[@id="footer"]/div[1]/div/div/div[2]/div/h2';
        this.scrollUpArrowLocator = '//*[@id="scrollUp"]';
        this.scrollUpSuccessLocator = '//*[@id="full-width-banner-1"]/div/div/div/div[2]/div[2]/h2';
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
    private womenCategoryButtonLocator = 'a[data-toggle="collapse"][data-parent="#accordian"][href="#Women"]';

    async clickWomenCategoryButton() {
        await this.page.locator(this.womenCategoryButtonLocator).click();
    }
    private dressCategoryButtonLocator = 'a[href="/category_products/1"]';

    async clickDressCategoryButton() {
        await this.page.locator(this.dressCategoryButtonLocator).click();
    }

    async selectCategory(category: string, subcategory: string) {
        const categoryLocator = `a[data-toggle="collapse"][data-parent="#accordian"][href="#${category}"]`;
        const subcategoryLocator = `#${category} a[href*="/category_products/"]:has-text("${subcategory}")`;

        await this.page.locator(categoryLocator).click();
        await this.page.locator(subcategoryLocator).click();
    }
    async verifyTitle(expectedText: string) {
        const titleLocator = 'h2.title.text-center';
        await expect(this.page.locator(titleLocator)).toHaveText(expectedText);
    }

    async clickBrand(brandName: string) {
        const brandLocator = `div.brands_products ul.nav.nav-pills.nav-stacked li a:has-text("${brandName}")`;
        await this.page.locator(brandLocator).click();
    }

}