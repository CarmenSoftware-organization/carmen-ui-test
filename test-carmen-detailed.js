const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('\n========================================');
  console.log('  CARMEN INVENTORY - DETAILED UI TEST  ');
  console.log('========================================\n');
  
  await page.goto('https://carmen-inventory.vercel.app/en', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  console.log('TEST 1: Navigation Structure');
  console.log('----------------------------');
  const navLinks = await page.locator('nav a, header a').all();
  console.log('Navigation links found:', navLinks.length);
  for (let i = 0; i < navLinks.length; i++) {
    const href = await navLinks[i].getAttribute('href');
    const text = await navLinks[i].textContent();
    console.log('  ' + (i+1) + '. ' + text.trim() + ' -> ' + href);
  }
  
  console.log('\nTEST 2: Main Content Analysis');
  console.log('----------------------------');
  const headings = await page.locator('h1, h2, h3').all();
  console.log('Total headings:', headings.length);
  for (let i = 0; i < Math.min(10, headings.length); i++) {
    const tag = await headings[i].evaluate(el => el.tagName);
    const text = await headings[i].textContent();
    console.log('  ' + tag + ': ' + text.trim());
  }
  
  console.log('\nTEST 3: Interactive Elements');
  console.log('----------------------------');
  const buttons = await page.locator('button').all();
  console.log('Buttons found:', buttons.length);
  for (let i = 0; i < Math.min(5, buttons.length); i++) {
    const text = await buttons[i].textContent();
    const type = await buttons[i].getAttribute('type');
    const className = await buttons[i].getAttribute('class');
    console.log('  Button ' + (i+1) + ': "' + text.trim() + '" [type=' + type + ']');
  }
  
  const inputs = await page.locator('input').all();
  console.log('\nInput fields found:', inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const placeholder = await inputs[i].getAttribute('placeholder');
    const name = await inputs[i].getAttribute('name');
    console.log('  Input ' + (i+1) + ': type=' + type + ', name=' + name + ', placeholder=' + placeholder);
  }
  
  console.log('\nTEST 4: Forms Detection');
  console.log('----------------------------');
  const forms = await page.locator('form').count();
  console.log('Forms found:', forms);
  
  console.log('\nTEST 5: Tables/Lists');
  console.log('----------------------------');
  const tables = await page.locator('table').count();
  const lists = await page.locator('ul, ol').count();
  console.log('Tables:', tables);
  console.log('Lists:', lists);
  
  console.log('\nTEST 6: Page Navigation Test');
  console.log('----------------------------');
  if (navLinks.length > 0) {
    const firstLink = navLinks[0];
    const linkText = await firstLink.textContent();
    const linkHref = await firstLink.getAttribute('href');
    console.log('Clicking first nav link: ' + linkText.trim());
    
    try {
      await firstLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      const newUrl = page.url();
      const newTitle = await page.title();
      console.log('Navigated to: ' + newUrl);
      console.log('New page title: ' + newTitle);
      
      await page.screenshot({ path: 'screenshots/navigation-test.png', fullPage: true });
      console.log('Screenshot saved: screenshots/navigation-test.png');
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      console.log('Successfully navigated back');
    } catch (error) {
      console.log('Navigation test error:', error.message);
    }
  }
  
  console.log('\nTEST 7: Form Interaction Test');
  console.log('----------------------------');
  if (inputs.length > 0) {
    for (let i = 0; i < Math.min(2, inputs.length); i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      if (type !== 'hidden' && type !== 'submit') {
        try {
          await input.fill('Test Value');
          await page.waitForTimeout(500);
          const value = await input.inputValue();
          console.log('Input ' + (i+1) + ' filled successfully: ' + value);
          await page.screenshot({ path: 'screenshots/form-input-' + (i+1) + '.png' });
        } catch (error) {
          console.log('Could not interact with input ' + (i+1));
        }
      }
    }
  }
  
  console.log('\nTEST 8: Responsive Breakpoint Analysis');
  console.log('----------------------------');
  const breakpoints = [
    { name: 'Mobile Small', width: 320, height: 568 },
    { name: 'Mobile Medium', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop Small', width: 1024, height: 768 },
    { name: 'Desktop Medium', width: 1440, height: 900 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ];
  
  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.waitForTimeout(500);
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    const navVisible = await page.locator('nav').isVisible();
    
    console.log('  ' + bp.name + ' (' + bp.width + 'x' + bp.height + ')');
    console.log('    Horizontal scroll: ' + (hasHorizontalScroll ? 'YES (ISSUE)' : 'NO (GOOD)'));
    console.log('    Nav visible: ' + navVisible);
  }
  
  console.log('\nTEST 9: Accessibility Audit');
  console.log('----------------------------');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://carmen-inventory.vercel.app/en', { waitUntil: 'networkidle' });
  
  const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
  console.log('Focusable elements:', focusableElements);
  
  const skipLinks = await page.locator('a[href^="#"]').count();
  console.log('Skip/anchor links:', skipLinks);
  
  const landmarkRoles = await page.locator('[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]').count();
  console.log('ARIA landmark roles:', landmarkRoles);
  
  const altTextIssues = await page.locator('img:not([alt])').count();
  console.log('Images without alt text:', altTextIssues);
  
  const formLabels = await page.locator('label').count();
  const formInputs = await page.locator('input:not([type="hidden"]), textarea, select').count();
  console.log('Form labels:', formLabels + ' / Inputs:', formInputs);
  
  console.log('\nTEST 10: Performance Metrics');
  console.log('----------------------------');
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.fetchStart),
      loadComplete: Math.round(perf.loadEventEnd - perf.fetchStart),
      domInteractive: Math.round(perf.domInteractive - perf.fetchStart)
    };
  });
  
  console.log('DOM Content Loaded:', metrics.domContentLoaded + 'ms');
  console.log('Load Complete:', metrics.loadComplete + 'ms');
  console.log('DOM Interactive:', metrics.domInteractive + 'ms');
  
  console.log('\n========================================');
  console.log('           TEST COMPLETE               ');
  console.log('========================================\n');
  
  await browser.close();
})();
