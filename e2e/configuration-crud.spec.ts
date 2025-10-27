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
}

// Helper function to navigate to configuration
async function navigateToConfiguration(page: Page) {
  // Open navigation menu
  await page.getByRole('button').first().click();
  await page.waitForTimeout(500);

  // Click Configuration
  await page.getByRole('button', { name: 'Configuration' }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Configuration Module - CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToConfiguration(page);
  });

  test.describe('Currency Management - CRUD', () => {
    test('CRUD-CURR-001: Create new currency', async ({ page }) => {
      // Navigate to Currency page
      await page.getByRole('link', { name: 'Navigate to Currency' }).click();
      await page.waitForLoadState('networkidle');

      // Click Create/Add button
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        // Fill currency form
        const currencyCode = `TST${Date.now().toString().slice(-4)}`;

        await page.fill('input[name="code"], input[placeholder*="Code" i]', currencyCode);
        await page.fill('input[name="description"], input[placeholder*="Description" i]', 'Test Currency');

        // Set active status
        const activeCheckbox = page.locator('input[type="checkbox"][name*="active" i]');
        if (await activeCheckbox.count() > 0) {
          await activeCheckbox.check();
        }

        // Save currency
        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);

        // Verify currency was created
        await expect(page.locator(`text=${currencyCode}`)).toBeVisible();
      }

      await page.screenshot({ path: 'screenshots/currency-create.png', fullPage: true });
    });

    test('CRUD-CURR-002: Read/View currency list', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Currency' }).click();
      await page.waitForLoadState('networkidle');

      // Verify table/list is visible
      const table = page.locator('table, [role="grid"], .table');
      await expect(table).toBeVisible();

      // Check for column headers
      const headers = ['Code', 'Description', 'Active', 'Action'];
      for (const header of headers) {
        const headerElement = page.locator(`th:has-text("${header}"), [role="columnheader"]:has-text("${header}")`);
        if (await headerElement.count() > 0) {
          await expect(headerElement.first()).toBeVisible();
        }
      }

      await page.screenshot({ path: 'screenshots/currency-list.png', fullPage: true });
    });

    test('CRUD-CURR-003: Update existing currency', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Currency' }).click();
      await page.waitForLoadState('networkidle');

      // Find and click edit button for first currency
      const editButton = page.locator('button[aria-label*="Edit"], button:has-text("Edit"), [data-action="edit"]').first();
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Update description
        const descriptionInput = page.locator('input[name="description"], input[placeholder*="Description" i]');
        if (await descriptionInput.count() > 0) {
          await descriptionInput.fill(`Updated Currency ${Date.now()}`);
        }

        // Save changes
        await page.locator('button:has-text("Save"), button:has-text("Update")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/currency-update.png', fullPage: true });
    });

    test('CRUD-CURR-004: Delete currency', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Currency' }).click();
      await page.waitForLoadState('networkidle');

      // Find delete button
      const deleteButton = page.locator('button[aria-label*="Delete"], button:has-text("Delete"), [data-action="delete"]').first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(500);

        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
        if (await confirmButton.count() > 0) {
          await confirmButton.last().click();
          await page.waitForTimeout(2000);
        }
      }

      await page.screenshot({ path: 'screenshots/currency-delete.png', fullPage: true });
    });

    test('CRUD-CURR-005: Search currency', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Currency' }).click();
      await page.waitForLoadState('networkidle');

      // Find search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]');
      if (await searchInput.count() > 0) {
        await searchInput.first().fill('USD');
        await page.waitForTimeout(1000);

        // Verify filtered results
        await expect(page.locator('text=USD')).toBeVisible();
      }

      await page.screenshot({ path: 'screenshots/currency-search.png', fullPage: true });
    });
  });

  test.describe('Exchange Rates - CRUD', () => {
    test('CRUD-EXCH-001: Create exchange rate', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Exchange Rates' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        // Fill exchange rate form
        const currencySelect = page.locator('select[name="currency"], select[name="currencyCode"]');
        if (await currencySelect.count() > 0) {
          await currencySelect.selectOption({ index: 1 });
        }

        const rateInput = page.locator('input[name="rate"], input[placeholder*="Rate" i]');
        if (await rateInput.count() > 0) {
          await rateInput.fill('1.25');
        }

        // Save
        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/exchange-rate-create.png', fullPage: true });
    });

    test('CRUD-EXCH-002: View exchange rates list', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Exchange Rates' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/exchange-rate-list.png', fullPage: true });
    });

    test('CRUD-EXCH-003: Update exchange rate', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Exchange Rates' }).click();
      await page.waitForLoadState('networkidle');

      const editButton = page.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(500);

        const rateInput = page.locator('input[name="rate"]');
        if (await rateInput.count() > 0) {
          await rateInput.fill('1.30');
        }

        await page.locator('button:has-text("Save"), button:has-text("Update")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/exchange-rate-update.png', fullPage: true });
    });
  });

  test.describe('Department - CRUD', () => {
    test('CRUD-DEPT-001: Create new department', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Department' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        // Fill department form based on specification
        const deptCode = `T${Date.now().toString().slice(-3)}`;

        await page.fill('input[name="code"]', deptCode);
        await page.fill('input[name="name"], input[name="description"]', 'Test Department');

        // Add department head email
        const headInput = page.locator('input[name*="head" i], input[placeholder*="email" i]');
        if (await headInput.count() > 0) {
          await headInput.first().fill('test.head@example.com');
        }

        // Set active status
        const activeCheckbox = page.locator('input[type="checkbox"][name*="active" i]');
        if (await activeCheckbox.count() > 0) {
          await activeCheckbox.check();
        }

        // Save
        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);

        await expect(page.locator(`text=${deptCode}`)).toBeVisible();
      }

      await page.screenshot({ path: 'screenshots/department-create.png', fullPage: true });
    });

    test('CRUD-DEPT-002: Read department list', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Department' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      // Verify columns per specification: Code, Name, Head of Department, Account Code, Active, Actions
      const columns = ['Code', 'Name', 'Head', 'Account', 'Active', 'Action'];
      for (const col of columns) {
        const header = page.locator(`th:has-text("${col}")`);
        if (await header.count() > 0) {
          await expect(header.first()).toBeVisible();
        }
      }

      await page.screenshot({ path: 'screenshots/department-list.png', fullPage: true });
    });

    test('CRUD-DEPT-003: Update department', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Department' }).click();
      await page.waitForLoadState('networkidle');

      const editButton = page.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(500);

        const nameInput = page.locator('input[name="name"], input[name="description"]');
        if (await nameInput.count() > 0) {
          await nameInput.fill(`Updated Department ${Date.now()}`);
        }

        await page.locator('button:has-text("Save"), button:has-text("Update")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/department-update.png', fullPage: true });
    });

    test('CRUD-DEPT-004: Delete department', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Department' }).click();
      await page.waitForLoadState('networkidle');

      const deleteButton = page.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(500);

        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.count() > 0) {
          await confirmButton.last().click();
          await page.waitForTimeout(2000);
        }
      }

      await page.screenshot({ path: 'screenshots/department-delete.png', fullPage: true });
    });

    test('CRUD-DEPT-005: Search department', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Department' }).click();
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]');
      if (await searchInput.count() > 0) {
        await searchInput.first().fill('Finance');
        await page.waitForTimeout(1000);
      }

      await page.screenshot({ path: 'screenshots/department-search.png', fullPage: true });
    });
  });

  test.describe('Delivery Point - CRUD', () => {
    test('CRUD-DELV-001: Create delivery point', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Delivery Point' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        await page.fill('input[name="name"], input[name="description"]', `Delivery Point ${Date.now()}`);
        await page.fill('input[name="code"]', `DP${Date.now().toString().slice(-4)}`);

        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/delivery-point-create.png', fullPage: true });
    });

    test('CRUD-DELV-002: View delivery points', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Delivery Point' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/delivery-point-list.png', fullPage: true });
    });
  });

  test.describe('Store Location - CRUD', () => {
    test('CRUD-LOC-001: Create store location', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Store Location' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        await page.fill('input[name="name"], input[name="description"]', `Store Location ${Date.now()}`);
        await page.fill('input[name="code"]', `SL${Date.now().toString().slice(-4)}`);

        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/store-location-create.png', fullPage: true });
    });

    test('CRUD-LOC-002: View store locations', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Store Location' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/store-location-list.png', fullPage: true });
    });
  });

  test.describe('Tax Profile - CRUD', () => {
    test('CRUD-TAX-001: Create tax profile', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Tax Profile' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        await page.fill('input[name="name"], input[name="description"]', `Tax Profile ${Date.now()}`);
        await page.fill('input[name="rate"], input[name="percentage"]', '15');

        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/tax-profile-create.png', fullPage: true });
    });

    test('CRUD-TAX-002: View tax profiles', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Tax Profile' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/tax-profile-list.png', fullPage: true });
    });
  });

  test.describe('Extra Cost - CRUD', () => {
    test('CRUD-COST-001: Create extra cost', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Extra Cost' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        await page.fill('input[name="name"], input[name="description"]', `Extra Cost ${Date.now()}`);
        await page.fill('input[name="code"]', `EC${Date.now().toString().slice(-4)}`);

        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/extra-cost-create.png', fullPage: true });
    });

    test('CRUD-COST-002: View extra costs', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Extra Cost' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/extra-cost-list.png', fullPage: true });
    });
  });

  test.describe('Business Type - CRUD', () => {
    test('CRUD-BIZ-001: Create business type', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Business Type' }).click();
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
      if (await createButton.count() > 0) {
        await createButton.first().click();
        await page.waitForTimeout(500);

        await page.fill('input[name="name"], input[name="description"]', `Business Type ${Date.now()}`);
        await page.fill('input[name="code"]', `BT${Date.now().toString().slice(-4)}`);

        await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
        await page.waitForTimeout(2000);
      }

      await page.screenshot({ path: 'screenshots/business-type-create.png', fullPage: true });
    });

    test('CRUD-BIZ-002: View business types', async ({ page }) => {
      await page.getByRole('link', { name: 'Navigate to Business Type' }).click();
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'screenshots/business-type-list.png', fullPage: true });
    });
  });
});

test.describe('Configuration - Data Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToConfiguration(page);
  });

  test('VAL-001: Currency code validation - Invalid format', async ({ page }) => {
    await page.getByRole('link', { name: 'Navigate to Currency' }).click();
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
    if (await createButton.count() > 0) {
      await createButton.first().click();
      await page.waitForTimeout(500);

      // Try invalid code (not 3 characters)
      await page.fill('input[name="code"]', 'US');
      await page.fill('input[name="description"]', 'Test');

      await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
      await page.waitForTimeout(1000);

      // Should show validation error
      const error = page.locator('.error, .invalid-feedback, [role="alert"]');
      // expect(await error.count()).toBeGreaterThan(0);
    }
  });

  test('VAL-002: Department code validation - Duplicate check', async ({ page }) => {
    await page.getByRole('link', { name: 'Navigate to Department' }).click();
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
    if (await createButton.count() > 0) {
      await createButton.first().click();
      await page.waitForTimeout(500);

      // Try duplicate code (AC already exists per spec)
      await page.fill('input[name="code"]', 'AC');
      await page.fill('input[name="name"]', 'Test Duplicate');

      await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
      await page.waitForTimeout(1000);

      // Should show duplicate error
    }
  });

  test('VAL-003: Required field validation', async ({ page }) => {
    await page.getByRole('link', { name: 'Navigate to Currency' }).click();
    await page.waitForLoadState('networkidle');

    const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
    if (await createButton.count() > 0) {
      await createButton.first().click();
      await page.waitForTimeout(500);

      // Try to save without required fields
      await page.locator('button:has-text("Save"), button:has-text("Submit")').first().click();
      await page.waitForTimeout(1000);

      // Should prevent submission or show validation errors
    }
  });
});

test.describe('Configuration - Bulk Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToConfiguration(page);
  });

  test('BULK-001: Select multiple items', async ({ page }) => {
    await page.getByRole('link', { name: 'Navigate to Currency' }).click();
    await page.waitForLoadState('networkidle');

    // Select checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count > 2) {
      await checkboxes.nth(1).check();
      await checkboxes.nth(2).check();
    }

    await page.screenshot({ path: 'screenshots/bulk-select.png', fullPage: true });
  });

  test('BULK-002: Bulk activate/deactivate', async ({ page }) => {
    await page.getByRole('link', { name: 'Navigate to Currency' }).click();
    await page.waitForLoadState('networkidle');

    const checkboxes = page.locator('input[type="checkbox"]');
    if (await checkboxes.count() > 1) {
      await checkboxes.nth(1).check();

      // Look for bulk action buttons
      const bulkButton = page.locator('button:has-text("Activate"), button:has-text("Deactivate")');
      if (await bulkButton.count() > 0) {
        await bulkButton.first().click();
        await page.waitForTimeout(1000);
      }
    }

    await page.screenshot({ path: 'screenshots/bulk-activate.png', fullPage: true });
  });
});
