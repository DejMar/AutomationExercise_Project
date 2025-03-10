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

  async compareJsonFiles(filePath1: string, fileName1: string, filePath2: string, fileName2: string): Promise<boolean> {
    const fullFilePath1 = path.join(__dirname, filePath1, fileName1);
    const fullFilePath2 = path.join(__dirname, filePath2, fileName2);

    try {
      const file1Content = await fs.readFile(fullFilePath1, 'utf8');
      const file2Content = await fs.readFile(fullFilePath2, 'utf8');

      const file1 = JSON.parse(file1Content);
      const file2 = JSON.parse(file2Content);

      // Check if files contain arrays
      if (!Array.isArray(file1.brands) || !Array.isArray(file2.brands)) {
        throw new Error('JSON files must contain arrays under "brands" key');
      }

      const brands1 = file1.brands;
      const brands2 = file2.brands;

      if (brands1.length !== brands2.length) {
        return false;
      }

      const sortedFile1 = brands1
        .map((item: Record<string, unknown>) => JSON.stringify(Object.entries(item).sort()))
        .sort();
      const sortedFile2 = brands2
        .map((item: Record<string, unknown>) => JSON.stringify(Object.entries(item).sort()))
        .sort();

      return JSON.stringify(sortedFile1) === JSON.stringify(sortedFile2);
    } catch (error) {
      console.error('Error comparing JSON files:', error);
      throw error;
    }
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

  async verifyHomePageIsVisible() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('h1');
    await this.page.waitForSelector('h2');
    await this.page.waitForSelector('h3');
  }
  
  async saveTestSteps(testTitle: string, steps: string[]) {
    if (steps.some(step => step.includes('FAILED'))) {
      const testName = testTitle.replace(/\s+/g, '_');
      const testResultsDir = 'test-results';
      await fs.mkdir(testResultsDir, { recursive: true });
      await fs.writeFile(`${testResultsDir}/FAILED_${testName}_steps_${new Date().toISOString().split('T')[0]}.txt`, steps.join('\n'));
    }
  }
}