# Carmen UI Test Environment

A Next.js-based testing environment for Carmen UI components.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
carmen-ui-test/
├── app/                    # Next.js App Router pages
│   ├── components/        # Component testing page
│   ├── forms/            # Form testing page
│   ├── layouts/          # Layout testing page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── e2e/                   # Playwright E2E tests
│   ├── home.spec.ts
│   └── components.spec.ts
├── public/                # Static assets
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup file
├── playwright.config.ts   # Playwright configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright E2E tests

## Testing

### Unit/Component Tests (Jest)

```bash
npm run test
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui
```

### Configuration Module Tests

Complete E2E test suite for Carmen Inventory Configuration modules:

```bash
# Run all configuration tests with consolidated report
./run-all-tests.sh

# View complete testing documentation
cat docs/README.md
```

**Testing Documentation**: See [`docs/README.md`](docs/README.md) for complete testing guides, checklists, and reports.

**Quick Links**:
- [Testing Quick Start](docs/TESTING-README.md)
- [Complete Testing Guide](docs/NAVIGATION-TESTING-README.md)
- [Test Checklist](docs/TEST-CHECKLIST.md)
- [Latest Test Report](docs/consolidated-test-report.md)

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**:
  - Jest + React Testing Library (unit/component tests)
  - Playwright (E2E tests)

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ Jest configured for unit testing
- ✅ Playwright configured for E2E testing
- ✅ ESLint for code quality
- ✅ Sample pages for testing UI components
- ✅ Dark mode support
- ✅ Responsive design examples

## Adding Components

To add new UI components for testing:

1. Create a new page in the `app/` directory
2. Add navigation link in `app/page.tsx`
3. Create corresponding E2E tests in `e2e/`

## License

MIT
