# Configuration Tests - Quick Start Guide

## Prerequisites

✅ Node.js installed (v18+)
✅ Playwright installed
✅ Test credentials available

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run All Configuration Tests
```bash
npx playwright test e2e/configuration.spec.ts
```

### Run Specific Test
```bash
# By test name
npx playwright test e2e/configuration.spec.ts -g "TC-001"

# By describe block
npx playwright test e2e/configuration.spec.ts -g "Configuration Section Tests"
```

### Interactive Mode
```bash
# Headed mode (see browser)
npx playwright test e2e/configuration.spec.ts --headed

# Debug mode (step through)
npx playwright test e2e/configuration.spec.ts --debug

# UI mode (interactive)
npx playwright test e2e/configuration.spec.ts --ui
```

### Browser Selection
```bash
# Chromium only
npx playwright test e2e/configuration.spec.ts --project=chromium

# Firefox only
npx playwright test e2e/configuration.spec.ts --project=firefox

# All browsers
npx playwright test e2e/configuration.spec.ts --project=chromium --project=firefox --project=webkit
```

## View Results

```bash
# Open HTML report
npx playwright show-report

# Show trace viewer (for failed tests)
npx playwright show-trace trace.zip
```

## Test Credentials

```json
{
  "email": "newuser2@example.com",
  "password": "12345678"
}
```

## Directory Structure

```
carmen-ui-test/
├── e2e/
│   ├── configuration.spec.ts    # Main test file
│   └── helpers/
│       └── auth.helper.ts       # Authentication helpers
├── docs/
│   ├── configuration-tests.md   # Full documentation
│   └── TEST-QUICK-START.md      # This file
├── screenshots/                  # Test screenshots
└── playwright.config.ts          # Playwright configuration
```

## Key Test Cases

| ID | Description | Priority |
|----|-------------|----------|
| TC-001 | Page loads successfully | High |
| TC-004 | Form inputs interactive | High |
| TC-007 | Required field validation | High |
| TC-011 | Responsive design | Medium |
| TC-014 | Data persistence | High |
| TC-NEG-001 | Invalid data handling | High |
| TC-NEG-002 | Unauthorized access | Critical |

## Common Commands

```bash
# Run tests in parallel
npx playwright test e2e/configuration.spec.ts --workers=4

# Run with retries
npx playwright test e2e/configuration.spec.ts --retries=2

# Update screenshots
npx playwright test e2e/configuration.spec.ts --update-snapshots

# Generate detailed report
npx playwright test e2e/configuration.spec.ts --reporter=html,json
```

## Troubleshooting

**Tests failing?**
1. Check internet connection
2. Verify test credentials are valid
3. Check if application URL is accessible
4. Review screenshots in `screenshots/` folder

**Timeouts?**
```bash
# Increase timeout
npx playwright test e2e/configuration.spec.ts --timeout=60000
```

**Element not found?**
- Page structure may have changed
- Check the screenshot to see what's on screen
- Update selectors in test file

## Next Steps

1. ✅ Review full documentation: `docs/configuration-tests.md`
2. ✅ Run initial test suite
3. ✅ Check screenshots
4. ✅ Review HTML report
5. ✅ Customize tests as needed

---

**Quick Help**
- Full docs: `/docs/configuration-tests.md`
- Playwright docs: https://playwright.dev
- Test file: `/e2e/configuration.spec.ts`
