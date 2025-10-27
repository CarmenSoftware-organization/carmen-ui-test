import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'https://carmen-inventory.vercel.app';
const TEST_CREDENTIALS = {
  email: 'newuser2@example.com',
  password: '12345678'
};

export interface AuthTokens {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
  }>;
  token?: string;
}

export async function getAuthTokens(): Promise<AuthTokens> {
  console.log('🔐 Starting browser to get authentication tokens...');

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page: Page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto(`${BASE_URL}/en/sign-in`);
    await page.waitForLoadState('networkidle');

    // Perform login
    await page.getByRole('combobox').filter({ hasText: 'Select a Email' }).click();
    await page.getByRole('option', { name: TEST_CREDENTIALS.email }).click();
    await page.getByTestId('sign-in-button').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('✅ Login successful via browser');

    // Get all cookies
    const cookies = await context.cookies();
    console.log(`✅ Captured ${cookies.length} cookies`);

    // Try to extract token from localStorage or sessionStorage
    let token: string | undefined;
    try {
      const localStorage = await page.evaluate(() => {
        return JSON.stringify(window.localStorage);
      });
      const sessionStorage = await page.evaluate(() => {
        return JSON.stringify(window.sessionStorage);
      });

      console.log('LocalStorage:', localStorage);
      console.log('SessionStorage:', sessionStorage);

      // Try to find token in storage
      const localStorageObj = JSON.parse(localStorage);
      const sessionStorageObj = JSON.parse(sessionStorage);

      token = localStorageObj.token || localStorageObj.access_token ||
              localStorageObj.accessToken ||
              sessionStorageObj.token || sessionStorageObj.access_token ||
              sessionStorageObj.accessToken;

      if (token) {
        console.log('✅ Found token in browser storage:', token.substring(0, 50) + '...');
      }
    } catch (error) {
      console.log('ℹ️ No token found in browser storage');
    }

    await browser.close();

    return {
      cookies,
      token,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
