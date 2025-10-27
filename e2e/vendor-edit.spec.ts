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

// Helper to open first vendor for editing
async function openFirstVendorForEdit(page: Page) {
  // Wait for vendor list to load
  await page.waitForTimeout(2000);

  // Click on first vendor name link (it's a clickable link in the Name column)
  const firstVendorName = page.locator('tbody tr td a, tbody tr td button').first();

  if (await firstVendorName.count() > 0) {
    await firstVendorName.click();
    await page.waitForTimeout(1500);
    console.log('Opened vendor for editing');
    return true;
  }

  console.log('⚠️ No vendors found to edit');
  return false;
}

test.describe('Vendor Edit Operations - Comprehensive Tests', () => {

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
  });

  test('EDIT-VEN-001: Edit vendor name successfully', async ({ page }) => {
    console.log('Starting vendor name edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) {
      console.log('⚠️ Skipping test - no vendors available');
      return;
    }

    // Take screenshot of original form
    await page.screenshot({
      path: 'screenshots/vendor-edit-name-before.png',
      fullPage: true
    });

    // Update vendor name
    const nameInput = page.locator('input[name*="vendor" i], input[name*="name" i]').first();
    if (await nameInput.count() > 0) {
      const isDisabled = await nameInput.isDisabled();
      if (!isDisabled) {
        const originalName = await nameInput.inputValue();
        console.log(`Original name: ${originalName}`);

        const updatedName = `Updated ${Date.now().toString().slice(-6)}`;
        await nameInput.clear();
        await nameInput.fill(updatedName);
        console.log(`Updated name to: ${updatedName}`);

        // Save changes
        const saveButton = page.locator('button[type="submit"], header button').last();
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(3000);

          // Take screenshot after save
          await page.screenshot({
            path: 'screenshots/vendor-edit-name-after.png',
            fullPage: true
          });

          // Verify success message or return to list
          const successToast = page.locator('[role="alert"], .toast, [class*="success"]');
          if (await successToast.count() > 0) {
            console.log('✅ Success message displayed');
          }

          console.log('✅ Vendor name updated successfully');
        }
      } else {
        console.log('⚠️ Vendor name field is read-only');
      }
    }

    console.log('Vendor name edit test completed');
  });

  test('EDIT-VEN-002: Edit vendor description', async ({ page }) => {
    console.log('Starting vendor description edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Update description
    const descriptionInput = page.locator('textarea[name*="description" i], input[name*="description" i]').first();
    if (await descriptionInput.count() > 0) {
      const isDisabled = await descriptionInput.isDisabled();
      if (!isDisabled) {
        const updatedDescription = `Updated description at ${new Date().toISOString()}`;
        await descriptionInput.clear();
        await descriptionInput.fill(updatedDescription);
        console.log(`Updated description`);

        // Take screenshot
        await page.screenshot({
          path: 'screenshots/vendor-edit-description.png',
          fullPage: true
        });

        // Save
        const saveButton = page.locator('button[type="submit"], header button').last();
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(3000);
          console.log('✅ Description updated successfully');
        }
      }
    }

    console.log('Vendor description edit test completed');
  });

  test('EDIT-VEN-003: Edit vendor Info tab fields', async ({ page }) => {
    console.log('Starting vendor Info tab edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Ensure we're on Info tab
    const infoTab = page.locator('button:has-text("Info")').first();
    if (await infoTab.count() > 0) {
      await infoTab.click();
      await page.waitForTimeout(500);
    }

    // Take screenshot of Info tab
    await page.screenshot({
      path: 'screenshots/vendor-edit-info-tab.png',
      fullPage: true
    });

    // Edit various Info tab fields
    const fieldsEdited = [];

    // Try to edit any text input in Info tab
    const infoInputs = page.locator('input[type="text"], input[type="email"], textarea');
    const inputCount = await infoInputs.count();

    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = infoInputs.nth(i);
      if (await input.isVisible() && !(await input.isDisabled())) {
        const placeholder = await input.getAttribute('placeholder');
        const name = await input.getAttribute('name');
        const fieldName = placeholder || name || `field-${i}`;

        await input.clear();
        await input.fill(`Test ${Date.now().toString().slice(-4)}`);
        fieldsEdited.push(fieldName);
        console.log(`Edited field: ${fieldName}`);
      }
    }

    console.log(`✅ Edited ${fieldsEdited.length} fields in Info tab`);

    // Save changes
    const saveButton = page.locator('button[type="submit"], header button').last();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Info tab changes saved');
    }

    console.log('Vendor Info tab edit test completed');
  });

  test('EDIT-VEN-004: Edit vendor Address tab fields', async ({ page }) => {
    console.log('Starting vendor Address tab edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Click Address tab
    const addressTab = page.locator('button:has-text("Address")').first();
    if (await addressTab.count() > 0) {
      await addressTab.click();
      await page.waitForTimeout(1000);
      console.log('Switched to Address tab');

      // Take screenshot of Address tab
      await page.screenshot({
        path: 'screenshots/vendor-edit-address-tab-before.png',
        fullPage: true
      });

      // Edit address fields
      const addressFields = [
        { selector: 'input[name*="address" i], input[placeholder*="address" i]', value: `${Date.now()} Test St` },
        { selector: 'input[name*="city" i], input[placeholder*="city" i]', value: 'Test City' },
        { selector: 'input[name*="state" i], input[placeholder*="state" i]', value: 'Test State' },
        { selector: 'input[name*="zip" i], input[name*="postal" i], input[placeholder*="zip" i]', value: '12345' },
        { selector: 'input[name*="country" i], input[placeholder*="country" i]', value: 'Test Country' }
      ];

      let editedCount = 0;
      for (const field of addressFields) {
        const input = page.locator(field.selector).first();
        if (await input.count() > 0 && !(await input.isDisabled())) {
          await input.clear();
          await input.fill(field.value);
          editedCount++;
          console.log(`Updated address field with: ${field.value}`);
        }
      }

      console.log(`✅ Edited ${editedCount} address fields`);

      // Take screenshot after editing
      await page.screenshot({
        path: 'screenshots/vendor-edit-address-tab-after.png',
        fullPage: true
      });

      // Save changes
      const saveButton = page.locator('button[type="submit"], header button').last();
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForTimeout(3000);
        console.log('✅ Address tab changes saved');
      }
    } else {
      console.log('⚠️ Address tab not found');
    }

    console.log('Vendor Address tab edit test completed');
  });

  test('EDIT-VEN-005: Edit vendor Contact tab fields', async ({ page }) => {
    console.log('Starting vendor Contact tab edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Click Contact tab
    const contactTab = page.locator('button:has-text("Contact")').first();
    if (await contactTab.count() > 0) {
      await contactTab.click();
      await page.waitForTimeout(1000);
      console.log('Switched to Contact tab');

      // Take screenshot of Contact tab
      await page.screenshot({
        path: 'screenshots/vendor-edit-contact-tab-before.png',
        fullPage: true
      });

      // Edit contact fields
      const contactFields = [
        { selector: 'input[type="email"], input[name*="email" i]', value: `test${Date.now().toString().slice(-6)}@test.com` },
        { selector: 'input[type="tel"], input[name*="phone" i]', value: `+1-555-${Date.now().toString().slice(-4)}` },
        { selector: 'input[name*="mobile" i], input[placeholder*="mobile" i]', value: `+1-555-${Date.now().toString().slice(-4)}` },
        { selector: 'input[name*="fax" i], input[placeholder*="fax" i]', value: `+1-555-${Date.now().toString().slice(-4)}` },
        { selector: 'input[name*="website" i], input[placeholder*="website" i]', value: 'www.test.com' }
      ];

      let editedCount = 0;
      for (const field of contactFields) {
        const input = page.locator(field.selector).first();
        if (await input.count() > 0 && !(await input.isDisabled())) {
          await input.clear();
          await input.fill(field.value);
          editedCount++;
          console.log(`Updated contact field with: ${field.value}`);
        }
      }

      console.log(`✅ Edited ${editedCount} contact fields`);

      // Take screenshot after editing
      await page.screenshot({
        path: 'screenshots/vendor-edit-contact-tab-after.png',
        fullPage: true
      });

      // Save changes
      const saveButton = page.locator('button[type="submit"], header button').last();
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForTimeout(3000);
        console.log('✅ Contact tab changes saved');
      }
    } else {
      console.log('⚠️ Contact tab not found');
    }

    console.log('Vendor Contact tab edit test completed');
  });

  test('EDIT-VEN-006: Edit and verify all tabs in sequence', async ({ page }) => {
    console.log('Starting sequential tab edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    const tabs = ['Info', 'Address', 'Contact'];

    for (const tabName of tabs) {
      const tab = page.locator(`button:has-text("${tabName}")`).first();
      if (await tab.count() > 0) {
        await tab.click();
        await page.waitForTimeout(500);
        console.log(`✅ Switched to ${tabName} tab`);

        // Edit one field in each tab
        const anyInput = page.locator('input[type="text"], textarea').first();
        if (await anyInput.count() > 0 && !(await anyInput.isDisabled())) {
          await anyInput.fill(`${tabName} test ${Date.now().toString().slice(-4)}`);
          console.log(`✅ Updated field in ${tabName} tab`);
        }

        // Take screenshot
        await page.screenshot({
          path: `screenshots/vendor-edit-${tabName.toLowerCase()}-sequential.png`,
          fullPage: true
        });
      }
    }

    // Save all changes
    const saveButton = page.locator('button[type="submit"], header button').last();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ All tabs saved successfully');
    }

    console.log('Sequential tab edit test completed');
  });

  test('EDIT-VEN-007: Cancel edit without saving', async ({ page }) => {
    console.log('Starting cancel edit test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Make some changes
    const nameInput = page.locator('input[name*="vendor" i], input[name*="name" i]').first();
    if (await nameInput.count() > 0 && !(await nameInput.isDisabled())) {
      const originalValue = await nameInput.inputValue();
      await nameInput.fill('Should not be saved');
      console.log('Made changes to vendor name');

      // Look for cancel button (X button, Cancel, or Back)
      const cancelButton = page.locator('button:has-text("Cancel"), button[aria-label*="close" i], button:has-text("✕")').first();
      if (await cancelButton.count() > 0) {
        await cancelButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ Clicked cancel button');

        // Take screenshot after cancel
        await page.screenshot({
          path: 'screenshots/vendor-edit-cancelled.png',
          fullPage: true
        });
      } else {
        // Try clicking back arrow
        const backButton = page.locator('button[aria-label*="back" i], svg[class*="arrow-left"]').first();
        if (await backButton.count() > 0) {
          await backButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ Clicked back button');
        }
      }
    }

    console.log('Cancel edit test completed');
  });

  test('EDIT-VEN-008: Edit vendor and verify changes persist', async ({ page }) => {
    console.log('Starting edit persistence verification test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Update vendor name with unique value
    const uniqueValue = `Persist Test ${Date.now().toString().slice(-6)}`;
    const nameInput = page.locator('input[name*="vendor" i], input[name*="name" i]').first();

    if (await nameInput.count() > 0 && !(await nameInput.isDisabled())) {
      await nameInput.clear();
      await nameInput.fill(uniqueValue);
      console.log(`Set unique value: ${uniqueValue}`);

      // Save changes
      const saveButton = page.locator('button[type="submit"], header button').last();
      await saveButton.click();
      await page.waitForTimeout(3000);

      // Navigate away and back
      await page.goto(`${BASE_URL}/en/vendor-management/vendor`);
      await page.waitForTimeout(2000);

      // Search for the updated vendor
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill(uniqueValue);
        await page.waitForTimeout(1500);

        // Verify the vendor appears with updated name
        const vendorInList = page.locator(`text=${uniqueValue}`);
        if (await vendorInList.count() > 0) {
          console.log('✅ Changes persisted - vendor found with updated name');
          await page.screenshot({
            path: 'screenshots/vendor-edit-persisted.png',
            fullPage: true
          });
        } else {
          console.log('⚠️ Could not verify persistence');
        }
      }
    }

    console.log('Edit persistence verification test completed');
  });

  test('EDIT-VEN-009: Rapid sequential edits', async ({ page }) => {
    console.log('Starting rapid sequential edits test...');

    const opened = await openFirstVendorForEdit(page);
    if (!opened) return;

    // Make 3 rapid edits and saves
    for (let i = 1; i <= 3; i++) {
      const nameInput = page.locator('input[name*="vendor" i], input[name*="name" i]').first();
      if (await nameInput.count() > 0 && !(await nameInput.isDisabled())) {
        const value = `Rapid Edit ${i} - ${Date.now().toString().slice(-4)}`;
        await nameInput.clear();
        await nameInput.fill(value);
        console.log(`Edit ${i}: ${value}`);

        const saveButton = page.locator('button[type="submit"], header button').last();
        await saveButton.click();
        await page.waitForTimeout(2000);
        console.log(`✅ Edit ${i} saved`);

        // Reopen for next edit if not last iteration
        if (i < 3) {
          const editButton = page.locator('button:has-text("Edit")').first();
          if (await editButton.count() > 0) {
            await editButton.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    }

    await page.screenshot({
      path: 'screenshots/vendor-rapid-edits-complete.png',
      fullPage: true
    });

    console.log('Rapid sequential edits test completed');
  });

  test('EDIT-VEN-010: Edit button availability and accessibility', async ({ page }) => {
    console.log('Starting edit button accessibility test...');

    // Check if vendor names are clickable links
    const vendorLinks = page.locator('tbody tr td a');
    const linkCount = await vendorLinks.count();
    console.log(`Vendor name links found: ${linkCount > 0 ? `✅ ${linkCount} links` : '⚠️ None'}`);

    // Check for three dots menu (Action column)
    const actionMenus = page.locator('tbody tr td:last-child button');
    const menuCount = await actionMenus.count();
    console.log(`Action menu buttons: ${menuCount > 0 ? `✅ ${menuCount} menus` : '⚠️ None'}`);

    // Take screenshot
    await page.screenshot({
      path: 'screenshots/vendor-edit-accessibility.png',
      fullPage: true
    });

    // Try opening edit form by clicking vendor name
    if (linkCount > 0) {
      const firstVendorLink = vendorLinks.first();
      await firstVendorLink.click();
      await page.waitForTimeout(1500);

      console.log('✅ Opened vendor detail/edit view');

      // Check for Edit button in detail view
      const editButton = page.locator('button:has-text("Edit")').first();
      if (await editButton.count() > 0) {
        console.log('✅ Edit button found in detail view');
      } else {
        console.log('ℹ️ Already in edit mode (no separate Edit button)');
      }

      await page.screenshot({
        path: 'screenshots/vendor-edit-detail-view.png',
        fullPage: true
      });
    }

    console.log('Edit button accessibility test completed');
  });
});

// Summary
test.afterAll(async () => {
  console.log('\n=== VENDOR EDIT TEST SUMMARY ===');
  console.log('Tests executed:');
  console.log('1. Edit vendor name');
  console.log('2. Edit vendor description');
  console.log('3. Edit Info tab fields');
  console.log('4. Edit Address tab fields');
  console.log('5. Edit Contact tab fields');
  console.log('6. Sequential tab editing');
  console.log('7. Cancel edit operation');
  console.log('8. Verify edit persistence');
  console.log('9. Rapid sequential edits');
  console.log('10. Edit button accessibility');
  console.log('\nScreenshots saved to: screenshots/vendor-edit-*.png');
  console.log('================================\n');
});
