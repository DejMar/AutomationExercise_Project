import { Page, expect } from '@playwright/test';
const testCasesData = require('../data/testCases.json');
const apiTestCasesData = require('../data/testCases-API.json');

export class TestCasePage {
    private page: Page;

    // Locators
    private testCasesButton = 'a[href="/test_cases"]';
    private apiTestCasesButton = 'a[href="/api_list"]';
    private testCasesTitle = 'h2.title.text-center';
    private testCasesDescription = '.panel-group h5';
    private testCaseItem = '.panel-group .panel-title';

    constructor(page: Page) {
        this.page = page;
    }

    async clickTestCasesButton() {
        await this.page.click(this.testCasesButton);
    }

    async clickApiTestCasesButton() {
        await this.page.click(this.apiTestCasesButton);
    }

    async verifyTestCasesPageTitle(testCaseTitle: string) {
        await expect(this.page.locator(this.testCasesTitle)).toHaveText(testCaseTitle);
    }

    async verifyTestCasesDescription(testCaseDescription: string) {
        await expect(this.page.locator(this.testCasesDescription))
            .toContainText(testCaseDescription);
    }
    
    async verifyTestCasesList(testCasesData: { testCases: { name: string }[] }, testCaseId: string, shouldThrowError = true) {
        const actualTestCases = await this.page.locator(this.testCaseItem).allTextContents();
        const expectedTestCases = testCasesData.testCases.map(tc => tc.name);
        const trimmedTestCases = actualTestCases.map(tc => tc.trim());

        type Mismatch = { index: number; expected: string; actual: string };
        const mismatches: Mismatch[] = [];

        // Compare actual vs expected test cases
        const maxLength = Math.max(trimmedTestCases.length, expectedTestCases.length);

        for (let i = 0; i < maxLength; i++) {
            if (trimmedTestCases[i] !== expectedTestCases[i]) {
                mismatches.push({
                    index: i,
                    expected: expectedTestCases[i],
                    actual: trimmedTestCases[i]
                });
            }
        }

        // If mismatches found, write comparison to file
        if (mismatches.length > 0) {
            const fs = require('fs');
            const path = require('path');
            
            const report = {
                timestamp: new Date().toISOString().split('T')[0],
                totalTestCases: maxLength,
                mismatches: mismatches,
                actualTestCases: trimmedTestCases,
                expectedTestCases: expectedTestCases
            };

            const reportDir = 'test-results';
            if (!fs.existsSync(reportDir)){
                fs.mkdirSync(reportDir);
            }

            const reportPath = path.join(reportDir, `${testCaseId}_Test-cases-mismatch-${new Date().toISOString().split('T')[0]}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

            if (shouldThrowError) {
                throw new Error(`Found ${mismatches.length} mismatches between expected and actual test cases. See report at ${reportPath}`);
            }
        }

        // If no mismatches, verify each test case matches
        for (let i = 0; i < expectedTestCases.length; i++) {
            const testCaseLocator = this.page.locator(this.testCaseItem).nth(i);
            await expect(testCaseLocator).toHaveText(expectedTestCases[i]);
        }
    }
}
