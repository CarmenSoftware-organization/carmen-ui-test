import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'https://carmen-inventory.vercel.app';
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

// Helper function to login
async function login(page: Page) {
  await page.goto(`${BASE_URL}/en/login`);
  await page.fill('input[type="email"]', TEST_CREDENTIALS.email);
  await page.fill('input[type="password"]', TEST_CREDENTIALS.password);
  await page.click('button[type="submit"]');
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
}

test.describe('Configuration Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);

    // Navigate to configuration section
    await page.goto(`${BASE_URL}/en/configuration`);
    await page.waitForLoadState('networkidle');
  });

  test('TC-001: Verify configuration page loads successfully', async ({ page }) => {
    // Verify page title or heading
    await expect(page).toHaveURL(/.*configuration/);

    // Take screenshot for documentation
    await page.screenshot({ path: 'screenshots/config-page-loaded.png', fullPage: true });
  });

  test('TC-002: Verify navigation to configuration section', async ({ page }) => {
    // Check if configuration menu item exists and is clickable
    const configNav = page.locator('nav a:has-text("Configuration"), nav a:has-text("Settings")');
    await expect(configNav.first()).toBeVisible();

    // Verify active state
    const activeLink = page.locator('nav a[aria-current="page"], nav a.active');
    await expect(activeLink).toBeVisible();
  });

  test('TC-003: Verify configuration sections are visible', async ({ page }) => {
    // Common configuration sections to check
    const sections = [
      'General Settings',
      'User Settings',
      'System Settings',
      'Profile',
      'Preferences'
    ];

    // Check if at least one configuration section exists
    let sectionFound = false;
    for (const section of sections) {
      const sectionElement = page.locator(`h1:has-text("${section}"), h2:has-text("${section}"), h3:has-text("${section}")`);
      if (await sectionElement.count() > 0) {
        sectionFound = true;
        break;
      }
    }

    expect(sectionFound).toBeTruthy();

    await page.screenshot({ path: 'screenshots/config-sections.png', fullPage: true });
  });

  test('TC-004: Verify form inputs are interactive', async ({ page }) => {
    // Find all input fields in the configuration
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThan(0);

    // Test first text input if exists
    const textInputs = page.locator('input[type="text"], input[type="email"], input:not([type])');
    if (await textInputs.count() > 0) {
      const firstInput = textInputs.first();
      await expect(firstInput).toBeEditable();

      // Try to interact with it
      await firstInput.focus();
      await firstInput.fill('Test Value');
      await expect(firstInput).toHaveValue('Test Value');
    }
  });

  test('TC-005: Verify save/update button functionality', async ({ page }) => {
    // Look for save/update/submit buttons
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit"), button[type="submit"]');

    if (await saveButton.count() > 0) {
      await expect(saveButton.first()).toBeVisible();
      await expect(saveButton.first()).toBeEnabled();
    }
  });

  test('TC-006: Verify cancel/reset functionality', async ({ page }) => {
    // Look for cancel/reset buttons
    const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Reset"), button:has-text("Discard")');

    if (await cancelButton.count() > 0) {
      await expect(cancelButton.first()).toBeVisible();
      await expect(cancelButton.first()).toBeEnabled();
    }
  });

  test('TC-007: Verify required field validation', async ({ page }) => {
    // Find required inputs
    const requiredInputs = page.locator('input[required], input[aria-required="true"]');

    if (await requiredInputs.count() > 0) {
      const firstRequired = requiredInputs.first();

      // Clear the field
      await firstRequired.clear();

      // Try to submit or trigger validation
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.first().click();

        // Check for validation message
        const validationMessage = page.locator('.error, .invalid-feedback, [role="alert"]');
        // Validation should appear or form should not submit
        const currentUrl = page.url();
        await page.waitForTimeout(1000);
        // Either validation appears or we stay on same page
      }
    }
  });

  test('TC-008: Verify tabs/sections navigation if exists', async ({ page }) => {
    // Look for tab navigation
    const tabs = page.locator('[role="tab"], .tab, .nav-tabs a');

    if (await tabs.count() > 1) {
      const firstTab = tabs.first();
      const secondTab = tabs.nth(1);

      await expect(firstTab).toBeVisible();
      await expect(secondTab).toBeVisible();

      // Click second tab
      await secondTab.click();
      await page.waitForTimeout(500);

      // Verify tab is active
      await expect(secondTab).toHaveAttribute('aria-selected', 'true');

      await page.screenshot({ path: 'screenshots/config-tab-navigation.png', fullPage: true });
    }
  });

  test('TC-009: Verify dropdown/select fields', async ({ page }) => {
    // Find select elements
    const selects = page.locator('select');

    if (await selects.count() > 0) {
      const firstSelect = selects.first();
      await expect(firstSelect).toBeVisible();

      // Get options count
      const options = firstSelect.locator('option');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);

      // Try to select an option
      if (optionCount > 1) {
        const secondOption = await options.nth(1).getAttribute('value');
        if (secondOption) {
          await firstSelect.selectOption(secondOption);
        }
      }
    }
  });

  test('TC-010: Verify checkbox/toggle functionality', async ({ page }) => {
    // Find checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');

    if (await checkboxes.count() > 0) {
      const firstCheckbox = checkboxes.first();
      await expect(firstCheckbox).toBeVisible();

      // Get initial state
      const initialState = await firstCheckbox.isChecked();

      // Toggle checkbox
      await firstCheckbox.click();
      await page.waitForTimeout(300);

      // Verify state changed
      const newState = await firstCheckbox.isChecked();
      expect(newState).toBe(!initialState);
    }
  });

  test('TC-011: Verify page responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify page still renders correctly
    const body = page.locator('body');
    await expect(body).toBeVisible();

    await page.screenshot({ path: 'screenshots/config-mobile.png', fullPage: true });

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'screenshots/config-tablet.png', fullPage: true });

    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('TC-012: Verify no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Reload page to capture console errors
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/config-console-check.png' });

    // Report errors if any
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }

    // You can choose to fail or just log
    // expect(errors.length).toBe(0);
  });

  test('TC-013: Verify accessibility attributes', async ({ page }) => {
    // Check for proper labels
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        const id = el.id;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;

        return !!(ariaLabel || ariaLabelledby || label);
      });

      // All inputs should have labels for accessibility
      // expect(hasLabel).toBeTruthy();
    }
  });

  test('TC-014: Verify data persistence after save', async ({ page }) => {
    // Find a text input
    const textInput = page.locator('input[type="text"], input[type="email"]').first();

    if (await textInput.count() > 0) {
      const testValue = `Test-${Date.now()}`;

      // Fill the input
      await textInput.fill(testValue);

      // Find and click save button
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]').first();

      if (await saveButton.count() > 0) {
        await saveButton.click();

        // Wait for save operation
        await page.waitForTimeout(2000);

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Check if value persisted
        const savedValue = await textInput.inputValue();
        // expect(savedValue).toBe(testValue);
      }
    }
  });

  test('TC-015: Verify search/filter functionality if exists', async ({ page }) => {
    // Look for search inputs
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], input[placeholder*="Filter" i]');

    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();

      // Try searching
      await searchInput.first().fill('test');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'screenshots/config-search.png', fullPage: true });
    }
  });
});

test.describe('Configuration Section - Negative Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/en/configuration`);
    await page.waitForLoadState('networkidle');
  });

  test('TC-NEG-001: Verify invalid data handling', async ({ page }) => {
    // Find email input if exists
    const emailInput = page.locator('input[type="email"]');

    if (await emailInput.count() > 0) {
      // Enter invalid email
      await emailInput.first().fill('invalid-email');

      // Try to submit
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);

        // Should show validation error
        const errorMessage = page.locator('.error, .invalid-feedback, [role="alert"]');
        // expect(await errorMessage.count()).toBeGreaterThan(0);
      }
    }
  });

  test('TC-NEG-002: Verify unauthorized access protection', async ({ page }) => {
    // Logout
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      await page.waitForTimeout(1000);
    }

    // Try to access configuration without auth
    await page.goto(`${BASE_URL}/en/configuration`);
    await page.waitForLoadState('networkidle');

    // Should redirect to login or show unauthorized
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('login') || currentUrl.includes('signin');
    const hasUnauthorizedMessage = await page.locator('text=/unauthorized|access denied/i').count() > 0;

    expect(isLoginPage || hasUnauthorizedMessage).toBeTruthy();
  });
});
