import { test } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { TestReporter, TestSuite, ModuleTestResult } from './helpers/test-reporter';

/**
 * Master Test Runner
 * Executes all configuration test suites and generates consolidated report
 */

const TEST_SUITES = [
  {
    name: 'Navigation Flows',
    file: 'e2e/configuration-navigation-flows.spec.ts',
    type: 'navigation' as const,
    enabled: true,
  },
  {
    name: 'Form Validation',
    file: 'e2e/configuration-validation.spec.ts',
    type: 'validation' as const,
    enabled: true,
  },
  {
    name: 'CRUD Operations',
    file: 'e2e/configuration-crud.spec.ts',
    type: 'crud' as const,
    enabled: true,
  },
];

test.describe('Configuration Testing - Complete Suite', () => {
  test('Run all configuration tests and generate consolidated report', async () => {
    const reporter = new TestReporter();
    const config = '--config=playwright-nav-review.config.ts';

    console.log('\n🚀 Starting Comprehensive Configuration Testing\n');
    console.log('═'.repeat(60));

    for (const suite of TEST_SUITES) {
      if (!suite.enabled) {
        console.log(`\n⏭️  Skipping ${suite.name} (disabled)`);
        continue;
      }

      console.log(`\n📋 Running: ${suite.name}`);
      console.log('─'.repeat(60));

      const testSuite: TestSuite = {
        name: suite.name,
        type: suite.type,
        startTime: new Date(),
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        issues: [],
        recommendations: [],
      };

      try {
        const command = `npx playwright test ${suite.file} ${config} --reporter=json`;
        const startTime = Date.now();

        // Run the test suite
        const output = execSync(command, {
          encoding: 'utf-8',
          stdio: 'pipe',
        });

        const endTime = Date.now();
        testSuite.endTime = new Date();
        testSuite.duration = endTime - startTime;

        // Parse JSON output if available
        try {
          const jsonOutput = JSON.parse(output);
          testSuite.totalTests = jsonOutput.suites?.reduce((sum: number, s: any) =>
            sum + (s.specs?.length || 0), 0) || 0;
          testSuite.passed = jsonOutput.stats?.expected || 0;
          testSuite.failed = jsonOutput.stats?.unexpected || 0;
          testSuite.skipped = jsonOutput.stats?.skipped || 0;
        } catch (e) {
          // If JSON parsing fails, estimate from output
          testSuite.totalTests = 1;
          testSuite.passed = 1;
        }

        console.log(`✅ ${suite.name} completed in ${(testSuite.duration / 1000).toFixed(2)}s`);
      } catch (error: any) {
        testSuite.endTime = new Date();
        testSuite.duration = Date.now() - testSuite.startTime.getTime();
        testSuite.failed = 1;
        testSuite.totalTests = 1;
        testSuite.issues.push(`Test suite failed: ${error.message}`);

        console.log(`❌ ${suite.name} failed`);
      }

      reporter.addTestSuite(testSuite);

      // Import test results from individual reports
      await importTestResults(reporter, suite.type);
    }

    // Generate consolidated report
    console.log('\n═'.repeat(60));
    console.log('\n📊 Generating Consolidated Report\n');

    reporter.saveReport('docs/consolidated-test-report.md');
    reporter.saveJSON('docs/consolidated-test-report.json');

    // Print summary
    printSummary(reporter);

    console.log('\n═'.repeat(60));
    console.log('\n✅ All tests completed!\n');
  });
});

async function importTestResults(reporter: TestReporter, type: 'navigation' | 'validation' | 'crud') {
  // Import navigation results
  if (type === 'navigation') {
    const navReportPath = 'docs/configuration-navigation-flows.md';
    if (fs.existsSync(navReportPath)) {
      const content = fs.readFileSync(navReportPath, 'utf-8');
      const modules = parseNavigationReport(content);
      modules.forEach(m => reporter.addModuleResult(m));

      // Import navigation screenshots
      const navScreenshots = fs.readdirSync('screenshots')
        .filter(f => f.startsWith('flow-') && f.endsWith('.png'))
        .map(f => `screenshots/${f}`);
      reporter.screenshots.navigation.push(...navScreenshots);
    }
  }

  // Import validation results
  if (type === 'validation') {
    const valReportPath = 'docs/configuration-validation-tests.md';
    if (fs.existsSync(valReportPath)) {
      const content = fs.readFileSync(valReportPath, 'utf-8');
      const modules = parseValidationReport(content);
      modules.forEach(m => reporter.addModuleResult(m));

      // Import validation screenshots
      const valScreenshots = fs.readdirSync('screenshots')
        .filter(f => f.startsWith('validation-') && f.endsWith('.png'))
        .map(f => `screenshots/${f}`);
      reporter.screenshots.validation.push(...valScreenshots);
    }
  }

  // Import CRUD results
  if (type === 'crud') {
    const crudReportPath = 'docs/configuration-crud-tests.md';
    if (fs.existsSync(crudReportPath)) {
      const content = fs.readFileSync(crudReportPath, 'utf-8');
      const modules = parseCRUDReport(content);
      modules.forEach(m => reporter.addModuleResult(m));

      // Import CRUD screenshots
      const crudScreenshots = fs.readdirSync('screenshots')
        .filter(f => f.startsWith('crud-') && f.endsWith('.png'))
        .map(f => `screenshots/${f}`);
      reporter.screenshots.crud.push(...crudScreenshots);
    }
  }
}

function parseNavigationReport(content: string): ModuleTestResult[] {
  const modules: ModuleTestResult[] = [];
  const moduleRegex = /### (.+?)\n\n\*\*Path\*\*: `(.+?)`/g;

  let match;
  while ((match = moduleRegex.exec(content)) !== null) {
    const moduleName = match[1];
    const modulePath = match[2];

    modules.push({
      module: moduleName,
      path: modulePath,
      navigation: {
        mainLoad: extractStatus(content, moduleName, '1. Main Page Load'),
        create: extractStatus(content, moduleName, '2. Create/Add Navigation'),
        edit: extractStatus(content, moduleName, '3. Edit Navigation'),
        view: extractStatus(content, moduleName, '4. View/Details Navigation'),
        delete: extractStatus(content, moduleName, '5. Delete Action'),
        filter: extractStatus(content, moduleName, '6. Filter Navigation'),
        search: extractStatus(content, moduleName, '7. Search Functionality'),
        sort: extractStatus(content, moduleName, '8. Sorting Functionality'),
        bulk: extractStatus(content, moduleName, '9. Bulk Actions'),
        back: extractStatus(content, moduleName, '10. Back Navigation'),
      },
      screenshots: [],
      issues: [],
      recommendations: [],
    });
  }

  return modules;
}

function parseValidationReport(content: string): ModuleTestResult[] {
  const modules: ModuleTestResult[] = [];
  const moduleRegex = /### (.+?)\n\n\*\*Path\*\*: `(.+?)`/g;

  let match;
  while ((match = moduleRegex.exec(content)) !== null) {
    const moduleName = match[1];
    const modulePath = match[2];

    modules.push({
      module: moduleName,
      path: modulePath,
      validation: {
        requiredFields: extractStatus(content, moduleName, '1. Required Fields'),
        dataTypes: extractStatus(content, moduleName, '2. Data Type Validation'),
        inputConstraints: extractStatus(content, moduleName, '3. Input Constraints'),
        errorMessages: extractStatus(content, moduleName, '4. Error Messages'),
        formSubmission: extractStatus(content, moduleName, '5. Form Submission'),
      },
      screenshots: [],
      issues: [],
      recommendations: [],
    });
  }

  return modules;
}

function parseCRUDReport(content: string): ModuleTestResult[] {
  // Placeholder for CRUD report parsing
  return [];
}

function extractStatus(content: string, module: string, testName: string): string {
  const sectionRegex = new RegExp(`### ${module}[\\s\\S]*?##### ${testName}[\\s\\S]*?- \\*\\*Status\\*\\*: (.+?)\\n`);
  const match = content.match(sectionRegex);
  return match ? match[1] : '⚪ Not Found';
}

function printSummary(reporter: TestReporter) {
  console.log('📈 Test Summary:');
  console.log('─'.repeat(60));
  console.log(`   Total Tests: ${reporter.summary.totalTests}`);
  console.log(`   ✅ Passed: ${reporter.summary.totalPassed}`);
  console.log(`   ❌ Failed: ${reporter.summary.totalFailed}`);
  console.log(`   ⏭️  Skipped: ${reporter.summary.totalSkipped}`);
  console.log(`   📊 Pass Rate: ${reporter.summary.overallPassRate}%`);
  console.log(`   ⏱️  Duration: ${(reporter.summary.testDuration / 1000 / 60).toFixed(2)} minutes`);
  console.log('');
  console.log(`   🐛 Issues: ${reporter.summary.totalIssues}`);
  console.log(`   💡 Recommendations: ${reporter.summary.totalRecommendations}`);
  console.log('');
  console.log(`   📸 Screenshots: ${
    reporter.screenshots.navigation.length +
    reporter.screenshots.validation.length +
    reporter.screenshots.crud.length
  }`);
}
