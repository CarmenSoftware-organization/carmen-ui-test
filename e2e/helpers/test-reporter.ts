/**
 * Unified Test Reporting System
 * Consolidates all configuration test reports into a single comprehensive report
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TestSuite {
  name: string;
  type: 'navigation' | 'validation' | 'crud' | 'review';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  issues: string[];
  recommendations: string[];
}

export interface ModuleTestResult {
  module: string;
  path: string;
  navigation?: {
    mainLoad: string;
    create: string;
    edit: string;
    view: string;
    delete: string;
    filter: string;
    search: string;
    sort: string;
    bulk: string;
    back: string;
  };
  validation?: {
    requiredFields: string;
    dataTypes: string;
    inputConstraints: string;
    errorMessages: string;
    formSubmission: string;
  };
  crud?: {
    create: string;
    read: string;
    update: string;
    delete: string;
  };
  screenshots: string[];
  issues: string[];
  recommendations: string[];
}

export interface ConsolidatedReport {
  generatedAt: Date;
  testSuites: TestSuite[];
  modules: ModuleTestResult[];
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalSkipped: number;
    totalIssues: number;
    totalRecommendations: number;
    overallPassRate: number;
    testDuration: number;
  };
  screenshots: {
    navigation: string[];
    validation: string[];
    crud: string[];
  };
}

export class TestReporter {
  private report: ConsolidatedReport;

  constructor() {
    this.report = {
      generatedAt: new Date(),
      testSuites: [],
      modules: [],
      summary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalSkipped: 0,
        totalIssues: 0,
        totalRecommendations: 0,
        overallPassRate: 0,
        testDuration: 0,
      },
      screenshots: {
        navigation: [],
        validation: [],
        crud: [],
      },
    };
  }

  addTestSuite(suite: TestSuite): void {
    this.testSuites.push(suite);
    this.updateSummary();
  }

  addModuleResult(result: ModuleTestResult): void {
    const existingIndex = this.modules.findIndex(m => m.module === result.module);

    if (existingIndex >= 0) {
      // Merge with existing module result
      const existing = this.modules[existingIndex];
      this.modules[existingIndex] = {
        ...existing,
        ...result,
        navigation: { ...existing.navigation, ...result.navigation },
        validation: { ...existing.validation, ...result.validation },
        crud: { ...existing.crud, ...result.crud },
        screenshots: [...new Set([...existing.screenshots, ...result.screenshots])],
        issues: [...new Set([...existing.issues, ...result.issues])],
        recommendations: [...new Set([...existing.recommendations, ...result.recommendations])],
      };
    } else {
      this.modules.push(result);
    }
  }

  private updateSummary(): void {
    this.summary.totalTests = this.testSuites.reduce((sum, s) => sum + s.totalTests, 0);
    this.summary.totalPassed = this.testSuites.reduce((sum, s) => sum + s.passed, 0);
    this.summary.totalFailed = this.testSuites.reduce((sum, s) => sum + s.failed, 0);
    this.summary.totalSkipped = this.testSuites.reduce((sum, s) => sum + s.skipped, 0);
    this.summary.totalIssues = this.testSuites.reduce((sum, s) => sum + s.issues.length, 0);
    this.summary.totalRecommendations = this.testSuites.reduce((sum, s) => sum + s.recommendations.length, 0);
    this.summary.testDuration = this.testSuites.reduce((sum, s) => sum + (s.duration || 0), 0);
    this.summary.overallPassRate = this.summary.totalTests > 0
      ? Math.round((this.summary.totalPassed / this.summary.totalTests) * 100)
      : 0;
  }

  generateMarkdownReport(): string {
    const date = this.generatedAt.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    let markdown = `# Configuration Testing - Consolidated Report

> **Generated**: ${this.generatedAt.toLocaleString()}
> **Test Suites Run**: ${this.testSuites.length}
> **Modules Tested**: ${this.modules.length}
> **Total Tests**: ${this.summary.totalTests}
> **Pass Rate**: ${this.summary.overallPassRate}%

---

## 📊 Executive Summary

### Test Overview

| Metric | Count | Percentage |
|--------|-------|------------|
| Total Tests Executed | ${this.summary.totalTests} | 100% |
| Tests Passed | ${this.summary.totalPassed} | ${Math.round((this.summary.totalPassed / this.summary.totalTests) * 100)}% |
| Tests Failed | ${this.summary.totalFailed} | ${Math.round((this.summary.totalFailed / this.summary.totalTests) * 100)}% |
| Tests Skipped | ${this.summary.totalSkipped} | ${Math.round((this.summary.totalSkipped / this.summary.totalTests) * 100)}% |
| Total Issues Found | ${this.summary.totalIssues} | - |
| Total Recommendations | ${this.summary.totalRecommendations} | - |

### Test Suite Results

| Test Suite | Tests | Passed | Failed | Duration | Status |
|------------|-------|--------|--------|----------|--------|
`;

    this.testSuites.forEach(suite => {
      const status = suite.failed === 0 ? '✅ Pass' : '❌ Fail';
      const duration = suite.duration ? `${(suite.duration / 1000).toFixed(1)}s` : 'N/A';
      markdown += `| ${suite.name} | ${suite.totalTests} | ${suite.passed} | ${suite.failed} | ${duration} | ${status} |\n`;
    });

    markdown += `\n**Total Duration**: ${(this.summary.testDuration / 1000 / 60).toFixed(2)} minutes\n\n`;

    // Comprehensive Status Matrix
    markdown += `---\n\n## 🎯 Comprehensive Module Status Matrix\n\n`;
    markdown += this.generateStatusMatrix();

    // Module Details
    markdown += `\n---\n\n## 📋 Detailed Module Reports\n\n`;
    markdown += this.generateModuleDetails();

    // Issues and Recommendations
    markdown += `\n---\n\n## 🐛 Issues & Recommendations\n\n`;
    markdown += this.generateIssuesAndRecommendations();

    // Screenshots
    markdown += `\n---\n\n## 📸 Test Evidence\n\n`;
    markdown += this.generateScreenshotSection();

    // Test Suite Breakdown
    markdown += `\n---\n\n## 🧪 Test Suite Breakdown\n\n`;
    markdown += this.generateTestSuiteBreakdown();

    // Footer
    markdown += `\n---\n\n**Report Generated**: ${this.generatedAt.toLocaleString()}\n`;
    markdown += `**Reporting System**: Unified Test Reporter v1.0.0\n`;
    markdown += `**Framework**: Playwright + TypeScript\n`;

    return markdown;
  }

  private generateStatusMatrix(): string {
    let matrix = `| Module | Navigation | Validation | CRUD | Overall |\n`;
    matrix += `|--------|------------|------------|------|--------|\n`;

    this.modules.forEach(module => {
      const navStatus = this.calculateModuleStatus(module.navigation);
      const valStatus = this.calculateModuleStatus(module.validation);
      const crudStatus = this.calculateModuleStatus(module.crud);
      const overall = this.calculateOverallStatus([navStatus, valStatus, crudStatus]);

      matrix += `| ${module.module} | ${navStatus} | ${valStatus} | ${crudStatus} | ${overall} |\n`;
    });

    return matrix;
  }

  private calculateModuleStatus(testGroup: any): string {
    if (!testGroup) return '⚪ Not Tested';

    const results = Object.values(testGroup) as string[];
    const total = results.length;
    const passed = results.filter(r => r && r.includes('✅')).length;
    const failed = results.filter(r => r && r.includes('❌')).length;

    if (passed === total) return '✅ Excellent';
    if (passed >= total * 0.75) return '🟢 Good';
    if (passed >= total * 0.5) return '🟡 Fair';
    if (failed > passed) return '🔴 Poor';
    return '⚪ Unclear';
  }

  private calculateOverallStatus(statuses: string[]): string {
    const tested = statuses.filter(s => s !== '⚪ Not Tested');
    if (tested.length === 0) return '⚪ Not Tested';

    const excellent = tested.filter(s => s.includes('✅')).length;
    const good = tested.filter(s => s.includes('🟢')).length;

    if (excellent === tested.length) return '✅ Excellent';
    if (excellent + good >= tested.length * 0.75) return '🟢 Good';
    if (excellent + good >= tested.length * 0.5) return '🟡 Fair';
    return '🔴 Needs Work';
  }

  private generateModuleDetails(): string {
    let details = '';

    this.modules.forEach(module => {
      details += `### ${module.module}\n\n`;
      details += `**Path**: \`${module.path}\`\n\n`;

      // Navigation Results
      if (module.navigation) {
        details += `#### Navigation Tests\n\n`;
        details += `| Test | Status |\n|------|--------|\n`;
        details += `| Main Page Load | ${module.navigation.mainLoad} |\n`;
        details += `| Create/Add | ${module.navigation.create} |\n`;
        details += `| Edit | ${module.navigation.edit} |\n`;
        details += `| View | ${module.navigation.view} |\n`;
        details += `| Delete | ${module.navigation.delete} |\n`;
        details += `| Filter | ${module.navigation.filter} |\n`;
        details += `| Search | ${module.navigation.search} |\n`;
        details += `| Sort | ${module.navigation.sort} |\n`;
        details += `| Bulk Actions | ${module.navigation.bulk} |\n`;
        details += `| Back Navigation | ${module.navigation.back} |\n\n`;
      }

      // Validation Results
      if (module.validation) {
        details += `#### Validation Tests\n\n`;
        details += `| Test | Status |\n|------|--------|\n`;
        details += `| Required Fields | ${module.validation.requiredFields} |\n`;
        details += `| Data Types | ${module.validation.dataTypes} |\n`;
        details += `| Input Constraints | ${module.validation.inputConstraints} |\n`;
        details += `| Error Messages | ${module.validation.errorMessages} |\n`;
        details += `| Form Submission | ${module.validation.formSubmission} |\n\n`;
      }

      // CRUD Results
      if (module.crud) {
        details += `#### CRUD Operations\n\n`;
        details += `| Operation | Status |\n|-----------|--------|\n`;
        details += `| Create | ${module.crud.create} |\n`;
        details += `| Read | ${module.crud.read} |\n`;
        details += `| Update | ${module.crud.update} |\n`;
        details += `| Delete | ${module.crud.delete} |\n\n`;
      }

      // Module Issues
      if (module.issues.length > 0) {
        details += `#### Issues\n\n`;
        module.issues.forEach(issue => {
          details += `- ❌ ${issue}\n`;
        });
        details += `\n`;
      }

      // Module Recommendations
      if (module.recommendations.length > 0) {
        details += `#### Recommendations\n\n`;
        module.recommendations.forEach(rec => {
          details += `- 💡 ${rec}\n`;
        });
        details += `\n`;
      }

      details += `---\n\n`;
    });

    return details;
  }

  private generateIssuesAndRecommendations(): string {
    let section = '';

    // Collect all unique issues
    const allIssues = this.modules.flatMap(m => m.issues);
    const uniqueIssues = [...new Set(allIssues)];

    if (uniqueIssues.length > 0) {
      section += `### Critical Issues (${uniqueIssues.length})\n\n`;
      uniqueIssues.forEach((issue, index) => {
        const count = allIssues.filter(i => i === issue).length;
        section += `${index + 1}. ❌ **${issue}** (${count} module${count > 1 ? 's' : ''})\n`;
      });
      section += `\n`;
    } else {
      section += `### Critical Issues\n\n✅ No critical issues found.\n\n`;
    }

    // Collect all unique recommendations
    const allRecommendations = this.modules.flatMap(m => m.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];

    if (uniqueRecommendations.length > 0) {
      section += `### Recommendations (${uniqueRecommendations.length})\n\n`;
      uniqueRecommendations.forEach((rec, index) => {
        const count = allRecommendations.filter(r => r === rec).length;
        section += `${index + 1}. 💡 **${rec}** (${count} module${count > 1 ? 's' : ''})\n`;
      });
      section += `\n`;
    } else {
      section += `### Recommendations\n\n✅ All modules meet quality standards.\n\n`;
    }

    return section;
  }

  private generateScreenshotSection(): string {
    let section = '';

    const navCount = this.screenshots.navigation.length;
    const valCount = this.screenshots.validation.length;
    const crudCount = this.screenshots.crud.length;
    const total = navCount + valCount + crudCount;

    section += `**Total Screenshots**: ${total}\n\n`;

    if (navCount > 0) {
      section += `### Navigation Screenshots (${navCount})\n\n`;
      this.screenshots.navigation.slice(0, 10).forEach(screenshot => {
        section += `- \`${screenshot}\`\n`;
      });
      if (navCount > 10) {
        section += `- ... and ${navCount - 10} more\n`;
      }
      section += `\n`;
    }

    if (valCount > 0) {
      section += `### Validation Screenshots (${valCount})\n\n`;
      this.screenshots.validation.slice(0, 10).forEach(screenshot => {
        section += `- \`${screenshot}\`\n`;
      });
      if (valCount > 10) {
        section += `- ... and ${valCount - 10} more\n`;
      }
      section += `\n`;
    }

    if (crudCount > 0) {
      section += `### CRUD Screenshots (${crudCount})\n\n`;
      this.screenshots.crud.slice(0, 10).forEach(screenshot => {
        section += `- \`${screenshot}\`\n`;
      });
      if (crudCount > 10) {
        section += `- ... and ${crudCount - 10} more\n`;
      }
      section += `\n`;
    }

    return section;
  }

  private generateTestSuiteBreakdown(): string {
    let breakdown = '';

    this.testSuites.forEach(suite => {
      breakdown += `### ${suite.name}\n\n`;
      breakdown += `**Type**: ${suite.type.charAt(0).toUpperCase() + suite.type.slice(1)}\n`;
      breakdown += `**Duration**: ${suite.duration ? (suite.duration / 1000).toFixed(2) : 'N/A'}s\n`;
      breakdown += `**Tests**: ${suite.totalTests} (${suite.passed} passed, ${suite.failed} failed, ${suite.skipped} skipped)\n\n`;

      if (suite.issues.length > 0) {
        breakdown += `**Issues**:\n`;
        suite.issues.forEach(issue => {
          breakdown += `- ${issue}\n`;
        });
        breakdown += `\n`;
      }

      if (suite.recommendations.length > 0) {
        breakdown += `**Recommendations**:\n`;
        suite.recommendations.forEach(rec => {
          breakdown += `- ${rec}\n`;
        });
        breakdown += `\n`;
      }

      breakdown += `---\n\n`;
    });

    return breakdown;
  }

  saveReport(filename: string = 'docs/consolidated-test-report.md'): void {
    const markdown = this.generateMarkdownReport();
    const dir = path.dirname(filename);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filename, markdown);
    console.log(`\n✅ Consolidated report saved to: ${filename}`);
  }

  saveJSON(filename: string = 'docs/consolidated-test-report.json'): void {
    const dir = path.dirname(filename);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filename, JSON.stringify(this.report, null, 2));
    console.log(`✅ JSON report saved to: ${filename}`);
  }

  // Getters
  get testSuites() { return this.report.testSuites; }
  get modules() { return this.report.modules; }
  get summary() { return this.report.summary; }
  get screenshots() { return this.report.screenshots; }
  get generatedAt() { return this.report.generatedAt; }
}
