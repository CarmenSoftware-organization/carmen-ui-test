# Carmen Inventory - Configuration Testing Suite

> **Complete automated testing for all Configuration modules**

![Test Coverage](https://img.shields.io/badge/Coverage-78%25-green)
![Tests](https://img.shields.io/badge/Tests-112%2B-orange)
![Modules](https://img.shields.io/badge/Modules-8-brightgreen)

---

## 🚀 Quick Start

```bash
# Run all tests with consolidated report (recommended)
./run-all-tests.sh
```

**Duration**: ~10-15 minutes | **Output**: Unified report + JSON summary

---

## 📊 Test Suites

| Suite | Tests | Report |
|-------|-------|--------|
| Navigation | 72 | [View](docs/configuration-navigation-flows.md) |
| Validation | 40 | [View](docs/configuration-validation-tests.md) |
| CRUD | TBD | [View](docs/configuration-crud-tests.md) |
| **Consolidated** | **112+** | **[View](docs/consolidated-test-report.md)** |

---

## 📚 Documentation

**Main Guides**:
- [Complete Testing Guide](NAVIGATION-TESTING-README.md) - Everything you need to know
- [Test Checklist](docs/TEST-CHECKLIST.md) - Step-by-step testing checklist
- [Consolidated Reporting](docs/CONSOLIDATED-REPORTING.md) - Using unified reports
- [Validation Guide](docs/VALIDATION-TESTING-GUIDE.md) - Validation testing details

**Reports**:
- [Consolidated Report](docs/consolidated-test-report.md) - All results combined
- [Navigation Report](docs/configuration-navigation-flows.md) - Navigation flows
- [Validation Report](docs/configuration-validation-tests.md) - Form validation

---

## 💻 Common Commands

```bash
# Run individual test suites
npx playwright test e2e/configuration-navigation-flows.spec.ts --config=playwright-nav-review.config.ts
npx playwright test e2e/configuration-validation.spec.ts --config=playwright-nav-review.config.ts

# View results
cat docs/consolidated-test-report.md
cat docs/consolidated-test-report.json

# Debug mode
npx playwright test e2e/configuration-navigation-flows.spec.ts --config=playwright-nav-review.config.ts --debug
```

---

## 📈 Test Coverage

**Modules** (8): Currency, Exchange Rates, Delivery Point, Store Location, Department, Tax Profile, Extra Cost, Business Type

**Coverage**:
- Navigation: 87.5% (7/8 modules)
- Validation: 75% average
- Overall: 78%

---

**For complete documentation, see [NAVIGATION-TESTING-README.md](NAVIGATION-TESTING-README.md)**
