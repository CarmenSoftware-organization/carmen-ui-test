# Carmen UI Test - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server

```bash
cd carmen-ui-test
npm run dev
```

The application will be available at: **http://localhost:3000**

### 2. Explore the Test Pages

- **Home**: http://localhost:3000
- **Components**: http://localhost:3000/components - UI component examples
- **Forms**: http://localhost:3000/forms - Form component testing
- **Layouts**: http://localhost:3000/layouts - Layout pattern examples

### 3. Run Tests

#### Unit Tests (Jest)
```bash
npm run test
```

#### E2E Tests (Playwright)
```bash
npm run test:e2e
```

#### E2E Tests with UI Mode
```bash
npx playwright test --ui
```

## 📁 Project Structure

```
carmen-ui-test/
├── app/                      # Next.js pages (App Router)
│   ├── components/page.tsx   # Component testing page
│   ├── forms/page.tsx        # Form testing page
│   ├── layouts/page.tsx      # Layout testing page
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── e2e/                      # Playwright E2E tests
│   ├── home.spec.ts          # Home page tests
│   └── components.spec.ts    # Component page tests
└── public/                   # Static assets
```

## 🧪 What to Test

### UI Components (Components Page)
- Buttons (primary, secondary)
- Cards
- Input fields
- Badges (info, success, error)
- Alerts
- Loading spinners

### Forms (Forms Page)
- Text inputs
- Email inputs
- Select dropdowns
- Textareas
- Checkboxes
- Form submission

### Layouts (Layouts Page)
- Grid layouts (responsive)
- Flex layouts
- Sidebar layouts
- Responsive breakpoints

## 🎨 Customization

### Add New Test Pages

1. Create new page: `app/your-page/page.tsx`
2. Add navigation link in `app/page.tsx`
3. Create E2E tests: `e2e/your-page.spec.ts`

### Modify Styles

Edit `app/globals.css` or use Tailwind classes directly in components.

### Add Components

Create reusable components in a `components/` directory (optional).

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## 💡 Tips

1. **Hot Reload**: Changes are automatically reflected in the browser
2. **Dark Mode**: Supports automatic dark mode based on system preference
3. **TypeScript**: Full type checking enabled
4. **Responsive**: All components are mobile-friendly

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Playwright tests fail
```bash
# Reinstall browsers
npx playwright install
```

### Dependencies issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Jest Testing](https://jestjs.io/docs/getting-started)

---

**Ready to test Carmen UI components!** 🎉
