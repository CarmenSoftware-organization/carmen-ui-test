# Configuration Section - UI Test Documentation

## Overview
This document provides comprehensive test documentation for the Configuration section of the Carmen Inventory application. The tests are automated using Playwright and cover functional, UI, accessibility, and negative test scenarios.

---

## Test Environment

- **Application URL**: https://carmen-inventory.vercel.app
- **Test Framework**: Playwright
- **Language**: TypeScript
- **Test Location**: `/e2e/configuration.spec.ts`

### Test Credentials
```json
{
  "email": "newuser2@example.com",
  "password": "12345678"
}
```

---

## Test Execution

### Running Tests

```bash
# Run all configuration tests
npx playwright test e2e/configuration.spec.ts

# Run specific test
npx playwright test e2e/configuration.spec.ts -g "TC-001"

# Run in headed mode (see browser)
npx playwright test e2e/configuration.spec.ts --headed

# Run on specific browser
npx playwright test e2e/configuration.spec.ts --project=chromium

# Debug mode
npx playwright test e2e/configuration.spec.ts --debug

# Generate HTML report
npx playwright show-report
```

---

## Test Cases

### Functional Tests

#### TC-001: Verify Configuration Page Loads Successfully
**Objective**: Ensure the configuration page loads without errors

**Preconditions**:
- User is logged in
- User has access to configuration section

**Steps**:
1. Navigate to login page
2. Enter valid credentials
3. Navigate to `/en/configuration`
4. Wait for page to load completely

**Expected Results**:
- URL contains "configuration"
- Page loads without errors
- Page content is visible

**Screenshot**: `screenshots/config-page-loaded.png`

---

#### TC-002: Verify Navigation to Configuration Section
**Objective**: Validate navigation menu to configuration section

**Preconditions**:
- User is logged in

**Steps**:
1. Locate navigation menu
2. Find "Configuration" or "Settings" link
3. Verify link is visible and clickable
4. Check active state

**Expected Results**:
- Configuration menu item exists
- Link is visible and enabled
- Active state is indicated (aria-current or .active class)

---

#### TC-003: Verify Configuration Sections are Visible
**Objective**: Ensure all configuration sections render correctly

**Preconditions**:
- User is on configuration page

**Steps**:
1. Scan page for configuration sections
2. Check for common section headings:
   - General Settings
   - User Settings
   - System Settings
   - Profile
   - Preferences

**Expected Results**:
- At least one configuration section is visible
- Section headings are properly formatted
- Content is readable

**Screenshot**: `screenshots/config-sections.png`

---

#### TC-004: Verify Form Inputs are Interactive
**Objective**: Test that form inputs accept user input

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Identify all input fields (excluding hidden)
2. Focus on first text input
3. Enter test value
4. Verify value is accepted

**Expected Results**:
- Input fields are editable
- Text can be entered
- Input value is retained

---

#### TC-005: Verify Save/Update Button Functionality
**Objective**: Confirm save functionality exists and is accessible

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate save/update/submit button
2. Verify button visibility
3. Check button enabled state

**Expected Results**:
- Save button is present
- Button is visible
- Button is enabled

---

#### TC-006: Verify Cancel/Reset Functionality
**Objective**: Validate cancel/reset operations

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Look for cancel/reset/discard button
2. Verify button is visible
3. Check button is enabled

**Expected Results**:
- Cancel/reset button exists
- Button is accessible
- Button is interactive

---

#### TC-007: Verify Required Field Validation
**Objective**: Test form validation for required fields

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Identify required input fields
2. Clear a required field
3. Attempt to submit form
4. Check for validation message

**Expected Results**:
- Validation triggers on empty required fields
- Error message is displayed
- Form does not submit with invalid data

---

#### TC-008: Verify Tabs/Sections Navigation
**Objective**: Test tab navigation if present

**Preconditions**:
- Configuration page with tabs is loaded

**Steps**:
1. Identify tab elements
2. Click on second tab
3. Verify tab becomes active
4. Check content changes

**Expected Results**:
- Tabs are clickable
- Active tab is highlighted (aria-selected="true")
- Content updates on tab change

**Screenshot**: `screenshots/config-tab-navigation.png`

---

#### TC-009: Verify Dropdown/Select Fields
**Objective**: Test dropdown functionality

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate select/dropdown elements
2. Count available options
3. Select different option
4. Verify selection changes

**Expected Results**:
- Dropdowns are interactive
- Options are available
- Selection can be changed

---

#### TC-010: Verify Checkbox/Toggle Functionality
**Objective**: Test checkbox/toggle controls

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Find checkbox elements
2. Check initial state
3. Click to toggle
4. Verify state change

**Expected Results**:
- Checkboxes are visible
- State toggles on click
- Visual feedback is provided

---

### UI/UX Tests

#### TC-011: Verify Page Responsiveness
**Objective**: Ensure configuration page is responsive across devices

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Set viewport to mobile (375x667)
2. Verify page renders correctly
3. Capture screenshot
4. Set viewport to tablet (768x1024)
5. Verify page renders correctly
6. Capture screenshot
7. Reset to desktop (1920x1080)

**Expected Results**:
- Page is fully functional on mobile
- Page is fully functional on tablet
- Layout adapts appropriately
- No horizontal scrolling on mobile

**Screenshots**:
- `screenshots/config-mobile.png`
- `screenshots/config-tablet.png`

---

#### TC-012: Verify No Console Errors on Page Load
**Objective**: Check for JavaScript errors

**Preconditions**:
- Configuration page is ready to load

**Steps**:
1. Set up console error listener
2. Reload configuration page
3. Wait for complete load
4. Check console for errors

**Expected Results**:
- No JavaScript errors in console
- No failed network requests
- No warning messages

**Screenshot**: `screenshots/config-console-check.png`

---

### Accessibility Tests

#### TC-013: Verify Accessibility Attributes
**Objective**: Ensure proper accessibility implementation

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate all input fields
2. Check for proper labels:
   - aria-label attribute
   - aria-labelledby attribute
   - Associated <label> element
3. Verify label text is descriptive

**Expected Results**:
- All inputs have accessible labels
- Labels are descriptive
- Form is screen reader friendly

---

### Data Persistence Tests

#### TC-014: Verify Data Persistence After Save
**Objective**: Confirm changes are saved correctly

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate text input field
2. Enter unique test value
3. Click save button
4. Wait for save completion
5. Reload page
6. Verify value is retained

**Expected Results**:
- Data is saved on submit
- Changes persist after page reload
- No data loss

---

### Search/Filter Tests

#### TC-015: Verify Search/Filter Functionality
**Objective**: Test search/filter features if available

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate search/filter input
2. Enter search term
3. Wait for results
4. Verify filtering works

**Expected Results**:
- Search input is functional
- Results update dynamically
- Relevant items are shown

**Screenshot**: `screenshots/config-search.png`

---

## Negative Test Cases

### TC-NEG-001: Verify Invalid Data Handling
**Objective**: Ensure proper validation of invalid inputs

**Preconditions**:
- Configuration page is loaded

**Steps**:
1. Locate email input field
2. Enter invalid email format
3. Attempt to submit
4. Check for validation error

**Expected Results**:
- Invalid data is rejected
- Clear error message is shown
- Form does not submit

---

### TC-NEG-002: Verify Unauthorized Access Protection
**Objective**: Confirm configuration requires authentication

**Preconditions**:
- User is initially logged in

**Steps**:
1. Logout from application
2. Attempt to access `/en/configuration` directly
3. Check redirect or error

**Expected Results**:
- Redirects to login page, OR
- Shows "Unauthorized" message
- Configuration is not accessible

---

## Test Coverage Summary

| Category | Test Cases | Coverage |
|----------|-----------|----------|
| Functional | 10 | Form inputs, buttons, validation, navigation |
| UI/UX | 2 | Responsiveness, console errors |
| Accessibility | 1 | Labels, ARIA attributes |
| Data Persistence | 1 | Save and reload |
| Search/Filter | 1 | Search functionality |
| Negative Tests | 2 | Invalid data, unauthorized access |
| **Total** | **17** | **Comprehensive** |

---

## Browser Compatibility

Tests are configured to run on:
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

---

## Screenshots

All screenshots are saved to the `screenshots/` directory:

1. `config-page-loaded.png` - Initial page load
2. `config-sections.png` - Configuration sections view
3. `config-tab-navigation.png` - Tab navigation (if applicable)
4. `config-mobile.png` - Mobile viewport
5. `config-tablet.png` - Tablet viewport
6. `config-console-check.png` - Console error check
7. `config-search.png` - Search functionality (if applicable)

---

## Test Data Management

### Login Credentials
```typescript
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};
```

### Dynamic Test Data
Tests use timestamp-based unique values to avoid conflicts:
```typescript
const testValue = `Test-${Date.now()}`;
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Configuration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test e2e/configuration.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### Common Issues

**Issue: Tests timing out**
- Solution: Increase timeout in playwright.config.ts
- Check network connectivity to carmen-inventory.vercel.app

**Issue: Login fails**
- Solution: Verify test credentials are valid
- Check if login endpoint has changed

**Issue: Elements not found**
- Solution: Page structure may have changed
- Update selectors to match current DOM

**Issue: Screenshots not generated**
- Solution: Ensure screenshots directory exists
- Check file permissions

---

## Maintenance

### When to Update Tests

1. **Page Structure Changes**: Update selectors when HTML structure changes
2. **New Features**: Add new test cases for new configuration options
3. **URL Changes**: Update BASE_URL if deployment changes
4. **Credentials**: Update TEST_CREDENTIALS if test account changes

### Best Practices

- Keep selectors specific but not too fragile
- Use `data-testid` attributes when possible
- Maintain screenshots for visual regression
- Update documentation when adding new tests
- Run tests before committing changes

---

## Reporting

### HTML Report
```bash
npx playwright show-report
```

### JSON Report
Add to `playwright.config.ts`:
```typescript
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results.json' }]
]
```

---

## Contact & Support

For issues or questions regarding these tests:
- Review test logs in `playwright-report/`
- Check screenshots for visual confirmation
- Consult Playwright documentation: https://playwright.dev

---

**Last Updated**: 2025-10-22
**Test Suite Version**: 1.0.0
**Maintained By**: QA Team
