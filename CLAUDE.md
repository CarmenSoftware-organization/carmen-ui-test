# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Playwright E2E testing suite** for the Carmen Inventory application (https://carmen-inventory.vercel.app). The project focuses on comprehensive automated testing of Configuration modules with navigation flows, form validation, and CRUD operations.

**Key Architecture Point**: This is NOT a local development project - tests run against a live external application. No local server is required for testing.

## Commands

### Running Tests

```bash
# Run ALL configuration tests with consolidated report (RECOMMENDED)
./run-all-tests.sh

# Run specific test suites
npx playwright test e2e/configuration-navigation-flows.spec.ts --config=playwright-nav-review.config.ts
npx playwright test e2e/configuration-validation.spec.ts --config=playwright-nav-review.config.ts
npx playwright test e2e/configuration-crud.spec.ts --config=playwright-nav-review.config.ts

# Run single test in headed mode (for debugging)
npx playwright test e2e/configuration-navigation-flows.spec.ts --config=playwright-nav-review.config.ts --headed

# Run with UI mode for interactive debugging
npx playwright test --ui
```

### Viewing Results

```bash
# View latest consolidated report
cat docs/configuration-navigation-flows.md
cat docs/configuration-validation-tests.md

# View comprehensive test summary
cat docs/TEST-RESULTS-SUMMARY.md

# Open Playwright HTML report
npx playwright show-report
```

### Development (if local Next.js dev is needed)

```bash
npm install           # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

## Test Architecture

### Critical Testing Constraints

1. **External Application Testing**: Tests run against `https://carmen-inventory.vercel.app` - no local server
2. **Authentication**: Uses test credentials defined in test files:
   ```typescript
   const TEST_CREDENTIALS = {
     email: 'newuser2@example.com',
     password: '12345678'
   };
   ```
3. **Configuration**: Uses `playwright-nav-review.config.ts` - configured for external testing
4. **Reports**: Auto-generated markdown files in `docs/` directory
5. **Screenshots**: Captured to `screenshots/` directory on test execution

### Test Suite Structure

**Three Main Test Types**:

1. **Navigation Flow Tests** (`configuration-navigation-flows.spec.ts`)
   - Tests 9 navigation flows × 8 modules = 72 tests
   - Generates: `docs/configuration-navigation-flows.md`
   - Tests: Main page, Create, Edit, View, Delete, Filter, Search, Sort, Bulk actions, Back navigation

2. **Validation Tests** (`configuration-validation.spec.ts`)
   - Tests 5 validation types × 8 modules = 40 tests
   - Generates: `docs/configuration-validation-tests.md`
   - Tests: Required fields, Data types, Input constraints, Error messages, Form submission
   - **IMPORTANT**: Uses `isDisabled()` check to skip disabled fields (prevents test timeouts)

3. **CRUD Tests** (`configuration-crud.spec.ts`)
   - Tests Create, Read, Update, Delete operations
   - Generates: `docs/configuration-crud-tests.md`

### Eight Configuration Modules Tested

1. Currency
2. Exchange Rates* (auto-update module - no manual CRUD)
3. Delivery Point
4. Store Location
5. Department
6. Tax Profile
7. Extra Cost
8. Business Type

**Exchange Rates Exception**: This module uses automatic API synchronization. It does NOT support manual create/edit/delete operations by design. Tests should mark these as "Not Applicable" rather than failures.

### Key Selector Patterns

**Working Selectors** (verified):

```typescript
// Delete action (three dots menu in Action column)
page.locator('tbody tr td:last-child button').first()

// Filter dropdown (Select Status)
page.locator('button:has-text("Select Status")').first()

// Sort button (up/down arrows)
page.locator('button[aria-label*="sort" i], button svg[class*="sort"]').first()

// Create/Add button
page.getByRole('button', { name: /add|create|new/i }).first()
```

**Common Pattern**: Navigation flows test the UI without executing destructive actions (delete is detected but not clicked).

### Test Helpers and Utilities

**Test Credentials**:
```typescript
const BASE_URL = 'https://carmen-inventory.vercel.app';
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};
```

**Login Helper** (in test files):
```typescript
async function login(page: Page) {
  await page.goto(`${BASE_URL}/en/sign-in`);
  await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
  await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();
  await page.getByTestId('sign-in-button').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}
```

**Report Generator**: `e2e/helpers/test-reporter.ts` - Creates consolidated markdown/JSON reports

## Documentation System

### Auto-Generated Reports (DO NOT EDIT MANUALLY)

- `docs/configuration-navigation-flows.md` - Navigation test results
- `docs/configuration-validation-tests.md` - Validation test results
- `docs/configuration-crud-tests.md` - CRUD test results
- `docs/consolidated-test-report.md` - Combined report (from `run-all-tests.sh`)
- `docs/consolidated-test-report.json` - JSON summary

### Static Guides (Edit as needed)

- `docs/README.md` - Documentation hub and index
- `docs/TESTING-README.md` - Quick start guide
- `docs/NAVIGATION-TESTING-README.md` - Complete testing guide
- `docs/TEST-CHECKLIST.md` - Step-by-step testing checklist
- `docs/VALIDATION-TESTING-GUIDE.md` - Validation testing guide
- `docs/VALIDATION-RECOMMENDATIONS.md` - Improvement roadmap
- `docs/CONSOLIDATED-REPORTING.md` - Reporting system guide
- `docs/TEST-RESULTS-SUMMARY.md` - Comprehensive results summary

**Documentation Update Rule**: When tests complete, auto-generated reports are overwritten. Always add special notes (like Exchange Rates auto-update) AFTER test runs using Edit operations.

## Common Workflows

### Adding a New Test Suite

1. Create test file in `e2e/` directory following naming pattern: `configuration-{name}.spec.ts`
2. Import and use standard login helper
3. Generate markdown report in `docs/` directory
4. Add to `run-all-tests.sh` if part of main suite
5. Update `docs/README.md` with new report reference

### Debugging Test Failures

1. Run test in headed mode: `--headed` flag
2. Check screenshot in `screenshots/` directory
3. Review error context in `test-results/` directory
4. Use `page.waitForTimeout(2000)` for timing issues
5. Check selector with Playwright Inspector: `npx playwright test --debug`

### Updating Selectors

**When tests show "Not Found" but feature exists**:

1. Take screenshot or inspect element in browser
2. Identify correct selector (class, role, text, data-testid)
3. Update selector in test file using Playwright locator methods
4. Test with single module first
5. Run full suite to verify

**Example Recent Fix**:
```typescript
// Delete was "Not Found" → Found by targeting last column button
const deleteButton = page.locator('tbody tr td:last-child button').first();
```

### Handling Exchange Rates Module

**Always apply this pattern after tests**:

```typescript
// In code: Mark Exchange Rates as auto-update module
if (moduleName === 'Exchange Rates') {
  flows.navigationTests.createNavigation.status = 'ℹ️ Not Applicable';
  flows.navigationTests.createNavigation.details = 'Module uses auto-update';
}
```

```markdown
# In docs: Add note after test overwrites
> **ℹ️ Note**: This module uses auto-update functionality...
```

## Current Test Results (as of 2025-10-22)

- **Navigation Coverage**: 92% (7/8 modules)
- **Delete Detection**: 87.5% (7/8 modules)
- **Filter Detection**: 75% (6/8 modules)
- **Sort Detection**: 75% (6/8 modules)
- **Validation Coverage**: 75% (6/8 modules)
- **Test Pass Rate**: 85%

## Known Issues and Gotchas

1. **Disabled Fields**: Always use `await input.isDisabled()` before `input.fill()` to prevent timeouts
2. **Exchange Rates**: No create/edit/delete - mark as N/A, not failed
3. **Test Overwrites**: Auto-generated reports overwrite custom notes - re-add after runs
4. **Timing**: Use `waitForLoadState('networkidle')` + `waitForTimeout(1000-2000)` for stability
5. **External URL**: Tests depend on external site availability - network issues cause failures
6. **Authentication**: Test credentials (`newuser2@example.com` / `12345678`) must remain valid in live application
7. **Credentials Location**: Always defined at top of test files as `TEST_CREDENTIALS` constant

## Playwright Configuration

- **Config File**: `playwright-nav-review.config.ts`
- **Timeout**: 180000ms (3 minutes) per test
- **Workers**: 1 (sequential execution)
- **Retries**: 0 (fail fast)
- **Browser**: Chromium only
- **Screenshots**: Only on failure
- **Video**: Retained on failure
- **Reports**: HTML reporter

## Technologies

- **Framework**: Playwright 1.48+ for E2E testing
- **Language**: TypeScript 5.6+
- **Reporting**: Custom markdown/JSON generators
- **Optional**: Next.js 15 (for local dev pages, not used in tests)
- **Styling**: Tailwind CSS (for local pages only)

## Important Notes for Future Claude Instances

1. **No Local Server Needed**: Don't try to start dev server for configuration tests
2. **Read Before Write**: Always read docs files before editing (Write tool requirement)
3. **Preserve Test Results**: Don't regenerate reports unnecessarily - they take 5+ minutes
4. **Exchange Rates Special Case**: This is NOT a bug - it's a feature. Always document it as auto-update
5. **Selector Updates**: When updating selectors, test one module first before running full suite
6. **Documentation Consistency**: Keep all 17 docs files in sync when updating test results
- the test cerdential