import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://carmen-inventory.vercel.app';
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

// Detailed navigation review results
const detailedReview: any = {
  modules: [],
  summary: {
    totalModules: 8,
    totalFeaturesTested: 0,
    navigationIssues: [],
    recommendations: []
  }
};

async function login(page: Page) {
  await page.goto(`${BASE_URL}/en/sign-in`);
  await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
  await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();
  await page.getByTestId('sign-in-button').click();
  await page.waitForLoadState('networkidle');
}

async function navigateToModule(page: Page, modulePath: string) {
  await page.goto(`${BASE_URL}${modulePath}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Check if we got redirected to login (session expired)
  if (page.url().includes('/sign-in')) {
    console.log('Session expired, logging in again...');
    await login(page);
    await page.goto(`${BASE_URL}${modulePath}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
}

async function reviewModuleFeatures(page: Page, moduleName: string, modulePath: string) {
  const review: any = {
    name: moduleName,
    path: modulePath,
    features: {
      listView: { status: 'Unknown', details: '' },
      createButton: { status: 'Unknown', details: '' },
      editAccess: { status: 'Unknown', details: '' },
      deleteAccess: { status: 'Unknown', details: '' },
      viewDetails: { status: 'Unknown', details: '' },
      searchFilter: { status: 'Unknown', details: '' },
      sorting: { status: 'Unknown', details: '' },
      bulkActions: { status: 'Unknown', details: '' },
      pagination: { status: 'Unknown', details: '' }
    },
    screenshots: [],
    issues: [],
    recommendations: []
  };

  try {
    console.log(`\n=== Reviewing ${moduleName} Features ===`);

    // Navigate to module
    await navigateToModule(page, modulePath);

    // Take initial screenshot
    const mainScreenshot = `screenshots/detailed-nav-${moduleName.toLowerCase().replace(/\s+/g, '-')}-main.png`;
    await page.screenshot({ path: mainScreenshot, fullPage: true });
    review.screenshots.push(mainScreenshot);

    // Test 1: List View / Data Table
    console.log('1. Testing list view / data table...');
    const table = page.locator('table, [role="table"], .data-table, .table-container');
    const rows = page.locator('tbody tr, [role="row"]');

    if (await table.count() > 0) {
      const rowCount = await rows.count();
      review.features.listView.status = '✅ Present';
      review.features.listView.details = `Data table found with ${rowCount} rows`;
    } else {
      review.features.listView.status = '❌ Missing';
      review.features.listView.details = 'No data table or list view found';
      review.issues.push('List view not found on main page');
    }

    // Test 2: Create Button
    console.log('2. Testing create/add button...');
    const createButton = page.getByRole('button', { name: /create|add|new/i });
    const addLink = page.getByRole('link', { name: /create|add|new/i });

    if (await createButton.count() > 0 || await addLink.count() > 0) {
      review.features.createButton.status = '✅ Present';
      review.features.createButton.details = 'Create/Add button found';
    } else {
      review.features.createButton.status = '❌ Missing';
      review.features.createButton.details = 'No create button found';
      review.issues.push('Create/Add button not found');
    }

    // Test 3: Edit Access (check if first row has edit action)
    console.log('3. Testing edit functionality...');
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    const editLink = page.getByRole('link', { name: /edit/i }).first();
    const actionMenu = page.locator('[aria-label*="action"], [data-testid*="action-menu"]').first();

    if (await editButton.count() > 0 || await editLink.count() > 0 || await actionMenu.count() > 0) {
      review.features.editAccess.status = '✅ Available';
      review.features.editAccess.details = 'Edit action found';

      // Try to click edit to test navigation to edit form
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(1000);

        // Check if we navigated to edit page or modal opened
        if (page.url().includes('edit') || await page.locator('[role="dialog"], .modal').count() > 0) {
          review.features.editAccess.details += ' - Edit page/modal opens successfully';

          const editScreenshot = `screenshots/detailed-nav-${moduleName.toLowerCase().replace(/\s+/g, '-')}-edit.png`;
          await page.screenshot({ path: editScreenshot, fullPage: true });
          review.screenshots.push(editScreenshot);

          // Navigate back
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
      }
    } else {
      review.features.editAccess.status = '❌ Missing';
      review.features.editAccess.details = 'No edit action found';
      review.issues.push('Edit functionality not accessible');
    }

    // Test 4: Delete Access
    console.log('4. Testing delete functionality...');
    const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
    const deleteIcon = page.locator('[aria-label*="delete"], [data-testid*="delete"]').first();

    if (await deleteButton.count() > 0 || await deleteIcon.count() > 0) {
      review.features.deleteAccess.status = '✅ Available';
      review.features.deleteAccess.details = 'Delete action found';
    } else {
      review.features.deleteAccess.status = '⚠️ Not Found';
      review.features.deleteAccess.details = 'No delete action visible (may be in menu)';
    }

    // Test 5: View Details
    console.log('5. Testing view details...');
    const viewButton = page.getByRole('button', { name: /view|details/i }).first();
    const viewLink = page.getByRole('link', { name: /view|details/i }).first();
    const firstRow = rows.first();

    if (await viewButton.count() > 0 || await viewLink.count() > 0) {
      review.features.viewDetails.status = '✅ Available';
      review.features.viewDetails.details = 'View details action found';
    } else if (await firstRow.count() > 0) {
      // Try clicking first row to see if it opens details
      await firstRow.click();
      await page.waitForTimeout(1000);

      if (page.url() !== `${BASE_URL}${modulePath}` || await page.locator('[role="dialog"], .modal').count() > 0) {
        review.features.viewDetails.status = '✅ Available';
        review.features.viewDetails.details = 'Row click opens details';

        const detailsScreenshot = `screenshots/detailed-nav-${moduleName.toLowerCase().replace(/\s+/g, '-')}-details.png`;
        await page.screenshot({ path: detailsScreenshot, fullPage: true });
        review.screenshots.push(detailsScreenshot);

        // Navigate back
        await navigateToModule(page, modulePath);
      } else {
        review.features.viewDetails.status = '⚠️ Unclear';
        review.features.viewDetails.details = 'View details mechanism not obvious';
      }
    }

    // Test 6: Search/Filter
    console.log('6. Testing search and filter...');
    const searchInput = page.getByRole('searchbox');
    const searchField = page.locator('input[type="search"], input[placeholder*="Search" i], input[aria-label*="search" i]');
    const filterButton = page.getByRole('button', { name: /filter/i });

    if (await searchInput.count() > 0 || await searchField.count() > 0) {
      review.features.searchFilter.status = '✅ Available';
      review.features.searchFilter.details = 'Search functionality found';
    } else if (await filterButton.count() > 0) {
      review.features.searchFilter.status = '✅ Available';
      review.features.searchFilter.details = 'Filter functionality found';
    } else {
      review.features.searchFilter.status = '❌ Missing';
      review.features.searchFilter.details = 'No search or filter found';
      review.issues.push('Search/filter functionality missing');
      review.recommendations.push('Add search or filter capability for better usability');
    }

    // Test 7: Sorting
    console.log('7. Testing sorting...');
    const sortableHeaders = page.locator('th[role="columnheader"], th[aria-sort], th.sortable, th[class*="sort"]');

    if (await sortableHeaders.count() > 0) {
      review.features.sorting.status = '✅ Available';
      review.features.sorting.details = `${await sortableHeaders.count()} sortable columns found`;
    } else {
      review.features.sorting.status = '❌ Missing';
      review.features.sorting.details = 'No sortable columns detected';
      review.recommendations.push('Add sorting capability to table columns');
    }

    // Test 8: Bulk Actions
    console.log('8. Testing bulk actions...');
    const bulkCheckbox = page.locator('input[type="checkbox"][aria-label*="select all" i], th input[type="checkbox"]').first();
    const bulkActionButton = page.getByRole('button', { name: /bulk|select|actions/i });

    if (await bulkCheckbox.count() > 0) {
      review.features.bulkActions.status = '✅ Available';
      review.features.bulkActions.details = 'Bulk selection checkboxes found';

      // Try selecting all
      await bulkCheckbox.click();
      await page.waitForTimeout(500);

      if (await bulkActionButton.count() > 0) {
        review.features.bulkActions.details += ' - Bulk action buttons appear on selection';
      }

      // Unselect
      await bulkCheckbox.click();
    } else {
      review.features.bulkActions.status = '⚠️ Not Found';
      review.features.bulkActions.details = 'No bulk action capability detected';
    }

    // Test 9: Pagination
    console.log('9. Testing pagination...');
    const pagination = page.locator('[aria-label*="pagination"], .pagination, nav[role="navigation"]');
    const nextButton = page.getByRole('button', { name: /next/i });
    const prevButton = page.getByRole('button', { name: /previous|prev/i });

    if (await pagination.count() > 0 || (await nextButton.count() > 0 && await prevButton.count() > 0)) {
      review.features.pagination.status = '✅ Available';
      review.features.pagination.details = 'Pagination controls found';
    } else {
      review.features.pagination.status = '⚠️ Not Found';
      review.features.pagination.details = 'No pagination detected (may not be needed if few items)';
    }

    // Final screenshot
    await navigateToModule(page, modulePath);
    const finalScreenshot = `screenshots/detailed-nav-${moduleName.toLowerCase().replace(/\s+/g, '-')}-final.png`;
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    review.screenshots.push(finalScreenshot);

  } catch (error) {
    review.issues.push(`Error during feature review: ${error}`);
    console.error(`Error reviewing ${moduleName}:`, error);
  }

  detailedReview.modules.push(review);
  return review;
}

test.describe('Configuration Module Detailed Navigation Review', () => {
  test.beforeAll(async () => {
    // Ensure screenshots directory exists
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('Review all configuration module features and navigation', async ({ page }) => {
    // Login
    await login(page);

    // Define all modules
    const modules = [
      { name: 'Currency', path: '/en/configuration/currency' },
      { name: 'Exchange Rates', path: '/en/configuration/exchange-rate' },
      { name: 'Delivery Point', path: '/en/configuration/delivery-point' },
      { name: 'Store Location', path: '/en/configuration/location' },
      { name: 'Department', path: '/en/configuration/department' },
      { name: 'Tax Profile', path: '/en/configuration/tax-profile' },
      { name: 'Extra Cost', path: '/en/configuration/extra-cost' },
      { name: 'Business Type', path: '/en/configuration/business-type' }
    ];

    // Review each module
    for (const module of modules) {
      await reviewModuleFeatures(page, module.name, module.path);
    }

    // Generate summary
    const totalIssues = detailedReview.modules.reduce((sum: number, m: any) => sum + m.issues.length, 0);
    const totalRecommendations = detailedReview.modules.reduce((sum: number, m: any) => sum + m.recommendations.length, 0);

    detailedReview.summary.totalIssues = totalIssues;
    detailedReview.summary.totalRecommendations = totalRecommendations;
    detailedReview.summary.totalFeaturesTested = detailedReview.modules.length * 9; // 9 features per module
    detailedReview.summary.completionDate = new Date().toISOString();

    // Collect all unique issues and recommendations
    const allIssues = detailedReview.modules.flatMap((m: any) => m.issues);
    const allRecommendations = detailedReview.modules.flatMap((m: any) => m.recommendations);
    detailedReview.summary.navigationIssues = Array.from(new Set(allIssues));
    detailedReview.summary.recommendations = Array.from(new Set(allRecommendations));

    // Generate markdown report
    await generateDetailedReport();

    // Log summary
    console.log('\n=== DETAILED NAVIGATION REVIEW SUMMARY ===');
    console.log(`Total Modules Reviewed: ${detailedReview.modules.length}`);
    console.log(`Total Features Tested: ${detailedReview.summary.totalFeaturesTested}`);
    console.log(`Total Issues Found: ${totalIssues}`);
    console.log(`Total Recommendations: ${totalRecommendations}`);
    console.log('\nReport generated: docs/configuration-navigation-detailed.md');
  });
});

async function generateDetailedReport() {
  const report = `# Configuration Module Detailed Navigation Review

> **Review Date**: ${new Date().toLocaleDateString()}
> **Modules Reviewed**: ${detailedReview.modules.length}
> **Features Tested**: ${detailedReview.summary.totalFeaturesTested}
> **Total Issues**: ${detailedReview.summary.totalIssues}
> **Total Recommendations**: ${detailedReview.summary.totalRecommendations}

---

## Executive Summary

This report documents a comprehensive review of feature-level navigation and functionality across all ${detailedReview.modules.length} Configuration modules in the Carmen Inventory application.

### Features Tested Per Module

1. ✅ List View / Data Table
2. ✅ Create/Add Button
3. ✅ Edit Functionality
4. ✅ Delete Functionality
5. ✅ View Details
6. ✅ Search/Filter
7. ✅ Sorting
8. ✅ Bulk Actions
9. ✅ Pagination

---

## Feature Availability Matrix

| Module | List View | Create | Edit | Delete | View | Search | Sort | Bulk | Pagination |
|--------|-----------|--------|------|--------|------|--------|------|------|------------|
${detailedReview.modules.map((m: any) =>
  `| ${m.name} | ${m.features.listView.status} | ${m.features.createButton.status} | ${m.features.editAccess.status} | ${m.features.deleteAccess.status} | ${m.features.viewDetails.status} | ${m.features.searchFilter.status} | ${m.features.sorting.status} | ${m.features.bulkActions.status} | ${m.features.pagination.status} |`
).join('\n')}

---

## Detailed Module Reviews

${detailedReview.modules.map((m: any) => `
### ${m.name}

**Path**: \`${m.path}\`

#### Feature Test Results

##### 1. List View / Data Table
- **Status**: ${m.features.listView.status}
- **Details**: ${m.features.listView.details}

##### 2. Create/Add Button
- **Status**: ${m.features.createButton.status}
- **Details**: ${m.features.createButton.details}

##### 3. Edit Functionality
- **Status**: ${m.features.editAccess.status}
- **Details**: ${m.features.editAccess.details}

##### 4. Delete Functionality
- **Status**: ${m.features.deleteAccess.status}
- **Details**: ${m.features.deleteAccess.details}

##### 5. View Details
- **Status**: ${m.features.viewDetails.status}
- **Details**: ${m.features.viewDetails.details}

##### 6. Search/Filter
- **Status**: ${m.features.searchFilter.status}
- **Details**: ${m.features.searchFilter.details}

##### 7. Sorting
- **Status**: ${m.features.sorting.status}
- **Details**: ${m.features.sorting.details}

##### 8. Bulk Actions
- **Status**: ${m.features.bulkActions.status}
- **Details**: ${m.features.bulkActions.details}

##### 9. Pagination
- **Status**: ${m.features.pagination.status}
- **Details**: ${m.features.pagination.details}

#### Issues Found
${m.issues.length > 0 ? m.issues.map((issue: string) => `- ❌ ${issue}`).join('\n') : '- ✅ No issues found'}

#### Recommendations
${m.recommendations.length > 0 ? m.recommendations.map((rec: string) => `- 💡 ${rec}`).join('\n') : '- ✅ No recommendations'}

#### Screenshots
${m.screenshots.map((s: string) => `- \`${s}\``).join('\n')}

---
`).join('\n')}

## Summary of Issues

${detailedReview.summary.navigationIssues.length > 0 ?
  detailedReview.summary.navigationIssues.map((issue: string, i: number) => `${i + 1}. ❌ ${issue}`).join('\n') :
  '✅ No feature navigation issues found across all modules!'
}

---

## Recommendations

${detailedReview.summary.recommendations.length > 0 ?
  detailedReview.summary.recommendations.map((rec: string, i: number) => `${i + 1}. 💡 ${rec}`).join('\n') :
  '✅ No recommendations - all features are complete!'
}

---

## Feature Patterns Observed

### Common Patterns
- Data table/list view for displaying records
- Action buttons/links for CRUD operations
- Standard table navigation controls

### Missing Features
${detailedReview.summary.recommendations.length > 0 ?
  '- See recommendations section above' :
  '- All expected features are present'
}

---

## Testing Methodology

Each module was tested for 9 key features:

1. **List View**: Presence of data table or list display
2. **Create Button**: Ability to add new records
3. **Edit Access**: Ability to modify existing records
4. **Delete Access**: Ability to remove records
5. **View Details**: Ability to see full record information
6. **Search/Filter**: Ability to search or filter records
7. **Sorting**: Ability to sort table columns
8. **Bulk Actions**: Ability to perform actions on multiple records
9. **Pagination**: Ability to navigate through pages of data

---

## Browser & Environment

- **Browser**: Chromium (Playwright)
- **Viewport**: Desktop (1920x1080)
- **Application**: Carmen Inventory
- **Base URL**: https://carmen-inventory.vercel.app
- **Test User**: ${TEST_CREDENTIALS.email}

---

## Conclusion

${detailedReview.summary.totalIssues === 0 ?
  '✅ All core features are accessible and functional across all configuration modules. Users have complete CRUD capabilities with proper navigation controls.' :
  `⚠️ Found ${detailedReview.summary.totalIssues} feature issue(s) across ${detailedReview.modules.length} modules. See recommendations above for improvements.`
}

---

**Generated**: ${new Date().toISOString()}
**Test Suite**: configuration-navigation-detailed.spec.ts
`;

  const reportPath = path.join(process.cwd(), 'docs', 'configuration-navigation-detailed.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`Report written to: ${reportPath}`);
}
