#!/bin/bash

# Configuration Testing - Master Test Runner
# Runs all test suites and generates consolidated report

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONFIG="--config=playwright-nav-review.config.ts"
REPORT_DIR="docs"
SCREENSHOT_DIR="screenshots"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 Configuration Testing - Complete Suite Runner"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Create directories if they don't exist
mkdir -p "$REPORT_DIR"
mkdir -p "$SCREENSHOT_DIR"

# Track test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
START_TIME=$(date +%s)

# Function to run a test suite
run_test_suite() {
    local name=$1
    local file=$2
    local duration=0

    echo ""
    echo "───────────────────────────────────────────────────────────────"
    echo -e "${BLUE}📋 Running: $name${NC}"
    echo "───────────────────────────────────────────────────────────────"

    local test_start=$(date +%s)

    if npx playwright test "$file" $CONFIG; then
        local test_end=$(date +%s)
        duration=$((test_end - test_start))
        echo -e "${GREEN}✅ $name completed in ${duration}s${NC}"
        ((PASSED_TESTS++))
    else
        local test_end=$(date +%s)
        duration=$((test_end - test_start))
        echo -e "${RED}❌ $name failed after ${duration}s${NC}"
        ((FAILED_TESTS++))
    fi

    ((TOTAL_TESTS++))
}

# Run individual test suites
echo ""
echo "Starting test execution..."

# 1. Navigation Flow Tests
run_test_suite \
    "Navigation Flow Tests" \
    "e2e/configuration-navigation-flows.spec.ts"

# 2. Validation Tests
run_test_suite \
    "Form Validation Tests" \
    "e2e/configuration-validation.spec.ts"

# 3. CRUD Tests (if exists)
if [ -f "e2e/configuration-crud.spec.ts" ]; then
    run_test_suite \
        "CRUD Operation Tests" \
        "e2e/configuration-crud.spec.ts"
fi

# Calculate duration
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))
MINUTES=$((TOTAL_DURATION / 60))
SECONDS=$((TOTAL_DURATION % 60))

# Generate consolidated report
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 Generating Consolidated Report"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Create consolidated report
REPORT_FILE="$REPORT_DIR/consolidated-test-report.md"
JSON_FILE="$REPORT_DIR/consolidated-test-report.json"

cat > "$REPORT_FILE" << EOF
# Configuration Testing - Consolidated Report

> **Generated**: $(date '+%Y-%m-%d %H:%M:%S')
> **Test Suites Run**: $TOTAL_TESTS
> **Pass Rate**: $(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 ))%
> **Duration**: ${MINUTES}m ${SECONDS}s

---

## 📊 Executive Summary

### Test Suite Results

| Test Suite | Status | Report |
|------------|--------|--------|
| Navigation Flow Tests | $([ $PASSED_TESTS -ge 1 ] && echo "✅ Pass" || echo "❌ Fail") | [View Report](configuration-navigation-flows.md) |
| Form Validation Tests | $([ $PASSED_TESTS -ge 2 ] && echo "✅ Pass" || echo "❌ Fail") | [View Report](configuration-validation-tests.md) |
| CRUD Operation Tests | $([ -f "$REPORT_DIR/configuration-crud-tests.md" ] && echo "✅ Pass" || echo "⚪ Not Run") | $([ -f "$REPORT_DIR/configuration-crud-tests.md" ] && echo "[View Report](configuration-crud-tests.md)" || echo "N/A") |

### Summary Statistics

- **Total Test Suites**: $TOTAL_TESTS
- **Passed**: $PASSED_TESTS
- **Failed**: $FAILED_TESTS
- **Total Duration**: ${MINUTES}m ${SECONDS}s

---

## 📋 Individual Test Reports

### 1. Navigation Flow Tests
- **Report**: [configuration-navigation-flows.md](configuration-navigation-flows.md)
- **Tests**: 72 navigation flows across 8 modules
- **Coverage**: Main load, Create, Edit, View, Delete, Filter, Search, Sort, Bulk, Back navigation

### 2. Form Validation Tests
- **Report**: [configuration-validation-tests.md](configuration-validation-tests.md)
- **Tests**: 40 validation tests across 8 modules
- **Coverage**: Required fields, Data types, Constraints, Error messages, Form submission

### 3. CRUD Operation Tests
- **Report**: [configuration-crud-tests.md](configuration-crud-tests.md) $([ -f "$REPORT_DIR/configuration-crud-tests.md" ] || echo "(Not available)")
- **Tests**: Create, Read, Update, Delete operations
- **Coverage**: Data persistence and manipulation

---

## 📸 Test Evidence

### Screenshots Generated

\`\`\`bash
# Navigation screenshots
ls screenshots/flow-*.png

# Validation screenshots
ls screenshots/validation-*.png

# CRUD screenshots
ls screenshots/crud-*.png
\`\`\`

**Total Screenshots**: $(ls $SCREENSHOT_DIR/*.png 2>/dev/null | wc -l | tr -d ' ')

---

## 📚 Documentation

- [Complete Testing Checklist](TEST-CHECKLIST.md)
- [Navigation Testing Guide](../NAVIGATION-TESTING-README.md)
- [Validation Testing Guide](VALIDATION-TESTING-GUIDE.md)

---

**Report Generated**: $(date '+%Y-%m-%d %H:%M:%S')
**Reporting System**: Shell Script Runner v1.0.0
**Framework**: Playwright + TypeScript
EOF

echo "✅ Consolidated report saved to: $REPORT_FILE"

# Create JSON summary
cat > "$JSON_FILE" << EOF
{
  "generatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "summary": {
    "totalSuites": $TOTAL_TESTS,
    "passed": $PASSED_TESTS,
    "failed": $FAILED_TESTS,
    "passRate": $(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 )),
    "duration": {
      "total": $TOTAL_DURATION,
      "minutes": $MINUTES,
      "seconds": $SECONDS
    }
  },
  "reports": {
    "navigation": "$REPORT_DIR/configuration-navigation-flows.md",
    "validation": "$REPORT_DIR/configuration-validation-tests.md",
    "crud": "$REPORT_DIR/configuration-crud-tests.md",
    "consolidated": "$REPORT_FILE"
  },
  "screenshots": {
    "total": $(ls $SCREENSHOT_DIR/*.png 2>/dev/null | wc -l | tr -d ' '),
    "directory": "$SCREENSHOT_DIR"
  }
}
EOF

echo "✅ JSON summary saved to: $JSON_FILE"

# Print final summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📈 Final Test Summary"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "   Total Suites: $TOTAL_TESTS"
echo -e "   ${GREEN}✅ Passed: $PASSED_TESTS${NC}"
echo -e "   ${RED}❌ Failed: $FAILED_TESTS${NC}"
echo "   📊 Pass Rate: $(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 ))%"
echo "   ⏱️  Duration: ${MINUTES}m ${SECONDS}s"
echo ""
echo "   📄 Reports:"
echo "      • Consolidated: $REPORT_FILE"
echo "      • JSON Summary: $JSON_FILE"
echo ""
echo "   📸 Screenshots: $(ls $SCREENSHOT_DIR/*.png 2>/dev/null | wc -l | tr -d ' ') files in $SCREENSHOT_DIR/"
echo ""
echo "═══════════════════════════════════════════════════════════════"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check individual reports for details.${NC}"
    echo ""
    exit 1
fi
