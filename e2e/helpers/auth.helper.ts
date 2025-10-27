import { Page } from '@playwright/test';

export const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

export const BASE_URL = 'https://carmen-inventory.vercel.app';

/**
 * Login helper function
 * @param page - Playwright Page object
 * @param credentials - Optional custom credentials
 */
export async function login(
  page: Page,
  credentials = TEST_CREDENTIALS
): Promise<void> {
  await page.goto(`${BASE_URL}/en/login`);

  // Wait for login form to be visible
  await page.waitForSelector('input[type="email"]', { state: 'visible' });

  // Fill in credentials
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);

  // Submit login form
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Logout helper function
 * @param page - Playwright Page object
 */
export async function logout(page: Page): Promise<void> {
  const logoutButton = page.locator(
    'button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")'
  );

  if ((await logoutButton.count()) > 0) {
    await logoutButton.first().click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Navigate to configuration page
 * @param page - Playwright Page object
 */
export async function navigateToConfiguration(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/en/configuration`);
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is logged in
 * @param page - Playwright Page object
 * @returns boolean indicating login status
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const loginIndicators = page.locator(
    'button:has-text("Logout"), [data-testid="user-menu"], .user-profile'
  );

  return (await loginIndicators.count()) > 0;
}

/**
 * Take screenshot with timestamp
 * @param page - Playwright Page object
 * @param name - Screenshot name prefix
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}
