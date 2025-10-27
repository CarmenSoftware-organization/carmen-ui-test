import { test, expect } from '@playwright/test'

test('home page has correct title', async ({ page }) => {
  await page.goto('/')

  // Expect the page title to contain Carmen UI Test
  await expect(page).toHaveTitle(/Carmen UI Test/)
})

test('home page has navigation links', async ({ page }) => {
  await page.goto('/')

  // Check for navigation links
  const componentsLink = page.getByRole('link', { name: /Components/ })
  const formsLink = page.getByRole('link', { name: /Forms/ })
  const layoutsLink = page.getByRole('link', { name: /Layouts/ })

  await expect(componentsLink).toBeVisible()
  await expect(formsLink).toBeVisible()
  await expect(layoutsLink).toBeVisible()
})

test('can navigate to components page', async ({ page }) => {
  await page.goto('/')

  // Click on Components link
  await page.getByRole('link', { name: /Components/ }).click()

  // Verify we're on the components page
  await expect(page).toHaveURL('/components')
  await expect(page.getByRole('heading', { name: 'UI Components' })).toBeVisible()
})
