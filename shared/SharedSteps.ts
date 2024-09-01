import { Page } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

export class SharedSteps {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private acceptCookiesButton = 'button.careersite-button[data-action="click->common--cookies--alert#acceptAll"]';

  // Methodss
  
  async takeScreenshotOnFailure(page: Page, testInfo: { status: string; title: string }) {
    if (testInfo.status !== 'passed') {
      const screenshotPath = `screenshots/${testInfo.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved: ${screenshotPath}`);
    }
  }

  async compareJsonFiles(filePath1: string, fileName1: string, filePath2: string, fileName2: string) {
    const fullFilePath1 = path.join(__dirname, filePath1, fileName1);
    const fullFilePath2 = path.join(__dirname, filePath2, fileName2);

    const file1 = JSON.parse(await fs.readFile(fullFilePath1, 'utf8'));
    const file2 = JSON.parse(await fs.readFile(fullFilePath2, 'utf8'));

    if (file1.length !== file2.length) {
      return false;
    }

    const sortedFile1 = file1.map((item: Record<string, unknown>) => JSON.stringify(Object.entries(item).sort())).sort();
    const sortedFile2 = file2.map((item: Record<string, unknown>) => JSON.stringify(Object.entries(item).sort())).sort();

    return JSON.stringify(sortedFile1) === JSON.stringify(sortedFile2);
  }


  async acceptCookiesIfPresent() {
    try {
      const cookieButton = this.page.locator(this.acceptCookiesButton);
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
        console.log('Cookies accepted');
      }
    } catch (error) {
      console.log('Cookie banner not found or already accepted');
    }
  }
}