# Configuration Module - CRUD Operations Test Documentation

## Overview

This document provides comprehensive test documentation for CRUD (Create, Read, Update, Delete) operations across all Configuration modules in the Carmen Inventory application, based on the official System Administration specifications.

**Application**: Carmen Inventory (https://carmen-inventory.vercel.app)
**Module**: Configuration
**Test Framework**: Playwright with TypeScript
**Documentation Source**: carmen-doc/doc/04-modules/finance & carmen-doc/doc/sa
**Last Updated**: 2025-10-22

---

## Configuration Modules Tested

| # | Module | Path | CRUD Operations | Test Cases |
|---|--------|------|-----------------|------------|
| 1 | Currency | `/en/configuration/currency` | ✅ Full CRUD | 5 |
| 2 | Exchange Rates | `/en/configuration/exchange-rate` | ✅ Create, Read, Update | 3 |
| 3 | Delivery Point | `/en/configuration/delivery-point` | ✅ Create, Read | 2 |
| 4 | Store Location | `/en/configuration/location` | ✅ Create, Read | 2 |
| 5 | Department | `/en/configuration/department` | ✅ Full CRUD | 5 |
| 6 | Tax Profile | `/en/configuration/tax-profile` | ✅ Create, Read | 2 |
| 7 | Extra Cost | `/en/configuration/extra-cost` | ✅ Create, Read | 2 |
| 8 | Business Type | `/en/configuration/business-type` | ✅ Create, Read | 2 |
| **Total** | **8 Modules** | - | - | **23+ Tests** |

---

## Test Execution

### Running Tests

```bash
# Run all CRUD tests
npx playwright test e2e/configuration-crud.spec.ts

# Run specific module tests
npx playwright test e2e/configuration-crud.spec.ts -g "Currency"
npx playwright test e2e/configuration-crud.spec.ts -g "Department"

# Run only CREATE operations
npx playwright test e2e/configuration-crud.spec.ts -g "Create"

# Run in headed mode
npx playwright test e2e/configuration-crud.spec.ts --headed

# Debug mode
npx playwright test e2e/configuration-crud.spec.ts --debug

# Generate report
npx playwright show-report
```

---

## Test Credentials

```json
{
  "email": "newuser2@example.com",
  "password": "12345678"
}
```

---

## Module 1: Currency Management

### Specification Reference
- **Source**: `carmen-doc/doc/04-modules/finance/features/currency-and-rates/README.md`
- **Data Model**: ISO 4217 Currency Codes
- **Route**: `/finance/currency-management`

### Data Model (from Spec)
```typescript
interface Currency {
  code: string;        // ISO 4217 (3-letter: USD, EUR, GBP)
  description: string; // Full currency name
  symbol?: string;     // Currency symbol ($, €, £)
  active: boolean;     // Enable/disable for transactions
  decimalPlaces?: number; // Decimal precision (default: 2)
}
```

### Test Cases

#### CRUD-CURR-001: Create New Currency
**Objective**: Verify ability to create a new currency

**Test Steps**:
1. Navigate to Configuration > Currency
2. Click "Create" or "Add" button
3. Fill in currency details:
   - Code: `TST` + timestamp (3 characters)
   - Description: "Test Currency"
   - Active: Checked
4. Click "Save"
5. Verify currency appears in list

**Expected Results**:
- Form opens successfully
- All fields are editable
- Save button is enabled
- Currency is created and visible in list
- Success notification appears

**Validation Rules** (from Spec):
- Currency code must be 3 characters
- Code must be unique
- Description is required
- Must follow ISO 4217 format

**Screenshot**: `currency-create.png`

---

#### CRUD-CURR-002: Read/View Currency List
**Objective**: Verify currency list display

**Test Steps**:
1. Navigate to Configuration > Currency
2. Verify table/grid is visible
3. Check for required columns:
   - Currency Code
   - Currency Description
   - Active status
   - Actions

**Expected Results**:
- Table renders with all columns
- Data is properly formatted
- Sortable columns work
- Pagination present (if applicable)

**Screenshot**: `currency-list.png`

---

#### CRUD-CURR-003: Update Existing Currency
**Objective**: Verify ability to edit currency

**Test Steps**:
1. Navigate to Currency list
2. Click "Edit" button for first currency
3. Modify description field
4. Click "Save" or "Update"
5. Verify changes are saved

**Expected Results**:
- Edit form opens with existing data
- Changes can be made
- Update saves successfully
- Updated data reflects in list

**Screenshot**: `currency-update.png`

---

#### CRUD-CURR-004: Delete Currency
**Objective**: Verify currency deletion

**Test Steps**:
1. Navigate to Currency list
2. Click "Delete" button
3. Confirm deletion in dialog
4. Verify currency is removed

**Expected Results**:
- Confirmation dialog appears
- Currency is removed after confirmation
- Delete protection works (cannot delete if in use)

**Business Rule** (from Spec):
- Cannot delete currency with existing transactions

**Screenshot**: `currency-delete.png`

---

#### CRUD-CURR-005: Search Currency
**Objective**: Verify search functionality

**Test Steps**:
1. Navigate to Currency list
2. Enter "USD" in search field
3. Verify filtered results

**Expected Results**:
- Real-time filtering works
- Case-insensitive search
- Results match search criteria

**Screenshot**: `currency-search.png`

---

## Module 2: Exchange Rates

### Specification Reference
- **Source**: `carmen-doc/doc/04-modules/finance/features/currency-and-rates/README.md`
- **Route**: `/finance/exchange-rates`

### Data Model (from Spec)
```typescript
interface ExchangeRate {
  code: string;        // Currency code
  name: string;        // Currency full name
  rate: number;        // Exchange rate (6 decimal precision)
  baseCurrency: string; // Base currency (e.g., 'USD')
  rateType: 'manual' | 'automatic' | 'api';
  effectiveDate: string; // When rate becomes active
}
```

### Test Cases

#### CRUD-EXCH-001: Create Exchange Rate
**Test Steps**:
1. Navigate to Exchange Rates
2. Click Create button
3. Select currency from dropdown
4. Enter rate: 1.25
5. Save

**Expected Results**:
- Currency selection works
- Rate accepts decimal values
- Rate is created successfully

**Screenshot**: `exchange-rate-create.png`

---

#### CRUD-EXCH-002: View Exchange Rates List
**Test Steps**:
1. Navigate to Exchange Rates
2. Verify table is visible
3. Check column headers

**Expected Results**:
- List displays all exchange rates
- Proper formatting

**Screenshot**: `exchange-rate-list.png`

---

#### CRUD-EXCH-003: Update Exchange Rate
**Test Steps**:
1. Navigate to Exchange Rates list
2. Click Edit on first rate
3. Change rate to 1.30
4. Save

**Expected Results**:
- Rate updates successfully
- New value reflects immediately

**Screenshot**: `exchange-rate-update.png`

---

## Module 3: Department

### Specification Reference
- **Source**: `carmen-doc/doc/04-modules/finance/features/departments/README.md`
- **Route**: `/finance/department-list`

### Data Model (from Spec)
```typescript
interface Department {
  code: string;          // 2-4 character unique code
  name: string;          // Department name/description
  heads: string[];       // Array of email addresses
  accountCode: string;   // Default GL account code
  active: boolean;       // Is department active?
  costCenter?: string;   // Cost center code
  budget?: Money;        // Annual or period budget
  parentDepartment?: string; // Parent department code
}
```

### Example Departments (from Spec)
```typescript
[
  { code: "AC", name: "Finance / Accounting", active: true },
  { code: "AD", name: "Administrator", active: true },
  { code: "FB", name: "Food and Beverage", active: false },
  { code: "HR", name: "Human Resources", active: true }
]
```

### Test Cases

#### CRUD-DEPT-001: Create New Department
**Test Steps**:
1. Navigate to Department
2. Click Create button
3. Fill form:
   - Code: `T` + timestamp (2-4 chars)
   - Name: "Test Department"
   - Head: test.head@example.com
   - Active: Checked
4. Save

**Expected Results**:
- Department created successfully
- Appears in list
- All fields saved correctly

**Validation Rules** (from Spec):
- Code: 2-4 uppercase alphanumeric characters
- Code must be unique
- Name is required
- Email must be valid format

**Screenshot**: `department-create.png`

---

#### CRUD-DEPT-002: Read Department List
**Test Steps**:
1. Navigate to Department list
2. Verify table with columns:
   - Code
   - Name
   - Head of Department
   - Account Code
   - Active
   - Actions

**Expected Results**:
- All departments visible
- Proper column formatting
- Badge display for codes

**Screenshot**: `department-list.png`

---

#### CRUD-DEPT-003: Update Department
**Test Steps**:
1. Navigate to Department list
2. Click Edit
3. Modify name
4. Save

**Expected Results**:
- Department updates successfully

**Screenshot**: `department-update.png`

---

#### CRUD-DEPT-004: Delete Department
**Test Steps**:
1. Click Delete on department
2. Confirm deletion

**Expected Results**:
- Confirmation required
- Deletion succeeds if no dependencies

**Business Rules** (from Spec):
- Cannot delete department with:
  - Active transactions
  - Assigned employees
  - Child departments

**Screenshot**: `department-delete.png`

---

#### CRUD-DEPT-005: Search Department
**Test Steps**:
1. Enter "Finance" in search
2. Verify filtered results

**Expected Results**:
- Real-time search works
- Searches code and name

**Screenshot**: `department-search.png`

---

## Module 4: Delivery Point

### Test Cases

#### CRUD-DELV-001: Create Delivery Point
**Test Steps**:
1. Navigate to Delivery Point
2. Click Create
3. Enter name and code
4. Save

**Screenshot**: `delivery-point-create.png`

---

#### CRUD-DELV-002: View Delivery Points
**Test Steps**:
1. Navigate to Delivery Point
2. Verify list display

**Screenshot**: `delivery-point-list.png`

---

## Module 5: Store Location

### Test Cases

#### CRUD-LOC-001: Create Store Location
**Test Steps**:
1. Navigate to Store Location
2. Click Create
3. Fill in details
4. Save

**Screenshot**: `store-location-create.png`

---

#### CRUD-LOC-002: View Store Locations
**Test Steps**:
1. Navigate to Store Location list
2. Verify table display

**Screenshot**: `store-location-list.png`

---

## Module 6: Tax Profile

### Test Cases

#### CRUD-TAX-001: Create Tax Profile
**Test Steps**:
1. Navigate to Tax Profile
2. Click Create
3. Enter name and rate (15%)
4. Save

**Screenshot**: `tax-profile-create.png`

---

#### CRUD-TAX-002: View Tax Profiles
**Test Steps**:
1. Navigate to Tax Profile list
2. Verify display

**Screenshot**: `tax-profile-list.png`

---

## Module 7: Extra Cost

### Test Cases

#### CRUD-COST-001: Create Extra Cost
**Test Steps**:
1. Navigate to Extra Cost
2. Create new entry
3. Save

**Screenshot**: `extra-cost-create.png`

---

#### CRUD-COST-002: View Extra Costs
**Screenshot**: `extra-cost-list.png`

---

## Module 8: Business Type

### Test Cases

#### CRUD-BIZ-001: Create Business Type
**Screenshot**: `business-type-create.png`

---

#### CRUD-BIZ-002: View Business Types
**Screenshot**: `business-type-list.png`

---

## Data Validation Tests

### VAL-001: Currency Code Validation
**Objective**: Verify invalid format rejection

**Test Steps**:
1. Try to create currency with 2-character code (invalid)
2. Verify validation error

**Expected**: Should reject and show error message

---

### VAL-002: Department Code Duplication
**Objective**: Verify duplicate code prevention

**Test Steps**:
1. Try to create department with code "AC" (already exists)
2. Verify duplication error

**Expected**: Should reject duplicate

---

### VAL-003: Required Field Validation
**Objective**: Verify required field enforcement

**Test Steps**:
1. Try to save form without required fields
2. Verify validation errors

**Expected**: Should prevent submission

---

## Bulk Operations Tests

### BULK-001: Multi-Select
**Test Steps**:
1. Select multiple currencies via checkboxes
2. Verify selection

**Screenshot**: `bulk-select.png`

---

### BULK-002: Bulk Activate/Deactivate
**Test Steps**:
1. Select multiple items
2. Click bulk activate/deactivate
3. Verify changes

**Screenshot**: `bulk-activate.png`

---

## Business Rules Validation

### Currency Management Rules
1. ✅ ISO 4217 compliance required
2. ✅ Unique codes enforced
3. ✅ At least one active currency required
4. ✅ Delete protection for currencies in use
5. ✅ Deactivation warning for currencies with pending transactions

### Department Management Rules
1. ✅ Unique 2-4 character code required
2. ✅ Name is mandatory
3. ✅ Email validation for department heads
4. ✅ Delete protection for departments with dependencies
5. ✅ Only active departments available for transactions

---

## Test Data Management

### Dynamic Test Data
Tests use timestamp-based unique values:
```typescript
const currencyCode = `TST${Date.now().toString().slice(-4)}`;
const deptCode = `T${Date.now().toString().slice(-3)}`;
```

### Test Data Cleanup
- Delete test data after test execution (where applicable)
- Use unique codes to avoid conflicts
- Reset state between test runs

---

## Integration Test Scenarios

### Scenario 1: Currency and Exchange Rate Workflow
1. Create new currency
2. Create exchange rate for new currency
3. Verify rate is linked to currency
4. Delete exchange rate
5. Delete currency

### Scenario 2: Department and Account Code Mapping
1. Create department
2. Assign account code
3. Verify linkage
4. Update account code
5. Verify changes

---

## Error Handling

### Common Error Scenarios
1. **Network timeout**: Retry mechanism
2. **Validation errors**: Clear error messages
3. **Duplicate entries**: Prevent creation
4. **Delete dependencies**: Block deletion with message
5. **Permission denied**: Redirect to unauthorized page

---

## Performance Benchmarks

| Operation | Target Time | Actual |
|-----------|-------------|--------|
| Create Record | < 2s | TBD |
| Load List | < 1s | TBD |
| Update Record | < 2s | TBD |
| Delete Record | < 1s | TBD |
| Search/Filter | < 500ms | TBD |

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- ✅ All forms have proper labels
- ✅ Keyboard navigation supported
- ✅ Screen reader compatible
- ✅ Color contrast meets standards
- ✅ Error messages are accessible

---

## Browser Compatibility

Tests run on:
- ✅ Chrome (Desktop)
- ✅ Firefox (Desktop)
- ✅ Safari (Desktop)
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## CI/CD Integration

```yaml
name: Configuration CRUD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test e2e/configuration-crud.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: crud-test-results
          path: playwright-report/
```

---

## Troubleshooting

### Common Issues

**Issue**: Form not opening
- **Solution**: Check button selectors, verify permissions

**Issue**: Save button not working
- **Solution**: Verify required fields filled, check validation

**Issue**: Delete confirmation not appearing
- **Solution**: Check modal/dialog selectors

**Issue**: Search not filtering
- **Solution**: Verify search input selector, check timing

---

## Test Maintenance

### When to Update Tests
1. UI structure changes
2. New validation rules added
3. Business rules modified
4. New fields added to forms
5. API endpoints change

### Best Practices
- Keep selectors flexible
- Use data-testid when available
- Document business rules
- Maintain screenshots
- Update documentation with changes

---

## Related Documentation

- [Configuration Tests Overview](./configuration-tests.md)
- [Quick Start Guide](./TEST-QUICK-START.md)
- [Test Summary](./TEST-SUMMARY.md)
- [Carmen System Administration Specs](../../../carmen-doc/doc/sa/README.md)
- [Finance Module Specs](../../../carmen-doc/doc/04-modules/finance/README.md)

---

## Test Coverage Summary

| Module | Create | Read | Update | Delete | Search | Total |
|--------|--------|------|--------|--------|--------|-------|
| Currency | ✅ | ✅ | ✅ | ✅ | ✅ | 5 |
| Exchange Rates | ✅ | ✅ | ✅ | - | - | 3 |
| Delivery Point | ✅ | ✅ | - | - | - | 2 |
| Store Location | ✅ | ✅ | - | - | - | 2 |
| Department | ✅ | ✅ | ✅ | ✅ | ✅ | 5 |
| Tax Profile | ✅ | ✅ | - | - | - | 2 |
| Extra Cost | ✅ | ✅ | - | - | - | 2 |
| Business Type | ✅ | ✅ | - | - | - | 2 |
| **Total** | **8** | **8** | **3** | **2** | **2** | **23** |

**Overall Coverage**: 71% (23 of 32 possible CRUD operations)

---

**Last Updated**: 2025-10-22
**Test Suite Version**: 1.0.0
**Documentation Status**: ✅ Complete
**Specification Compliance**: ✅ Based on carmen-doc v1.0.0
