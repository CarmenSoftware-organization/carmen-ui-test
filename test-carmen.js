const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('\n=== CARMEN INVENTORY UI TEST REPORT ===\n');
  console.log('Test Target: https://carmen-inventory.vercel.app/en');
  console.log('Test Date:', new Date().toISOString());
  console.log('\n--- 1. PAGE LOADING TEST ---');
  
  try {
    const startTime = Date.now();
    const response = await page.goto('https://carmen-inventory.vercel.app/en', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    
    console.log('Status Code:', response.status());
    console.log('Load Time:', loadTime + 'ms');
    console.log('Final URL:', page.url());
    
    const title = await page.title();
    console.log('Page Title:', title);
    
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
    console.log('Screenshot saved: screenshots/homepage.png');
    
  } catch (error) {
    console.log('Page Load Error:', error.message);
  }
  
  console.log('\n--- 2. CONSOLE ERRORS CHECK ---');
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.waitForTimeout(2000);
  console.log('Console Errors Found:', errors.length);
  if (errors.length > 0) {
    errors.slice(0, 3).forEach((err, i) => console.log('  Error ' + (i+1) + ':', err.slice(0, 100)));
  }
  
  console.log('\n--- 3. NAVIGATION ANALYSIS ---');
  const navLinks = await page.locator('nav a, header a').count();
  console.log('Navigation Links:', navLinks);
  
  const allLinks = await page.locator('a').all();
  console.log('Total Links:', allLinks.length);
  
  console.log('\n--- 4. CONTENT STRUCTURE ---');
  const h1Count = await page.locator('h1').count();
  const h2Count = await page.locator('h2').count();
  const h3Count = await page.locator('h3').count();
  console.log('Headings: H1=' + h1Count + ', H2=' + h2Count + ', H3=' + h3Count);
  
  const buttons = await page.locator('button').count();
  const inputs = await page.locator('input').count();
  console.log('Interactive Elements: Buttons=' + buttons + ', Inputs=' + inputs);
  
  const images = await page.locator('img').count();
  console.log('Images:', images);
  
  console.log('\n--- 5. RESPONSIVE DESIGN TEST ---');
  
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/tablet.png', fullPage: true });
  console.log('Tablet screenshot saved');
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(1000);
  
  console.log('\n--- 6. ACCESSIBILITY CHECKS ---');
  const imagesAll = await page.locator('img').all();
  let withAlt = 0;
  for (const img of imagesAll) {
    const alt = await img.getAttribute('alt');
    if (alt) withAlt++;
  }
  console.log('Images with alt text:', withAlt + '/' + images);
  
  const ariaLabels = await page.locator('[aria-label]').count();
  const roles = await page.locator('[role]').count();
  console.log('ARIA attributes: aria-label=' + ariaLabels + ', role=' + roles);
  
  console.log('\n--- 7. NETWORK REQUESTS ---');
  let requestCount = 0;
  let failedCount = 0;
  
  page.on('request', () => requestCount++);
  page.on('requestfailed', () => failedCount++);
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('Total Requests:', requestCount);
  console.log('Failed Requests:', failedCount);
  
  console.log('\n--- 8. PAGE CONTENT SAMPLE ---');
  const bodyText = await page.locator('body').textContent();
  const preview = bodyText.slice(0, 200).replace(/\s+/g, ' ').trim();
  console.log('Content Preview:', preview + '...');
  
  console.log('\n=== TEST COMPLETE ===\n');
  
  await browser.close();
})();
