import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://carmen-inventory.vercel.app';

const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

async function login(page: Page) {
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/en/sign-in`);
  await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
  await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();
  await page.getByTestId('sign-in-button').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

test('Debug Name Links - Currency Module', async ({ page }) => {
  await login(page);

  // Navigate to Currency module
  await page.goto(`${BASE_URL}/en/configuration/currency`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n=== Debugging Currency Module Name Links ===\n');

  // Try different selectors
  const selectors = [
    'tbody tr a',
    'tbody tr td a',
    'table tbody tr a',
    'tbody a',
    '[role="table"] a',
    'tbody tr td:nth-child(2) a', // Name column is usually 2nd
    'tbody tr td a[href*="/currency/"]',
  ];

  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    console.log(`Selector "${selector}": Found ${count} elements`);

    if (count > 0) {
      const firstElement = page.locator(selector).first();
      const text = await firstElement.textContent();
      const href = await firstElement.getAttribute('href');
      console.log(`  → First element text: "${text}"`);
      console.log(`  → First element href: "${href}"`);
    }
  }

  // Get the table HTML structure
  console.log('\n=== Table Structure ===\n');
  const tableHTML = await page.locator('table').first().innerHTML();
  console.log('First 2000 chars of table HTML:');
  console.log(tableHTML.substring(0, 2000));

  // Check if there are any clickable elements in the first row
  console.log('\n=== First Row Analysis ===\n');
  const firstRow = page.locator('tbody tr').first();
  const firstRowHTML = await firstRow.innerHTML();
  console.log('First row HTML:');
  console.log(firstRowHTML);

  // Try to find all clickable elements in tbody
  const allLinks = await page.locator('tbody a').all();
  console.log(`\n=== All Links in tbody: ${allLinks.length} ===\n`);
  for (let i = 0; i < Math.min(allLinks.length, 5); i++) {
    const text = await allLinks[i].textContent();
    const href = await allLinks[i].getAttribute('href');
    console.log(`Link ${i + 1}: "${text}" → ${href}`);
  }
});

test('Debug Name Links - Extra Cost Module', async ({ page }) => {
  await login(page);

  // Navigate to Extra Cost module
  await page.goto(`${BASE_URL}/en/configuration/extra-cost`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n=== Debugging Extra Cost Module Name Links ===\n');

  // Check all links in tbody
  const allLinks = await page.locator('tbody a').all();
  console.log(`All Links in tbody: ${allLinks.length}`);
  for (let i = 0; i < Math.min(allLinks.length, 5); i++) {
    const text = await allLinks[i].textContent();
    const href = await allLinks[i].getAttribute('href');
    console.log(`Link ${i + 1}: "${text}" → ${href}`);
  }

  // Get first row HTML
  const firstRow = page.locator('tbody tr').first();
  const firstRowHTML = await firstRow.innerHTML();
  console.log('\nFirst row HTML:');
  console.log(firstRowHTML);
});

test('Debug Name Links - Store Location Module (Working)', async ({ page }) => {
  await login(page);

  // Navigate to Store Location module (this one works)
  await page.goto(`${BASE_URL}/en/configuration/location`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n=== Debugging Store Location Module (Working Example) ===\n');

  // Check all links in tbody
  const allLinks = await page.locator('tbody a').all();
  console.log(`All Links in tbody: ${allLinks.length}`);
  for (let i = 0; i < Math.min(allLinks.length, 5); i++) {
    const text = await allLinks[i].textContent();
    const href = await allLinks[i].getAttribute('href');
    console.log(`Link ${i + 1}: "${text}" → ${href}`);
  }

  // Get first row HTML
  const firstRow = page.locator('tbody tr').first();
  const firstRowHTML = await firstRow.innerHTML();
  console.log('\nFirst row HTML:');
  console.log(firstRowHTML);
});
