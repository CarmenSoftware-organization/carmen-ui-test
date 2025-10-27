import { test, expect } from '@playwright/test'

test('components page displays all component sections', async ({ page }) => {
  await page.goto('/components')

  // Check for component sections
  await expect(page.getByRole('heading', { name: 'Buttons' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Inputs' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Badges' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Loading' })).toBeVisible()
})

test('buttons are interactive', async ({ page }) => {
  await page.goto('/components')

  // Find and interact with buttons
  const primaryButton = page.getByRole('button', { name: 'Primary Button' })
  const secondaryButton = page.getByRole('button', { name: 'Secondary Button' })

  await expect(primaryButton).toBeVisible()
  await expect(secondaryButton).toBeVisible()

  // Test button clicks
  await primaryButton.click()
  await secondaryButton.click()
})
