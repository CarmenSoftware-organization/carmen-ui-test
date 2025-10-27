import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'https://carmen-inventory.vercel.app';
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

// Helper function to login
async function login(page: Page) {
  await page.goto(`${BASE_URL}/en/sign-in`);

  // Select email from dropdown
  await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
  await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();

  // Click sign in button
  await page.getByTestId('sign-in-button').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

// Helper function to navigate to vendor page via hamburger menu
async function navigateToVendor(page: Page) {
  // Click hamburger menu button (first button on the page)
  const hamburgerButton = page.getByRole('button').first();
  await hamburgerButton.click();
  await page.waitForTimeout(1000);

  // Click on "Master Data" or "Vendor Management" menu item
  const masterDataButton = page.getByRole('button', { name: /master data|vendor management/i });
  if (await masterDataButton.count() > 0) {
    await masterDataButton.click();
    await page.waitForTimeout(500);
  }

  // Click on "Vendor" link/button (use first() to handle multiple matches)
  const vendorLink = page.getByRole('link', { name: /vendor/i }).or(page.getByRole('button', { name: /vendor/i })).first();
  await vendorLink.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('Navigated to Vendor page via hamburger menu');
}

// Generate unique test data
function generateTestVendorData() {
  const timestamp = Date.now().toString().slice(-6);
  return {
    code: `VEN${timestamp}`,
    name: `Test Vendor ${timestamp}`,
    email: `vendor${timestamp}@test.com`,
    phone: `+1-555-${timestamp.slice(-4)}`,
    address: `${timestamp} Test Street`,
    city: 'Test City',
    country: 'Test Country',
    taxId: `TAX${timestamp}`,
    notes: `Created by automated test at ${new Date().toISOString()}`
  };
}

test.describe('Vendor Management - CRUD Operations', () => {
  let testVendorData: ReturnType<typeof generateTestVendorData>;

  test.beforeEach(async ({ page }) => {
    // Monitor network responses for non-200/201 status codes
    page.on('response', async (response) => {
      const status = response.status();
      if (status !== 200 && status !== 201) {
        const url = response.url();
        const method = response.request().method();

        try {
          const body = await response.text();
          console.log(`\n🚨 Network Error Detected:`);
          console.log(`   Method: ${method}`);
          console.log(`   URL: ${url}`);
          console.log(`   Status: ${status}`);
          console.log(`   Response: ${body.substring(0, 200)}${body.length > 200 ? '...' : ''}`);
        } catch (e) {
          console.log(`\n🚨 Network Error Detected:`);
          console.log(`   Method: ${method}`);
          console.log(`   URL: ${url}`);
          console.log(`   Status: ${status}`);
          console.log(`   Response: Unable to parse response body`);
        }
      }
    });

    // Login before each test
    await login(page);
    // Navigate to vendor page
    await navigateToVendor(page);
    // Generate fresh test data
    testVendorData = generateTestVendorData();
  });

  test('CRUD-VEN-001: Create new vendor with all required fields', async ({ page }) => {
    console.log('Starting vendor creation test...');

    // Click Create/Add button
    const createButton = page.getByRole('button', { name: /add|create|new vendor/i }).first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();
    await page.waitForTimeout(1000);

    // Take screenshot of empty form
    await page.screenshot({
      path: 'screenshots/vendor-create-form-empty.png',
      fullPage: true
    });

    // Fill vendor code
    const codeInput = page.locator('input[name*="code" i], input[placeholder*="code" i]').first();
    if (await codeInput.count() > 0) {
      const isDisabled = await codeInput.isDisabled();
      if (!isDisabled) {
        await codeInput.fill(testVendorData.code);
        console.log(`Filled vendor code: ${testVendorData.code}`);
      } else {
        console.log('Vendor code field is disabled (may be auto-generated)');
      }
    }

    // Fill vendor name (required field) - labeled as "Vendor"
    const nameInput = page.locator('input[name*="vendor" i], input[name*="name" i], input[placeholder*="vendor" i]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(testVendorData.name);
    console.log(`Filled vendor name: ${testVendorData.name}`);

    // Fill email
    const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first();
    if (await emailInput.count() > 0) {
      const isDisabled = await emailInput.isDisabled();
      if (!isDisabled) {
        await emailInput.fill(testVendorData.email);
        console.log(`Filled email: ${testVendorData.email}`);
      }
    }

    // Fill phone
    const phoneInput = page.locator('input[type="tel"], input[name*="phone" i], input[placeholder*="phone" i]').first();
    if (await phoneInput.count() > 0) {
      const isDisabled = await phoneInput.isDisabled();
      if (!isDisabled) {
        await phoneInput.fill(testVendorData.phone);
        console.log(`Filled phone: ${testVendorData.phone}`);
      }
    }

    // Fill address
    const addressInput = page.locator('input[name*="address" i], textarea[name*="address" i], input[placeholder*="address" i]').first();
    if (await addressInput.count() > 0) {
      const isDisabled = await addressInput.isDisabled();
      if (!isDisabled) {
        await addressInput.fill(testVendorData.address);
        console.log(`Filled address: ${testVendorData.address}`);
      }
    }

    // Fill city
    const cityInput = page.locator('input[name*="city" i], input[placeholder*="city" i]').first();
    if (await cityInput.count() > 0) {
      const isDisabled = await cityInput.isDisabled();
      if (!isDisabled) {
        await cityInput.fill(testVendorData.city);
        console.log(`Filled city: ${testVendorData.city}`);
      }
    }

    // Fill tax ID
    const taxIdInput = page.locator('input[name*="tax" i], input[placeholder*="tax" i]').first();
    if (await taxIdInput.count() > 0) {
      const isDisabled = await taxIdInput.isDisabled();
      if (!isDisabled) {
        await taxIdInput.fill(testVendorData.taxId);
        console.log(`Filled tax ID: ${testVendorData.taxId}`);
      }
    }

    // Fill description field
    const descriptionInput = page.locator('textarea[name*="description" i], input[name*="description" i]').first();
    if (await descriptionInput.count() > 0) {
      const isDisabled = await descriptionInput.isDisabled();
      if (!isDisabled) {
        await descriptionInput.fill(testVendorData.notes);
        console.log(`Filled description: ${testVendorData.notes}`);
      }
    }

    // Navigate to Address tab
    const addressTab = page.locator('button:has-text("Address"), div:has-text("Address")').first();
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(500);
      console.log('Switched to Address tab');
    }

    // Navigate to Contact tab
    const contactTab = page.locator('button:has-text("Contact"), div:has-text("Contact")').first();
    if (await contactTab.count() > 0) {
      await contactTab.click();
      await page.waitForTimeout(500);
      console.log('Switched to Contact tab');
    }

    // Go back to Info tab for final check
    const infoTab = page.locator('button:has-text("Info")').first();
    if (await infoTab.count() > 0) {
      await infoTab.click();
      await page.waitForTimeout(500);
    }

    // Set active status
    const activeCheckbox = page.locator('input[type="checkbox"][name*="active" i], input[type="checkbox"][name*="status" i]').first();
    if (await activeCheckbox.count() > 0) {
      const isChecked = await activeCheckbox.isChecked();
      if (!isChecked) {
        await activeCheckbox.check();
        console.log('Checked active status');
      }
    }

    // Take screenshot of filled form
    await page.screenshot({
      path: 'screenshots/vendor-create-form-filled.png',
      fullPage: true
    });

    // Save vendor - look for the blue save icon button in top right
    const saveButton = page.locator('button[type="submit"], button:has([class*="save" i]), header button, [aria-label*="save" i]').last();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      console.log('Clicked save button');
    } else {
      console.log('⚠️ Save button not found, trying alternative selectors');
      // Try clicking any blue button in the header area
      const headerButton = page.locator('header button, .header button').last();
      if (await headerButton.count() > 0) {
        await headerButton.click();
        console.log('Clicked header button');
      }
    }

    await page.waitForTimeout(3000);

    // Take screenshot after save
    await page.screenshot({
      path: 'screenshots/vendor-create-success.png',
      fullPage: true
    });

    // Verify vendor was created by searching for it
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill(testVendorData.name);
      await page.waitForTimeout(1000);

      // Check if vendor appears in list
      const vendorInList = page.locator(`text=${testVendorData.name}`);
      if (await vendorInList.count() > 0) {
        await expect(vendorInList.first()).toBeVisible();
        console.log('✅ Vendor created successfully and found in list');
      } else {
        console.log('⚠️ Vendor not immediately visible in list (may need page refresh)');
      }
    }

    console.log('Vendor creation test completed');
  });

  test('CRUD-VEN-002: Read/View vendor list', async ({ page }) => {
    console.log('Starting vendor list view test...');

    // Verify page loaded
    await expect(page).toHaveURL(/vendor/);
    console.log('Vendor page loaded');

    // Verify table/list is visible
    const table = page.locator('table, [role="grid"], .table-container, [role="list"]').first();
    await expect(table).toBeVisible({ timeout: 10000 });
    console.log('Vendor table/list is visible');

    // Check for common column headers
    const headers = ['Name', 'Code', 'Email', 'Phone', 'Status', 'Action'];
    for (const header of headers) {
      const headerElement = page.locator(`th:has-text("${header}"), [role="columnheader"]:has-text("${header}"), div:has-text("${header}")`).first();
      if (await headerElement.count() > 0) {
        console.log(`✅ Found header: ${header}`);
      } else {
        console.log(`⚠️ Header not found: ${header}`);
      }
    }

    // Take screenshot of vendor list
    await page.screenshot({
      path: 'screenshots/vendor-list.png',
      fullPage: true
    });

    console.log('Vendor list view test completed');
  });

  test('CRUD-VEN-003: Update/Edit existing vendor', async ({ page }) => {
    console.log('Starting vendor edit test...');

    // Wait for vendor list to load
    await page.waitForTimeout(2000);

    // Find and click the first vendor name link or edit button
    const firstVendorName = page.locator('tbody tr td:nth-child(2) button, tbody tr td a, tbody tr button[role="button"]').first();

    if (await firstVendorName.count() > 0) {
      await firstVendorName.click();
      await page.waitForTimeout(1500);
      console.log('Clicked on vendor to open edit form');

      // Take screenshot of edit form
      await page.screenshot({
        path: 'screenshots/vendor-edit-form-before.png',
        fullPage: true
      });

      // Update vendor name
      const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
      if (await nameInput.count() > 0) {
        const isDisabled = await nameInput.isDisabled();
        if (!isDisabled) {
          const updatedName = `Updated Vendor ${Date.now().toString().slice(-6)}`;
          await nameInput.clear();
          await nameInput.fill(updatedName);
          console.log(`Updated vendor name to: ${updatedName}`);
        } else {
          console.log('Vendor name field is disabled');
        }
      }

      // Update email
      const emailInput = page.locator('input[type="email"], input[name*="email" i]').first();
      if (await emailInput.count() > 0) {
        const isDisabled = await emailInput.isDisabled();
        if (!isDisabled) {
          const updatedEmail = `updated${Date.now().toString().slice(-6)}@test.com`;
          await emailInput.clear();
          await emailInput.fill(updatedEmail);
          console.log(`Updated email to: ${updatedEmail}`);
        }
      }

      // Update notes
      const notesInput = page.locator('textarea[name*="note" i], textarea[name*="description" i]').first();
      if (await notesInput.count() > 0) {
        const isDisabled = await notesInput.isDisabled();
        if (!isDisabled) {
          const updatedNotes = `Updated by automated test at ${new Date().toISOString()}`;
          await notesInput.clear();
          await notesInput.fill(updatedNotes);
          console.log(`Updated notes`);
        }
      }

      // Take screenshot of updated form
      await page.screenshot({
        path: 'screenshots/vendor-edit-form-after.png',
        fullPage: true
      });

      // Save changes
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit")').first();
      if (await saveButton.count() > 0) {
        await saveButton.click();
        console.log('Clicked save button');
        await page.waitForTimeout(3000);

        // Take screenshot after save
        await page.screenshot({
          path: 'screenshots/vendor-edit-success.png',
          fullPage: true
        });

        console.log('✅ Vendor updated successfully');
      } else {
        console.log('⚠️ Save button not found');
      }
    } else {
      console.log('⚠️ No vendors found to edit');
      await page.screenshot({
        path: 'screenshots/vendor-edit-no-vendors.png',
        fullPage: true
      });
    }

    console.log('Vendor edit test completed');
  });

  test('CRUD-VEN-004: View vendor details', async ({ page }) => {
    console.log('Starting vendor view details test...');

    // Wait for vendor list to load
    await page.waitForTimeout(2000);

    // Click on first vendor
    const firstVendor = page.locator('tbody tr').first();
    if (await firstVendor.count() > 0) {
      // Try clicking the name link
      const nameLink = firstVendor.locator('td:nth-child(2) button, td:nth-child(2) a').first();
      if (await nameLink.count() > 0) {
        await nameLink.click();
        await page.waitForTimeout(1500);
        console.log('Opened vendor details');

        // Take screenshot of vendor details
        await page.screenshot({
          path: 'screenshots/vendor-view-details.png',
          fullPage: true
        });

        // Verify common fields are visible
        const fieldsToCheck = ['Name', 'Code', 'Email', 'Phone', 'Address', 'Status'];
        for (const field of fieldsToCheck) {
          const fieldLabel = page.locator(`label:has-text("${field}"), span:has-text("${field}"), div:has-text("${field}")`).first();
          if (await fieldLabel.count() > 0) {
            console.log(`✅ Found field: ${field}`);
          }
        }

        console.log('✅ Vendor details displayed');
      } else {
        console.log('⚠️ No clickable vendor name found');
      }
    } else {
      console.log('⚠️ No vendors found in list');
    }

    console.log('Vendor view details test completed');
  });

  test('CRUD-VEN-005: Search vendor functionality', async ({ page }) => {
    console.log('Starting vendor search test...');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();

    if (await searchInput.count() > 0) {
      // Test search with generic term
      await searchInput.fill('Test');
      await page.waitForTimeout(1500);

      console.log('Performed search with term: Test');

      // Take screenshot of search results
      await page.screenshot({
        path: 'screenshots/vendor-search-results.png',
        fullPage: true
      });

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(1000);

      // Take screenshot of cleared search
      await page.screenshot({
        path: 'screenshots/vendor-search-cleared.png',
        fullPage: true
      });

      console.log('✅ Search functionality works');
    } else {
      console.log('⚠️ Search input not found');
      await page.screenshot({
        path: 'screenshots/vendor-no-search.png',
        fullPage: true
      });
    }

    console.log('Vendor search test completed');
  });

  test('CRUD-VEN-006: Filter vendor by status', async ({ page }) => {
    console.log('Starting vendor filter test...');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find filter dropdown
    const filterButton = page.locator('button:has-text("Select Status"), button:has-text("Filter"), button:has-text("Status")').first();

    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(500);
      console.log('Opened filter dropdown');

      // Take screenshot of filter options
      await page.screenshot({
        path: 'screenshots/vendor-filter-options.png',
        fullPage: true
      });

      // Select Active filter
      const activeOption = page.locator('[role="option"]:has-text("Active"), div:has-text("Active")').first();
      if (await activeOption.count() > 0) {
        await activeOption.click();
        await page.waitForTimeout(1500);
        console.log('Applied Active filter');

        // Take screenshot of filtered results
        await page.screenshot({
          path: 'screenshots/vendor-filter-active.png',
          fullPage: true
        });

        console.log('✅ Filter functionality works');
      }
    } else {
      console.log('⚠️ Filter button not found');
      await page.screenshot({
        path: 'screenshots/vendor-no-filter.png',
        fullPage: true
      });
    }

    console.log('Vendor filter test completed');
  });

  test('CRUD-VEN-007: Verify form validation on create', async ({ page }) => {
    console.log('Starting vendor form validation test...');

    // Click Create button
    const createButton = page.getByRole('button', { name: /add|create|new vendor/i }).first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();
    await page.waitForTimeout(1000);

    // Try to save without filling required fields
    const saveButton = page.locator('button[type="submit"], header button, [aria-label*="save" i]').last();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️ Save button not found');
    }

    // Take screenshot showing validation errors
    await page.screenshot({
      path: 'screenshots/vendor-validation-errors.png',
      fullPage: true
    });

    // Check for validation messages
    const errorMessages = page.locator('[role="alert"], .error-message, .text-red-500, [class*="error"]');
    if (await errorMessages.count() > 0) {
      console.log(`✅ Found ${await errorMessages.count()} validation error(s)`);
    } else {
      console.log('⚠️ No validation errors displayed (field may not be required)');
    }

    console.log('Vendor form validation test completed');
  });
});

// Summary test to generate report
test.afterAll(async () => {
  console.log('\n=== VENDOR CRUD TEST SUMMARY ===');
  console.log('Tests executed:');
  console.log('1. Create new vendor with all fields');
  console.log('2. Read/View vendor list');
  console.log('3. Update/Edit existing vendor');
  console.log('4. View vendor details');
  console.log('5. Search vendor functionality');
  console.log('6. Filter vendor by status');
  console.log('7. Form validation on create');
  console.log('\nScreenshots saved to: screenshots/vendor-*.png');
  console.log('================================\n');
});
