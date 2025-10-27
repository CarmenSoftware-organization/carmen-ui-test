import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'https://carmen-inventory.vercel.app';

const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

// Configuration modules to test
const modules = [
  { name: 'Currency', path: '/en/configuration/currency' },
  { name: 'Exchange Rates', path: '/en/configuration/exchange-rate' },
  { name: 'Delivery Point', path: '/en/configuration/delivery-point' },
  { name: 'Store Location', path: '/en/configuration/location' },
  { name: 'Department', path: '/en/configuration/department' },
  { name: 'Tax Profile', path: '/en/configuration/tax-profile' },
  { name: 'Extra Cost', path: '/en/configuration/extra-cost' },
  { name: 'Business Type', path: '/en/configuration/business-type' },
];

interface ValidationResult {
  module: string;
  path: string;
  validationTests: {
    requiredFields: { status: string; details: string; fields: string[] };
    dataTypes: { status: string; details: string; validations: string[] };
    inputConstraints: { status: string; details: string; constraints: string[] };
    errorMessages: { status: string; details: string; messages: string[] };
    formSubmission: { status: string; details: string };
  };
  issues: string[];
  recommendations: string[];
  screenshots: string[];
}

// Login helper function
async function login(page: Page) {
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/en/sign-in`);
  await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
  await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();
  await page.getByTestId('sign-in-button').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log('Login completed, current URL:', page.url());
}

// Test validation for a single module
async function testModuleValidation(page: Page, module: typeof modules[0]): Promise<ValidationResult> {
  const moduleName = module.name.toLowerCase().replace(/\s+/g, '-');
  const validation: ValidationResult = {
    module: module.name,
    path: module.path,
    validationTests: {
      requiredFields: { status: '⚠️ Not Tested', details: '', fields: [] },
      dataTypes: { status: '⚠️ Not Tested', details: '', validations: [] },
      inputConstraints: { status: '⚠️ Not Tested', details: '', constraints: [] },
      errorMessages: { status: '⚠️ Not Tested', details: '', messages: [] },
      formSubmission: { status: '⚠️ Not Tested', details: '' },
    },
    issues: [],
    recommendations: [],
    screenshots: [],
  };

  console.log(`\n=== Testing ${module.name} Validation ===\n`);

  // Navigate to module
  await page.goto(`${BASE_URL}${module.path}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Test 1: Required Fields Validation
  console.log('1. Testing required fields validation...');
  const createButton = page.getByRole('button', { name: /add|create|new|\+/i }).first();

  if (await createButton.count() > 0) {
    await createButton.click();
    await page.waitForTimeout(2000);

    // Look for form fields
    const form = page.locator('form, [role="dialog"] form, .modal form').first();

    if (await form.count() > 0) {
      // Find required fields (marked with asterisk or required attribute)
      const requiredInputs = await form.locator('input[required], textarea[required], select[required]').all();
      const asteriskLabels = await form.locator('label:has-text("*")').all();

      validation.validationTests.requiredFields.fields = [];

      for (const input of requiredInputs) {
        const name = await input.getAttribute('name') || await input.getAttribute('id') || 'unnamed';
        validation.validationTests.requiredFields.fields.push(name);
      }

      if (requiredInputs.length > 0) {
        validation.validationTests.requiredFields.status = '✅ Found';
        validation.validationTests.requiredFields.details = `Found ${requiredInputs.length} required fields`;
      } else if (asteriskLabels.length > 0) {
        validation.validationTests.requiredFields.status = '⚠️ Visual Only';
        validation.validationTests.requiredFields.details = `Found ${asteriskLabels.length} fields marked with * but no required attributes`;
        validation.recommendations.push('Add required attributes to fields marked with asterisks');
      } else {
        validation.validationTests.requiredFields.status = '❌ Not Found';
        validation.validationTests.requiredFields.details = 'No required field indicators found';
        validation.issues.push('Required fields not clearly marked');
      }

      // Test 2: Try submitting empty form
      console.log('2. Testing empty form submission...');
      const submitButton = form.getByRole('button', { name: /save|submit|create|add/i }).first();

      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(1500);

        // Check for validation messages
        const errorMessages = await page.locator('.error, .text-destructive, .text-red-500, [role="alert"]').all();
        const toastMessages = await page.locator('[role="status"], .toast, .notification').all();

        validation.validationTests.errorMessages.messages = [];

        for (const error of errorMessages) {
          const text = await error.textContent();
          if (text && text.trim()) {
            validation.validationTests.errorMessages.messages.push(text.trim());
          }
        }

        if (errorMessages.length > 0 || toastMessages.length > 0) {
          validation.validationTests.errorMessages.status = '✅ Working';
          validation.validationTests.errorMessages.details = `Found ${errorMessages.length + toastMessages.length} validation messages`;
          validation.validationTests.formSubmission.status = '✅ Blocked';
          validation.validationTests.formSubmission.details = 'Empty form submission properly prevented';
        } else {
          validation.validationTests.errorMessages.status = '❌ Missing';
          validation.validationTests.errorMessages.details = 'No validation messages shown';
          validation.validationTests.formSubmission.status = '⚠️ Unclear';
          validation.validationTests.formSubmission.details = 'Form behavior unclear - no validation messages';
          validation.issues.push('No validation error messages displayed for empty form');
        }
      }

      // Test 3: Data Type Validation
      console.log('3. Testing data type validation...');
      const inputs = await form.locator('input, textarea, select').all();

      validation.validationTests.dataTypes.validations = [];

      for (const input of inputs.slice(0, 5)) { // Test first 5 inputs
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name') || await input.getAttribute('id') || 'field';
        const isDisabled = await input.isDisabled();

        if (type === 'number') {
          validation.validationTests.dataTypes.validations.push(`${name}: number type`);
          // Try entering text in number field (only if not disabled)
          if (!isDisabled) {
            try {
              await input.fill('invalid text');
              await page.waitForTimeout(500);
              const value = await input.inputValue();
              if (value === '' || value === '0') {
                validation.validationTests.dataTypes.validations.push(`${name}: rejects non-numeric input`);
              }
            } catch (e) {
              // Skip if input cannot be filled
            }
          }
        } else if (type === 'email') {
          validation.validationTests.dataTypes.validations.push(`${name}: email type`);
        } else if (type === 'tel') {
          validation.validationTests.dataTypes.validations.push(`${name}: telephone type`);
        } else if (type === 'url') {
          validation.validationTests.dataTypes.validations.push(`${name}: URL type`);
        }
      }

      if (validation.validationTests.dataTypes.validations.length > 0) {
        validation.validationTests.dataTypes.status = '✅ Found';
        validation.validationTests.dataTypes.details = `Found ${validation.validationTests.dataTypes.validations.length} type validations`;
      } else {
        validation.validationTests.dataTypes.status = '⚠️ Limited';
        validation.validationTests.dataTypes.details = 'No specific type validations detected';
        validation.recommendations.push('Consider adding type attributes (number, email, etc.) to inputs');
      }

      // Test 4: Input Constraints
      console.log('4. Testing input constraints...');
      validation.validationTests.inputConstraints.constraints = [];

      for (const input of inputs.slice(0, 5)) {
        const name = await input.getAttribute('name') || await input.getAttribute('id') || 'field';
        const minLength = await input.getAttribute('minlength');
        const maxLength = await input.getAttribute('maxlength');
        const min = await input.getAttribute('min');
        const max = await input.getAttribute('max');
        const pattern = await input.getAttribute('pattern');

        if (minLength) validation.validationTests.inputConstraints.constraints.push(`${name}: minlength=${minLength}`);
        if (maxLength) validation.validationTests.inputConstraints.constraints.push(`${name}: maxlength=${maxLength}`);
        if (min) validation.validationTests.inputConstraints.constraints.push(`${name}: min=${min}`);
        if (max) validation.validationTests.inputConstraints.constraints.push(`${name}: max=${max}`);
        if (pattern) validation.validationTests.inputConstraints.constraints.push(`${name}: pattern validation`);
      }

      if (validation.validationTests.inputConstraints.constraints.length > 0) {
        validation.validationTests.inputConstraints.status = '✅ Found';
        validation.validationTests.inputConstraints.details = `Found ${validation.validationTests.inputConstraints.constraints.length} constraints`;
      } else {
        validation.validationTests.inputConstraints.status = '⚠️ Limited';
        validation.validationTests.inputConstraints.details = 'No input constraints detected';
        validation.recommendations.push('Add min/max/pattern constraints for better validation');
      }

      // Take screenshot of validation form
      const validationScreenshot = `screenshots/validation-${moduleName}-form.png`;
      await page.screenshot({ path: validationScreenshot, fullPage: true });
      validation.screenshots.push(validationScreenshot);

      // Close modal/form
      const closeButton = page.getByRole('button', { name: /close|cancel|×/i }).first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    } else {
      validation.validationTests.requiredFields.status = '❌ No Form';
      validation.validationTests.requiredFields.details = 'Create form not found';
      validation.issues.push('Unable to access create form for validation testing');
    }
  } else {
    validation.validationTests.requiredFields.status = '❌ No Create Button';
    validation.validationTests.requiredFields.details = 'No create/add button found';
    validation.issues.push('Create functionality not available for testing');
  }

  return validation;
}

test.describe('Configuration Module Validation Testing', () => {
  test('Test all validation for all configuration modules', async ({ page }) => {
    await login(page);

    const allValidations: ValidationResult[] = [];

    // Test each module
    for (const module of modules) {
      const validation = await testModuleValidation(page, module);
      allValidations.push(validation);
    }

    // Generate validation report
    const report = generateValidationReport(allValidations);

    // Write report to file
    const reportPath = 'docs/configuration-validation-tests.md';
    fs.writeFileSync(reportPath, report);
    console.log(`\nReport written to: ${reportPath}`);

    // Summary
    console.log('\n=== VALIDATION TEST SUMMARY ===\n');
    console.log(`Total Modules Tested: ${allValidations.length}`);

    const modulesWithValidation = allValidations.filter(v =>
      v.validationTests.requiredFields.status.includes('✅') ||
      v.validationTests.errorMessages.status.includes('✅')
    ).length;

    console.log(`Modules with Validation: ${modulesWithValidation}/${allValidations.length}`);

    const totalIssues = allValidations.reduce((sum, v) => sum + v.issues.length, 0);
    console.log(`Total Issues Found: ${totalIssues}`);

    const totalRecommendations = allValidations.reduce((sum, v) => sum + v.recommendations.length, 0);
    console.log(`Total Recommendations: ${totalRecommendations}`);

    console.log('\nReport generated:', reportPath);
  });
});

function generateValidationReport(validations: ValidationResult[]): string {
  const totalModules = validations.length;
  const totalIssues = validations.reduce((sum, v) => sum + v.issues.length, 0);
  const totalRecommendations = validations.reduce((sum, v) => sum + v.recommendations.length, 0);

  let report = `# Configuration Module Validation Testing Report

> **Test Date**: ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
> **Modules Tested**: ${totalModules}
> **Total Issues**: ${totalIssues}
> **Total Recommendations**: ${totalRecommendations}

---

## Executive Summary

This report documents comprehensive validation testing across all ${totalModules} Configuration modules.
Each module was tested for form validation including required fields, data types, input constraints, error messages, and form submission behavior.

### Validation Tests Performed

1. ✅ Required Fields Detection
2. ✅ Data Type Validation
3. ✅ Input Constraints (min/max/pattern)
4. ✅ Error Message Display
5. ✅ Form Submission Validation

---

## Validation Status Matrix

| Module | Required Fields | Data Types | Constraints | Error Messages | Form Submission |
|--------|----------------|------------|-------------|----------------|-----------------|
`;

  validations.forEach(v => {
    const statusIcon = (status: string) => {
      if (status.includes('✅')) return '✅';
      if (status.includes('❌')) return '❌';
      return '⚠️';
    };

    report += `| ${v.module} | ${statusIcon(v.validationTests.requiredFields.status)} | ${statusIcon(v.validationTests.dataTypes.status)} | ${statusIcon(v.validationTests.inputConstraints.status)} | ${statusIcon(v.validationTests.errorMessages.status)} | ${statusIcon(v.validationTests.formSubmission.status)} |\n`;
  });

  report += `\n---\n\n## Detailed Module Reports\n\n`;

  validations.forEach(v => {
    report += `
### ${v.module}

**Path**: \`${v.path}\`

#### Validation Test Results

##### 1. Required Fields
- **Status**: ${v.validationTests.requiredFields.status}
- **Details**: ${v.validationTests.requiredFields.details}
${v.validationTests.requiredFields.fields.length > 0 ? `- **Fields**: ${v.validationTests.requiredFields.fields.join(', ')}\n` : ''}

##### 2. Data Type Validation
- **Status**: ${v.validationTests.dataTypes.status}
- **Details**: ${v.validationTests.dataTypes.details}
${v.validationTests.dataTypes.validations.length > 0 ? `- **Validations**:\n${v.validationTests.dataTypes.validations.map(val => `  - ${val}`).join('\n')}\n` : ''}

##### 3. Input Constraints
- **Status**: ${v.validationTests.inputConstraints.status}
- **Details**: ${v.validationTests.inputConstraints.details}
${v.validationTests.inputConstraints.constraints.length > 0 ? `- **Constraints**:\n${v.validationTests.inputConstraints.constraints.map(c => `  - ${c}`).join('\n')}\n` : ''}

##### 4. Error Messages
- **Status**: ${v.validationTests.errorMessages.status}
- **Details**: ${v.validationTests.errorMessages.details}
${v.validationTests.errorMessages.messages.length > 0 ? `- **Messages Found**:\n${v.validationTests.errorMessages.messages.map(m => `  - "${m}"`).join('\n')}\n` : ''}

##### 5. Form Submission
- **Status**: ${v.validationTests.formSubmission.status}
- **Details**: ${v.validationTests.formSubmission.details}

${v.issues.length > 0 ? `
#### Issues Found
${v.issues.map(issue => `- ❌ ${issue}`).join('\n')}
` : ''}

${v.recommendations.length > 0 ? `
#### Recommendations
${v.recommendations.map(rec => `- 💡 ${rec}`).join('\n')}
` : ''}

${v.screenshots.length > 0 ? `
#### Screenshots
${v.screenshots.map(screenshot => `- \`${screenshot}\``).join('\n')}
` : ''}

---
`;
  });

  report += `
## Summary Statistics

### Validation Coverage

| Validation Type | Modules Implemented | Coverage |
|-----------------|-------------------|----------|
`;

  const countStatus = (field: keyof ValidationResult['validationTests']) => {
    return validations.filter(v => v.validationTests[field].status.includes('✅')).length;
  };

  const coverage = (count: number) => `${((count / totalModules) * 100).toFixed(1)}%`;

  report += `| Required Fields | ${countStatus('requiredFields')} / ${totalModules} | ${coverage(countStatus('requiredFields'))} |\n`;
  report += `| Data Types | ${countStatus('dataTypes')} / ${totalModules} | ${coverage(countStatus('dataTypes'))} |\n`;
  report += `| Input Constraints | ${countStatus('inputConstraints')} / ${totalModules} | ${coverage(countStatus('inputConstraints'))} |\n`;
  report += `| Error Messages | ${countStatus('errorMessages')} / ${totalModules} | ${coverage(countStatus('errorMessages'))} |\n`;
  report += `| Form Submission | ${countStatus('formSubmission')} / ${totalModules} | ${coverage(countStatus('formSubmission'))} |\n`;

  report += `\n### Overall Issues\n\n`;

  const allIssues = validations.flatMap(v => v.issues);
  const uniqueIssues = [...new Set(allIssues)];

  if (uniqueIssues.length > 0) {
    uniqueIssues.forEach(issue => {
      const count = allIssues.filter(i => i === issue).length;
      report += `- ${issue} (${count} module${count > 1 ? 's' : ''})\n`;
    });
  } else {
    report += `No critical validation issues found.\n`;
  }

  report += `\n### Overall Recommendations\n\n`;

  const allRecommendations = validations.flatMap(v => v.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)];

  if (uniqueRecommendations.length > 0) {
    uniqueRecommendations.forEach(rec => {
      const count = allRecommendations.filter(r => r === rec).length;
      report += `- ${rec} (${count} module${count > 1 ? 's' : ''})\n`;
    });
  } else {
    report += `All modules have optimal validation implementation.\n`;
  }

  report += `\n---

**Report Generated**: ${new Date().toLocaleString()}
**Test Suite**: configuration-validation.spec.ts
**Test Framework**: Playwright
`;

  return report;
}
