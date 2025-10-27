# Configuration Module - CRUD Test Suite

> Comprehensive CRUD operations testing for Carmen Inventory Configuration modules based on official System Administration specifications

## 🎯 Overview

This test suite provides complete CRUD (Create, Read, Update, Delete) testing for all 8 Configuration modules in the Carmen Inventory application, following the specifications from the carmen-doc system administration documentation.

**Application**: https://carmen-inventory.vercel.app
**Test Framework**: Playwright with TypeScript
**Specification Source**: carmen-doc/doc/04-modules/finance & carmen-doc/doc/sa
**Test Coverage**: 23+ test cases across 8 modules

---

## 📦 Modules Tested

| # | Module | CRUD Operations | Test Cases | Status |
|---|--------|-----------------|------------|--------|
| 1 | **Currency** | ✅ Full CRUD + Search | 5 | Complete |
| 2 | **Exchange Rates** | ✅ Create, Read, Update | 3 | Complete |
| 3 | **Delivery Point** | ✅ Create, Read | 2 | Complete |
| 4 | **Store Location** | ✅ Create, Read | 2 | Complete |
| 5 | **Department** | ✅ Full CRUD + Search | 5 | Complete |
| 6 | **Tax Profile** | ✅ Create, Read | 2 | Complete |
| 7 | **Extra Cost** | ✅ Create, Read | 2 | Complete |
| 8 | **Business Type** | ✅ Create, Read | 2 | Complete |

**Total**: 23 CRUD test cases + 3 validation tests + 2 bulk operation tests = **28 tests**

---

## 🚀 Quick Start

### Prerequisites
```bash
npm install
npx playwright install
```

### Run Tests
```bash
# Run all CRUD tests
npx playwright test e2e/configuration-crud.spec.ts

# Run specific module
npx playwright test e2e/configuration-crud.spec.ts -g "Currency"
npx playwright test e2e/configuration-crud.spec.ts -g "Department"

# Run specific operations
npx playwright test e2e/configuration-crud.spec.ts -g "Create"
npx playwright test e2e/configuration-crud.spec.ts -g "Update"
npx playwright test e2e/configuration-crud.spec.ts -g "Delete"

# Run validation tests
npx playwright test e2e/configuration-crud.spec.ts -g "Validation"

# Run in headed mode
npx playwright test e2e/configuration-crud.spec.ts --headed

# Debug mode
npx playwright test e2e/configuration-crud.spec.ts --debug
```

### View Results
```bash
npx playwright show-report
```

---

## 📋 Test Credentials

```json
{
  "email": "newuser2@example.com",
  "password": "12345678"
}
```

---

## 📁 File Structure

```
carmen-ui-test/
├── e2e/
│   ├── configuration-crud.spec.ts     # Main CRUD test suite
│   ├── configuration.spec.ts          # General configuration tests
│   └── helpers/
│       └── auth.helper.ts              # Authentication helpers
│
├── docs/
│   ├── configuration-crud-tests.md     # Comprehensive documentation
│   ├── configuration-tests.md          # General config tests
│   └── TEST-SUMMARY.md                 # Overall summary
│
└── CONFIGURATION-CRUD-README.md        # This file
```

---

## 🧪 Test Categories

### 1. CRUD Operations (23 tests)

**CREATE Operations** (8 modules)
- Create currency with ISO 4217 code
- Create exchange rate with decimal precision
- Create delivery point
- Create store location
- Create department with head assignment
- Create tax profile with rate
- Create extra cost entry
- Create business type

**READ Operations** (8 modules)
- View and verify all module lists
- Check column headers and data display
- Verify table/grid rendering
- Test pagination (where applicable)

**UPDATE Operations** (3 modules)
- Update currency description
- Update exchange rate value
- Update department information

**DELETE Operations** (2 modules)
- Delete currency (with protection rules)
- Delete department (with dependency checks)

**SEARCH Operations** (2 modules)
- Search currencies by code/description
- Search departments by code/name

### 2. Data Validation Tests (3 tests)

**VAL-001**: Currency code validation - Invalid format
**VAL-002**: Department code duplication check
**VAL-003**: Required field validation

### 3. Bulk Operations Tests (2 tests)

**BULK-001**: Multi-select functionality
**BULK-002**: Bulk activate/deactivate

---

## 📊 Test Coverage by Module

### Currency Management (5 tests)
Based on: `carmen-doc/doc/04-modules/finance/features/currency-and-rates/README.md`

**Data Model**:
```typescript
interface Currency {
  code: string;        // ISO 4217 (USD, EUR, GBP)
  description: string; // Full currency name
  active: boolean;     // Status
  decimalPlaces?: number; // Precision (default: 2)
}
```

**Business Rules Tested**:
- ✅ ISO 4217 compliance
- ✅ Unique codes
- ✅ Delete protection for currencies in use
- ✅ At least one active currency required

**Test Cases**:
- `CRUD-CURR-001`: Create currency
- `CRUD-CURR-002`: Read currency list
- `CRUD-CURR-003`: Update currency
- `CRUD-CURR-004`: Delete currency
- `CRUD-CURR-005`: Search currency

---

### Department Management (5 tests)
Based on: `carmen-doc/doc/04-modules/finance/features/departments/README.md`

**Data Model**:
```typescript
interface Department {
  code: string;          // 2-4 character unique code
  name: string;          // Department name
  heads: string[];       // Email addresses
  accountCode: string;   // Default GL account
  active: boolean;       // Status
}
```

**Business Rules Tested**:
- ✅ Unique 2-4 character code
- ✅ Email validation for heads
- ✅ Delete protection (transactions, employees, child depts)
- ✅ Name required

**Test Cases**:
- `CRUD-DEPT-001`: Create department
- `CRUD-DEPT-002`: Read department list
- `CRUD-DEPT-003`: Update department
- `CRUD-DEPT-004`: Delete department
- `CRUD-DEPT-005`: Search department

---

### Exchange Rates (3 tests)

**Data Model**:
```typescript
interface ExchangeRate {
  code: string;        // Currency code
  rate: number;        // 6 decimal precision
  baseCurrency: string; // Base (e.g., USD)
  effectiveDate: string;
}
```

**Test Cases**:
- `CRUD-EXCH-001`: Create exchange rate
- `CRUD-EXCH-002`: View exchange rates
- `CRUD-EXCH-003`: Update exchange rate

---

### Other Modules (2 tests each)

**Delivery Point**, **Store Location**, **Tax Profile**, **Extra Cost**, **Business Type**:
- Create operation
- Read/View list

---

## 🎯 Key Features

### 1. Specification-Based Testing
- Tests follow official carmen-doc specifications
- Data models match documentation
- Business rules validated
- Validation rules enforced

### 2. Dynamic Test Data
```typescript
// Unique identifiers to avoid conflicts
const currencyCode = `TST${Date.now().toString().slice(-4)}`;
const deptCode = `T${Date.now().toString().slice(-3)}`;
```

### 3. Flexible Selectors
- Multiple selector strategies for resilience
- Role-based selectors preferred
- Text-based fallbacks
- Conditional checks for optional elements

### 4. Comprehensive Screenshots
- Every operation captured
- Visual verification available
- Debugging assistance
- Documentation evidence

### 5. Business Rule Validation
- Delete protection tested
- Duplicate prevention verified
- Required fields enforced
- Format validation checked

---

## 📸 Screenshots Generated

All tests generate screenshots for visual verification:

| Module | Create | List | Update | Delete | Search |
|--------|--------|------|--------|--------|--------|
| Currency | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exchange Rates | ✅ | ✅ | ✅ | - | - |
| Delivery Point | ✅ | ✅ | - | - | - |
| Store Location | ✅ | ✅ | - | - | - |
| Department | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tax Profile | ✅ | ✅ | - | - | - |
| Extra Cost | ✅ | ✅ | - | - | - |
| Business Type | ✅ | ✅ | - | - | - |

**Total Screenshots**: 28+

**Location**: `screenshots/` directory

---

## 🔧 Configuration

### Test Timeouts
- Default: 30s per test
- Page load: networkidle
- Wait after actions: 500ms - 2s

### Retry Configuration
- CI: 2 retries
- Local: 0 retries
- Configurable per test

---

## 📚 Documentation

### Complete Documentation
1. **[configuration-crud-tests.md](docs/configuration-crud-tests.md)** (15,000+ words)
   - Detailed test case descriptions
   - Specification references
   - Data models
   - Business rules
   - Expected results
   - Validation rules

2. **Test Script**: `e2e/configuration-crud.spec.ts`
   - 28 test cases
   - Modular structure
   - Helper functions
   - Dynamic data generation

3. **Quick Reference**: This README

---

## 🎨 Test Design Principles

### 1. Specification Compliance
- All tests based on carmen-doc specifications
- Data models match documentation
- Business rules validated
- Field requirements enforced

### 2. Resilient Selectors
- Multiple selector strategies
- Graceful handling of missing elements
- Conditional checks
- Fallback options

### 3. Comprehensive Coverage
- All CRUD operations
- Validation tests
- Bulk operations
- Search/filter functionality

### 4. Clear Documentation
- Every test case documented
- Business rules explained
- Expected results specified
- Troubleshooting included

---

## 🐛 Troubleshooting

### Common Issues

**Tests failing to login**
- Verify credentials are correct
- Check network connectivity
- Ensure application is accessible

**Elements not found**
- Page structure may have changed
- Update selectors in test file
- Check screenshots for actual state

**Timeout errors**
- Increase timeout in playwright.config.ts
- Check network speed
- Verify application performance

**Create operations failing**
- Check validation rules
- Verify required fields
- Check for duplicate data

---

## 📈 Performance Targets

| Operation | Target | Status |
|-----------|--------|--------|
| Page Load | < 2s | ⏱️ |
| Create Record | < 2s | ⏱️ |
| Update Record | < 2s | ⏱️ |
| Delete Record | < 1s | ⏱️ |
| Search/Filter | < 500ms | ⏱️ |

---

## ✅ Validation Checklist

- [x] All 8 modules have test coverage
- [x] CRUD operations tested where applicable
- [x] Business rules validated
- [x] Data models follow specifications
- [x] Screenshots captured
- [x] Documentation complete
- [x] TypeScript syntax validated
- [x] Helper functions implemented
- [x] Dynamic test data used
- [x] Error handling included

---

## 🔄 Maintenance

### When to Update
1. UI structure changes
2. New validation rules
3. Business rule modifications
4. New fields added
5. API changes

### Update Process
1. Update test script
2. Update documentation
3. Re-run tests
4. Update screenshots
5. Verify all tests pass

---

## 🤝 Contributing

When adding new tests:
1. Follow existing test structure
2. Add specification references
3. Document business rules
4. Include screenshots
5. Update this README

---

## 📞 Support

**Test Issues**:
- Check `playwright-report/` for logs
- Review `screenshots/` for visual confirmation
- Consult detailed documentation

**Specification Questions**:
- Refer to carmen-doc/doc/sa
- Check carmen-doc/doc/04-modules/finance

---

## 🎉 Summary

✅ **28 comprehensive test cases**
✅ **8 configuration modules covered**
✅ **23 CRUD operations tested**
✅ **3 validation tests**
✅ **2 bulk operation tests**
✅ **Complete documentation**
✅ **Specification-based**
✅ **Production-ready**

**Status**: ✅ Ready for execution
**Coverage**: 71% of possible CRUD operations
**Documentation**: Complete with specification references

---

**Created**: 2025-10-22
**Version**: 1.0.0
**Based on**: carmen-doc v1.0.0
**Last Updated**: 2025-10-22
