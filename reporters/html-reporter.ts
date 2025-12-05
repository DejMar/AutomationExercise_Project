import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs/promises';
import path from 'path';

interface TestStepInfo {
  description: string;
  status: 'PASSED' | 'FAILED';
  error?: string;
}

interface TestCaseInfo {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';
  duration: number;
  steps: TestStepInfo[];
  error?: string;
  suite: string;
  specFile: string;
}

export default class HtmlReporter implements Reporter {
  private testCases: TestCaseInfo[] = [];
  private config: FullConfig | undefined;
  private outputDir: string = 'test-results/html-report';

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const suiteName = test.parent.title || 'Default Suite';
    const steps: TestStepInfo[] = [];

    // Determine the spec file (test file) for the test
    const specFile = (test as any).location?.file ||
      (test as any)._location?.file ||
      (test as any).testFile ||
      (test as any)._testFile ||
      (test.parent && (test.parent as any).location?.file) ||
      'unknown.spec.ts';

    // Extract steps from test result
    const extractSteps = (testResult: TestResult) => {
      if (testResult.steps) {
        for (const step of testResult.steps) {
          // Capture all meaningful steps (not just test.step category)
          if (step.title && (step.category === 'test.step' || step.category === 'test' || step.category === 'hook')) {
            // Skip very generic steps
            if (!step.title.includes('beforeEach') && !step.title.includes('afterEach')) {
              steps.push({
                description: step.title,
                status: step.error ? 'FAILED' : 'PASSED',
                error: step.error?.message
              });
            }
          }
          // Recursively extract nested steps
          if (step.steps && step.steps.length > 0) {
            extractSteps(step as any);
          }
        }
      }
    };

    extractSteps(result);

    // Also try to read from saved test steps file if available (this will merge with existing steps)
    const fileSteps = await this.loadStepsFromFile(test.title);

    // Merge file steps with test result steps, prioritizing file steps as they have more detail
    // Remove duplicates and combine
    const allSteps = [...fileSteps];
    const existingDescriptions = new Set(fileSteps.map(s => s.description));

    // Add test result steps that aren't already in file steps
    for (const step of steps) {
      if (!existingDescriptions.has(step.description)) {
        allSteps.push(step);
      }
    }

    const testCaseInfo: TestCaseInfo = {
      title: test.title,
      status: result.status,
      duration: result.duration,
      steps: allSteps.length > 0 ? allSteps : steps,
      error: result.error?.message,
      suite: suiteName,
      specFile: specFile
    };

    this.testCases.push(testCaseInfo);
  }

  private async loadStepsFromFile(testTitle: string): Promise<TestStepInfo[]> {
    const steps: TestStepInfo[] = [];
    try {
      const testResultsDir = 'test-results';
      const files = await fs.readdir(testResultsDir);
      const testName = testTitle.replace(/\s+/g, '_');
      const today = new Date().toISOString().split('T')[0];
      
      // Find the most recent step file for this test (check today's date and also look for any recent files)
      const stepFiles = files.filter(f => 
        f.includes(testName) && f.includes('_steps_') && f.endsWith('.txt')
      );

      if (stepFiles.length > 0) {
        // Sort by modification time and get the most recent
        const fileStats = await Promise.all(
          stepFiles.map(async (file) => {
            const filePath = path.join(testResultsDir, file);
            const stats = await fs.stat(filePath);
            return { file, mtime: stats.mtime };
          })
        );
        
        fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
        const latestFile = fileStats[0].file;
        
        const content = await fs.readFile(path.join(testResultsDir, latestFile), 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Parse step lines (format: "Description - STATUS" or "Description - FAILED: error")
        for (const line of lines) {
          if (line.includes(' - ')) {
            const [description, ...statusParts] = line.split(' - ');
            const statusText = statusParts.join(' - ');
            
            if (statusText.startsWith('FAILED:')) {
              const error = statusText.replace('FAILED:', '').trim();
              steps.push({
                description: description.trim(),
                status: 'FAILED',
                error: error
              });
            } else if (statusText === 'PASSED') {
              steps.push({
                description: description.trim(),
                status: 'PASSED'
              });
            }
          }
        }
      }
    } catch (error) {
      // If file doesn't exist or can't be read, return empty array
    }
    return steps;
  }

  async onEnd(result: FullResult) {
    await this.generateHtmlReport();
  }

  private async generateHtmlReport() {
    await fs.mkdir(this.outputDir, { recursive: true });

    // Categorize tests by status and spec file
    const testsByFile: { [file: string]: TestCaseInfo[] } = {};
    for (const tc of this.testCases) {
      if (!testsByFile[tc.specFile]) {
        testsByFile[tc.specFile] = [];
      }
      testsByFile[tc.specFile].push(tc);
    }

    // Get counts
    const passedTests = this.testCases.filter(tc => tc.status === 'passed');
    const failedTests = this.testCases.filter(tc => tc.status === 'failed' || tc.status === 'timedOut' || tc.status === 'interrupted');
    const skippedTests = this.testCases.filter(tc => tc.status === 'skipped');
    const totalTests = this.testCases.length;
    const totalDuration = this.testCases.reduce((sum, tc) => sum + tc.duration, 0);

    // Helper to group by file and by status
    function groupTestsByFileAndStatus(tests: TestCaseInfo[]) {
      const grouped: { [file: string]: TestCaseInfo[] } = {};
      for (const tc of tests) {
        if (!grouped[tc.specFile]) grouped[tc.specFile] = [];
        grouped[tc.specFile].push(tc);
      }
      return grouped;
    }

    const failedGrouped = groupTestsByFileAndStatus(failedTests);
    const passedGrouped = groupTestsByFileAndStatus(passedTests);
    const skippedGrouped = groupTestsByFileAndStatus(skippedTests);

    // Unique identifiers for file collapse sections (scoped by section type)
    let fileSectionCounter = 0;
    function nextFileSectionId() {
      return `file-sec-${fileSectionCounter++}`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Execution Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .timestamp {
            opacity: 0.9;
            font-size: 0.9em;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f9f9f9;
            border-bottom: 2px solid #e0e0e0;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .summary-card.total h3 { color: #667eea; }
        .summary-card.passed h3 { color: #10b981; }
        .summary-card.failed h3 { color: #ef4444; }
        .summary-card.skipped h3 { color: #f59e0b; }
        .summary-card p {
            color: #666;
            font-size: 0.9em;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            color: #333;
        }
        .file-section {
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafbff;
        }
        .file-title-row {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            padding: 16px 18px 15px 15px;
            border-radius: 8px 8px 0 0;
            background: #eef2fe;
            border-bottom: 1px solid #e0e0e0;
            gap: 0.5em;
            transition: background 0.2s;
        }
        .file-title-row:hover {
            background: #e0e7ff;
        }
        .file-title {
            font-size: 1.13em;
            color: #555;
            font-style: italic;
            flex: 1;
        }
        .file-sect-toggle {
            font-size: 1.06em;
            display: inline-block;
            margin-right: 14px;
            transition: transform 0.25s;
        }
        .file-title-row.expanded .file-sect-toggle {
            transform: rotate(90deg);
        }
        .file-tests-inner {
            padding: 18px 16px 14px 16px;
        }
        .file-tests-inner.collapsed {
            display: none;
        }
        .test-case {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .test-case:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .test-case.failed {
            border-color: #ef4444;
            background: #fef2f2;
        }
        .test-case.passed {
            border-color: #10b981;
            background: #f0fdf4;
        }
        .test-case.skipped {
            border-color: #f59e0b;
            background: #fffbeb;
        }
        .test-case.interrupted {
            border-color: #ef4444;
            background: #fef2f2;
        }
        .test-header {
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0,0,0,0.02);
        }
        .test-header:hover {
            background: rgba(0,0,0,0.05);
        }
        .test-title {
            font-size: 1.2em;
            font-weight: 600;
            color: #333;
        }
        .test-status {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }
        .test-status.passed {
            background: #10b981;
            color: white;
        }
        .test-status.failed {
            background: #ef4444;
            color: white;
        }
        .test-status.skipped {
            background: #f59e0b;
            color: white;
        }
        .test-status.interrupted {
            background: #ef4444;
            color: white;
        }
        .test-info {
            padding: 0 20px 20px 20px;
            display: none;
        }
        .test-info.expanded {
            display: block;
        }
        .test-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 0.9em;
            color: #666;
        }
        .test-error {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            color: #991b1b;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
        }
        .steps-container {
            margin-top: 15px;
        }
        .steps-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }
        .step {
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 6px;
            border-left: 4px solid;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .step.passed {
            background: #f0fdf4;
            border-color: #10b981;
        }
        .step.failed {
            background: #fef2f2;
            border-color: #ef4444;
        }
        .step-icon {
            font-size: 1.2em;
            flex-shrink: 0;
        }
        .step-description {
            flex: 1;
            color: #333;
        }
        .step-error {
            margin-top: 5px;
            padding: 8px;
            background: #fee2e2;
            border-radius: 4px;
            font-size: 0.85em;
            color: #991b1b;
            font-family: 'Courier New', monospace;
        }
        .no-tests {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1em;
        }
        .toggle-icon {
            transition: transform 0.3s ease;
        }
        .test-header.expanded .toggle-icon {
            transform: rotate(180deg);
        }
        .file-icon {
            color: #667eea; font-size: 1.1em; margin-right: 0.4em; vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Execution Report</h1>
            <div class="timestamp">Generated on ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>${totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${passedTests.length}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${failedTests.length}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card skipped">
                <h3>${skippedTests.length}</h3>
                <p>Skipped</p>
            </div>
            <div class="summary-card">
                <h3>${(totalDuration / 1000).toFixed(2)}s</h3>
                <p>Total Duration</p>
            </div>
        </div>
        
        <div class="content">
            ${failedTests.length > 0 ? this.generateTestSectionByFile('❌ Failed Tests', failedGrouped, true) : ''}
            ${passedTests.length > 0 ? this.generateTestSectionByFile('✅ Passed Tests', passedGrouped, false) : ''}
            ${skippedTests.length > 0 ? this.generateTestSectionByFile('⏭️ Skipped Tests', skippedGrouped, false) : ''}
            
            ${totalTests === 0 ? '<div class="no-tests">No tests were executed.</div>' : ''}
        </div>
    </div>
    
    <script>
        // Toggle test steps per test
        document.querySelectorAll('.test-header').forEach(header => {
            header.addEventListener('click', function() {
                const testCase = this.parentElement;
                const testInfo = testCase.querySelector('.test-info');
                const isExpanded = testInfo.classList.contains('expanded');
                if (isExpanded) {
                    testInfo.classList.remove('expanded');
                    this.classList.remove('expanded');
                } else {
                    testInfo.classList.add('expanded');
                    this.classList.add('expanded');
                }
            });
        });

        // Toggle file section collapse
        document.querySelectorAll('.file-title-row').forEach(fileRow => {
            fileRow.addEventListener('click', function(e) {
                // Only react if clicking on header, not on, e.g., expand/collapse icon
                if (e.target.classList.contains('file-sect-toggle') || e.target.classList.contains('file-title-row') || e.target.classList.contains('file-title') || e.target.classList.contains('file-icon')) {
                    // continue
                }
                const sectionId = this.getAttribute('data-file-section-id');
                if (!sectionId) return;
                const section = document.getElementById(sectionId);
                const expanded = this.classList.contains('expanded');
                if (expanded) {
                    this.classList.remove('expanded');
                    section.classList.add('collapsed');
                } else {
                    this.classList.add('expanded');
                    section.classList.remove('collapsed');
                }
            });
        });

        // Start with failed test file sections expanded by default
        document.querySelectorAll('.section.failed-files .file-title-row').forEach(row => {
            // Only expand if the file-section has failed tests
            row.classList.add('expanded');
            const sectionId = row.getAttribute('data-file-section-id');
            if (sectionId) {
                const sec = document.getElementById(sectionId);
                if (sec) sec.classList.remove('collapsed');
            }
        });

        // Auto-expand failed tests themselves
        document.querySelectorAll('.test-case.failed .test-header').forEach(header => {
            header.click();
        });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(this.outputDir, 'index.html'), html);
    console.log(`\n📊 HTML Report generated: ${path.join(this.outputDir, 'index.html')}`);
  }

  // Helper function to prettify file names into nice test group headings
  private prettifyFileName(filePath: string): string {
    // E.g. "/Users/dejanmarjanovic/Desktop/Automation.../products.spec.ts"
    // Or "tests/E2E/products.spec.ts"
    // Want: "Products Tests"

    // Take just file name
    let fileName = filePath.split(/[\\/]/).pop() || filePath;
    // Remove extension
    fileName = fileName.replace(/\.(spec|test)\.ts$/, '');
    // Remove dash/underscore and capitalize separate words
    // If fileName is like 'products' or 'login-page', convert to 'Products', 'Login Page'
    let friendly = fileName.replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // If the original file name contains 'product', append 'Tests'
    // Otherwise, always append 'Tests' for better display
    if (!friendly.toLowerCase().includes('test')) {
      friendly = friendly.trim() + ' Tests';
    }

    return friendly.trim();
  }

  // Grouped version: section -> by file -> cases
  private generateTestSectionByFile(sectionTitle: string, grouped: { [file: string]: TestCaseInfo[] }, expandByDefault: boolean = false): string {
    // obtain stable id across page loads for the same files:
    let sectionId = 0;
    const files = Object.keys(grouped).sort();
    if (files.length === 0) return '';

    // Count total tests shown in section
    const numTests = files.reduce((sum, file) => sum + grouped[file].length, 0);

    // Use a css class for the "failed files" section for initial open state
    const extraSectionClass = sectionTitle.includes("Failed") ? " failed-files" : "";

    return `
        <div class="section${extraSectionClass}">
            <h2 class="section-title">${sectionTitle} (${numTests})</h2>
            ${files.map(specFile => {
                const thisSectionId = `file-section-${sectionTitle.replace(/[^a-z0-9]/gi,'').toLowerCase()}-${sectionId++}`;
                // Expand failed test files by default only for failed section
                const rowExpandedClass = (expandByDefault ? 'expanded' : '');
                const innerCollapsedClass = (expandByDefault ? '' : 'collapsed');
                // Use prettified file name here!
                const fileDisplay = `${this.prettifyFileName(specFile)} (${grouped[specFile].length} ${grouped[specFile].length === 1 ? 'test' : 'tests'})`;
                return `
                    <div class="file-section">
                        <div class="file-title-row${rowExpandedClass ? ' expanded' : ''}" data-file-section-id="${thisSectionId}">
                            <span class="file-sect-toggle" aria-label="Show/hide file section" style="user-select:none;display:inline-block;vertical-align:middle;">▶</span>
                            <span class="file-title">
                                <span class="file-icon">📄</span>
                                ${fileDisplay}
                            </span>
                        </div>
                        <div class="file-tests-inner${innerCollapsedClass ? ' collapsed' : ''}" id="${thisSectionId}">
                            ${grouped[specFile].map(tc => this.generateTestCase(tc)).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
  }

  private generateTestCase(testCase: TestCaseInfo): string {
    const statusClass = testCase.status;
    const statusText = testCase.status.toUpperCase();
    const duration = (testCase.duration / 1000).toFixed(2);

    return `
        <div class="test-case ${statusClass}">
            <div class="test-header">
                <div>
                    <div class="test-title">${this.escapeHtml(testCase.title)}</div>
                    <div class="test-meta">
                        <span>Suite: ${this.escapeHtml(testCase.suite)}</span>
                        <span>Duration: ${duration}s</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="test-status ${statusClass}">${statusText}</span>
                    <span class="toggle-icon">▼</span>
                </div>
            </div>
            <div class="test-info">
                ${testCase.error ? `<div class="test-error">${this.escapeHtml(testCase.error)}</div>` : ''}
                ${testCase.steps.length > 0 ? this.generateSteps(testCase.steps) : '<div class="no-tests">No steps recorded</div>'}
            </div>
        </div>
    `;
  }

  private generateSteps(steps: TestStepInfo[]): string {
    return `
        <div class="steps-container">
            <div class="steps-title">Test Steps (${steps.length}):</div>
            ${steps.map(step => `
                <div class="step ${step.status.toLowerCase()}">
                    <span class="step-icon">${step.status === 'PASSED' ? '✓' : '✗'}</span>
                    <div class="step-description">${this.escapeHtml(step.description)}</div>
                </div>
                ${step.error ? `<div class="step-error">Error: ${this.escapeHtml(step.error)}</div>` : ''}
            `).join('')}
        </div>
    `;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}