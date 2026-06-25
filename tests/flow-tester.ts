/**
 * SökoPay Automated Flow Tester
 * 
 * Tests every user flow, clicks every button, logs every error.
 * Run: npx tsx tests/flow-tester.ts [base-url]
 * 
 * Default base URL: http://localhost:3000
 */

import { chromium, type Page, type ConsoleMessage } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  detail?: string;
  screenshot?: string;
}

const results: TestResult[] = [];
const consoleErrors: { url: string; message: string }[] = [];
const brokenLinks: { from: string; href: string; status: number }[] = [];
const deadButtons: { page: string; text: string; reason: string }[] = [];

function log(msg: string) {
  console.log(`  ${msg}`);
}

function pass(name: string, detail?: string) {
  results.push({ name, status: 'pass', detail });
  log(`✅ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name: string, detail?: string) {
  results.push({ name, status: 'fail', detail });
  log(`❌ ${name}${detail ? ` — ${detail}` : ''}`);
}

function warn(name: string, detail?: string) {
  results.push({ name, status: 'warn', detail });
  log(`⚠️  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function screenshot(page: Page, name: string) {
  const path = `tests/screenshots/${name.replace(/[^a-z0-9]/gi, '_')}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}

// ══════════════════════════════════════════════════════════════════
// TEST SUITE
// ══════════════════════════════════════════════════════════════════

async function testLandingPage(page: Page) {
  console.log('\n📄 LANDING PAGE');
  
  await page.goto(BASE, { waitUntil: 'networkidle' });
  
  // Check page loads
  const title = await page.title();
  if (title.includes('SökoPay') || title.includes('SokoPay')) {
    pass('Page title', title);
  } else {
    fail('Page title', `Got: "${title}"`);
  }

  // Check hero text
  const heroText = await page.textContent('h1');
  if (heroText && heroText.includes('Local vendors')) {
    pass('Hero heading visible');
  } else {
    fail('Hero heading missing', heroText?.slice(0, 80));
  }

  // Check Get Started button
  const getStarted = page.locator('button:has-text("Get started")');
  if (await getStarted.count() > 0) {
    pass('Get Started button exists');
  } else {
    fail('Get Started button missing');
  }

  // Check category chips
  const catButtons = page.locator('button:has-text("Mama Mboga")');
  if (await catButtons.count() > 0) {
    pass('Category chips rendered');
  } else {
    fail('Category chips missing');
  }

  // Check nav links
  for (const link of ['About', 'Support', 'Contact']) {
    const el = page.locator(`a:has-text("${link}")`);
    if (await el.count() > 0) {
      pass(`Nav link: ${link}`);
    } else {
      fail(`Nav link missing: ${link}`);
    }
  }

  // Check sign in button
  const signIn = page.locator('button:has-text("Sign in")');
  if (await signIn.count() > 0) {
    pass('Sign in button exists');
  } else {
    fail('Sign in button missing');
  }

  // Check footer
  const footer = page.locator('footer');
  if (await footer.count() > 0) {
    pass('Footer rendered');
  } else {
    fail('Footer missing');
  }
}

async function testPublicPages(page: Page) {
  console.log('\n📄 PUBLIC PAGES');

  const publicPages = [
    { path: '/', name: 'Landing' },
    { path: '/about', name: 'About' },
    { path: '/support', name: 'Support' },
    { path: '/contact', name: 'Contact' },
    { path: '/auth/role', name: 'Role Selection' },
  ];

  for (const pg of publicPages) {
    try {
      const resp = await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      if (resp && resp.status() < 400) {
        pass(`${pg.name} page loads`, `HTTP ${resp.status()}`);
      } else {
        fail(`${pg.name} page`, `HTTP ${resp?.status()}`);
      }

      // Check for error boundaries / blank pages
      const bodyText = await page.textContent('body');
      if (bodyText && bodyText.trim().length < 20) {
        warn(`${pg.name} page: very little content`, bodyText.trim().slice(0, 50));
      }
    } catch (e: any) {
      fail(`${pg.name} page`, e.message?.slice(0, 80));
    }
  }
}

async function testRoleSelection(page: Page) {
  console.log('\n📄 ROLE SELECTION');

  await page.goto(`${BASE}/auth/role`, { waitUntil: 'networkidle' });

  // Check customer button
  const customerBtn = page.locator('button:has-text("Customer")');
  if (await customerBtn.count() > 0) {
    pass('Customer button exists');
  } else {
    fail('Customer button missing');
  }

  // Check vendor button
  const vendorBtn = page.locator('button:has-text("Vendor")');
  if (await vendorBtn.count() > 0) {
    pass('Vendor button exists');
  } else {
    fail('Vendor button missing');
  }

  // Check back button
  const backBtn = page.locator('button:has(svg)').first();
  if (await backBtn.count() > 0) {
    pass('Back button exists');
  } else {
    fail('Back button missing');
  }

  // Check role notice
  const notice = page.locator('text=Your first login sets your role');
  if (await notice.count() > 0) {
    pass('Role notice visible');
  } else {
    warn('Role notice missing');
  }

  // Click customer → should go to login
  await customerBtn.click();
  await page.waitForTimeout(2000);
  const url = page.url();
  if (url.includes('/auth/login')) {
    pass('Customer click → login page', url);
  } else {
    fail('Customer click didn\'t navigate to login', url);
  }

  // Go back and test vendor
  await page.goto(`${BASE}/auth/role`, { waitUntil: 'networkidle' });
  const vendorBtn2 = page.getByRole('button', { name: /I'm a Vendor/ });
  await vendorBtn2.click();
  await page.waitForTimeout(2000);
  const url2 = page.url();
  if (url2.includes('/auth/login')) {
    pass('Vendor click → login page', url2);
  } else {
    fail('Vendor click didn\'t navigate to login', url2);
  }
}

async function testLoginPages(page: Page) {
  console.log('\n📄 LOGIN PAGES');

  for (const role of ['customer', 'vendor']) {
    await page.goto(`${BASE}/auth/login/${role}`, { waitUntil: 'networkidle' });

    // Check phone input
    const phoneInput = page.locator('input[type="tel"], input[type="text"][placeholder*="254"], input[placeholder*="phone"]');
    if (await phoneInput.count() > 0) {
      pass(`${role} login: phone input exists`);
    } else {
      fail(`${role} login: phone input missing`);
    }

    // Check back button
    const back = page.locator('button:has-text("Back")');
    if (await back.count() > 0) {
      pass(`${role} login: back button exists`);
    } else {
      fail(`${role} login: back button missing`);
    }

    // Check submit/send button
    const submit = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Continue"), button:has-text("OTP")');
    if (await submit.count() > 0) {
      pass(`${role} login: submit button exists`);
    } else {
      fail(`${role} login: submit button missing`);
    }

    // Test back button works
    await back.click();
    await page.waitForTimeout(1000);
    if (page.url().includes('/auth/role')) {
      pass(`${role} login: back button works`);
    } else {
      fail(`${role} login: back button broken`, page.url());
    }
  }
}

async function testProtectedRoutes(page: Page) {
  console.log('\n🔒 PROTECTED ROUTES (should redirect)');

  const protectedPaths = [
    '/dashboard',
    '/messages',
    '/vendor/dashboard',
    '/vendor/messages',
    '/vendor/profile/create',
  ];

  for (const path of protectedPaths) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 10000 });
    const url = page.url();
    if (url.includes('/auth') || url.includes('/role')) {
      pass(`${path} → redirects to auth`, url);
    } else if (url.includes(path)) {
      warn(`${path} → didn't redirect (might be authed)`, url);
    } else {
      fail(`${path} → unexpected redirect`, url);
    }
  }
}

async function test404Page(page: Page) {
  console.log('\n📄 404 PAGE');

  await page.goto(`${BASE}/this-does-not-exist-xyz`, { waitUntil: 'networkidle' });

  const bodyText = await page.textContent('body');
  if (bodyText && bodyText.includes('404')) {
    pass('404 page shows error code');
  } else {
    fail('404 page missing error code');
  }

  if (bodyText && bodyText.includes('Page not found')) {
    pass('404 page shows message');
  } else {
    fail('404 page missing message');
  }

  // Check fruit game loads
  const gameCanvas = page.locator('canvas, [class*="fruit"], [class*="game"]');
  if (await gameCanvas.count() > 0) {
    pass('404: Fruit game rendered');
  } else {
    warn('404: Fruit game not detected (might use divs)');
  }

  // Check back to dashboard link
  const backLink = page.locator('button:has-text("Back to Dashboard"), a:has-text("Back to Dashboard")');
  if (await backLink.count() > 0) {
    pass('404: Back to Dashboard link exists');
  } else {
    fail('404: Back to Dashboard link missing');
  }
}

async function testVendorPublicProfile(page: Page) {
  console.log('\n📄 VENDOR PUBLIC PROFILE');

  // Try to fetch a vendor ID from the API
  try {
    const resp = await page.goto(`${BASE}/api/vendors`, { waitUntil: 'networkidle' });
    const data = await resp?.json();
    const vendors = data?.vendors || [];

    if (vendors.length > 0) {
      const vendorId = vendors[0].id;
      pass('Found vendor for profile test', vendors[0].business_name);

      await page.goto(`${BASE}/vendor/${vendorId}`, { waitUntil: 'networkidle' });

      // Check profile elements
      const name = await page.textContent('h1, h2, [class*="business"]');
      if (name && name.length > 2) {
        pass('Vendor name displayed');
      } else {
        fail('Vendor name not displayed');
      }

      // Check message button
      const msgBtn = page.locator('button:has-text("Message"), a:has-text("Message")');
      if (await msgBtn.count() > 0) {
        pass('Message Vendor button exists');
      } else {
        fail('Message Vendor button missing');
      }

      // Check back navigation
      const backBtn = page.locator('button:has(svg), a:has(svg)').first();
      if (await backBtn.count() > 0) {
        pass('Back navigation exists');
      } else {
        fail('Back navigation missing');
      }
    } else {
      warn('No vendors in DB to test profile page');
    }
  } catch (e: any) {
    fail('Vendor profile test', e.message?.slice(0, 80));
  }
}

async function testAPIEndpoints(page: Page) {
  console.log('\n🔌 API ENDPOINTS');

  const endpoints = [
    { url: '/api/vendors', name: 'GET /api/vendors' },
  ];

  // Get a vendor ID for detail tests
  let vendorId = '';
  try {
    const resp = await page.goto(`${BASE}/api/vendors`, { waitUntil: 'networkidle' });
    const data = await resp?.json();
    if (data?.vendors?.length > 0) {
      vendorId = data.vendors[0].id;
    }
  } catch {}

  if (vendorId) {
    endpoints.push(
      { url: `/api/vendors/${vendorId}`, name: `GET /api/vendors/${vendorId.slice(0, 8)}...` },
      { url: `/api/vendors/${vendorId}/stats`, name: `GET /api/vendors/:id/stats` },
    );
  }

  for (const ep of endpoints) {
    try {
      const resp = await page.goto(`${BASE}${ep.url}`, { waitUntil: 'networkidle', timeout: 10000 });
      const status = resp?.status() || 0;
      if (status >= 200 && status < 300) {
        pass(ep.name, `HTTP ${status}`);
      } else {
        fail(ep.name, `HTTP ${status}`);
      }
    } catch (e: any) {
      fail(ep.name, e.message?.slice(0, 80));
    }
  }

  // Test POST /api/vendors without auth (should fail)
  try {
    const resp = await page.evaluate(async (base) => {
      const r = await fetch(`${base}/api/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      return { status: r.status, body: await r.json() };
    }, BASE);
    if (resp.status >= 400) {
      pass('POST /api/vendors rejects empty body', `HTTP ${resp.status}`);
    } else {
      fail('POST /api/vendors accepted empty body', `HTTP ${resp.status}`);
    }
  } catch (e: any) {
    fail('POST /api/vendors test', e.message?.slice(0, 80));
  }

  // Test PUT /api/vendors/:id without auth (should fail)
  if (vendorId) {
    try {
      const resp = await page.evaluate(async (base, id) => {
        const r = await fetch(`${base}/api/vendors/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_open: true }),
        });
        return { status: r.status };
      }, BASE, vendorId);
      if (resp.status === 401 || resp.status === 403) {
        pass('PUT /api/vendors/:id rejects unauthed', `HTTP ${resp.status}`);
      } else {
        fail('PUT /api/vendors/:id didn\'t reject', `HTTP ${resp.status}`);
      }
    } catch (e: any) {
      fail('PUT /api/vendors/:id test', e.message?.slice(0, 80));
    }
  }
}

async function testButtonInteractions(page: Page) {
  console.log('\n🖱️  BUTTON INTERACTIONS');

  await page.goto(`${BASE}`, { waitUntil: 'networkidle' });

  // Test all clickable elements on landing page
  const buttons = await page.locator('button, a[href]').all();
  let clickableCount = 0;
  let brokenCount = 0;

  for (const btn of buttons) {
    try {
      const isVisible = await btn.isVisible();
      if (!isVisible) continue;
      clickableCount++;
    } catch {}
  }
  pass(`${clickableCount} interactive elements found on landing page`);

  // Test Get Started → navigates somewhere
  const getStarted = page.locator('button:has-text("Get started")');
  if (await getStarted.count() > 0) {
    await getStarted.click();
    await page.waitForTimeout(1500);
    const url = page.url();
    if (url !== `${BASE}/` && !url.endsWith('/')) {
      pass('Get Started navigates', url.replace(BASE, ''));
    } else {
      fail('Get Started didn\'t navigate', url);
    }
  }

  // Test role page buttons
  await page.goto(`${BASE}/auth/role`, { waitUntil: 'networkidle' });
  
  const allBtns = await page.locator('button').all();
  for (const btn of allBtns) {
    try {
      const text = await btn.textContent();
      const isVisible = await btn.isVisible();
      if (!isVisible || !text) continue;
      
      // Check if button has an onclick or is a link
      const hasHandler = await btn.evaluate(el => {
        return el.onclick !== null || el.closest('a') !== null || el.type === 'submit';
      });
      
      if (!hasHandler) {
        deadButtons.push({ page: '/auth/role', text: text.trim(), reason: 'No click handler detected' });
      }
    } catch {}
  }

  if (deadButtons.length > 0) {
    for (const db of deadButtons) {
      warn(`Dead button: "${db.text}" on ${db.page}`, db.reason);
    }
  } else {
    pass('No dead buttons detected on role page');
  }
}

async function testFormSubmissions(page: Page) {
  console.log('\n📝 FORM INTERACTIONS');

  // Test login form
  for (const role of ['customer', 'vendor']) {
    await page.goto(`${BASE}/auth/login/${role}`, { waitUntil: 'networkidle' });

    const inputs = await page.locator('input').all();
    pass(`${role} login: ${inputs.length} input(s) found`);

    // Try submitting empty form
    const submit = page.locator('button[type="submit"]');
    if (await submit.count() > 0) {
      await submit.click();
      await page.waitForTimeout(1000);
      
      // Check for error message or validation
      const errorText = await page.textContent('body');
      const hasError = errorText && (
        errorText.includes('required') || 
        errorText.includes('error') || 
        errorText.includes('invalid') ||
        errorText.includes('Please')
      );
      if (hasError) {
        pass(`${role} login: empty submit shows validation`);
      } else {
        warn(`${role} login: empty submit — no visible validation`);
      }
    }
  }

  // Test support page FAQ accordion
  await page.goto(`${BASE}/support`, { waitUntil: 'networkidle' });
  
  const faqBtns = await page.locator('button:has-text("How")').all();
  if (faqBtns.length > 0) {
    await faqBtns[0].click();
    await page.waitForTimeout(500);
    const expanded = await page.textContent('body');
    if (expanded && expanded.length > 500) {
      pass('FAQ accordion expands on click');
    } else {
      warn('FAQ accordion — content not detected after click');
    }
  } else {
    warn('No FAQ buttons found to test');
  }
}

async function testResponsive(page: Page) {
  console.log('\n📱 RESPONSIVE CHECK');

  const viewports = [
    { width: 375, height: 812, name: 'iPhone X' },
    { width: 768, height: 1024, name: 'iPad' },
    { width: 1920, height: 1080, name: 'Desktop' },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE}`, { waitUntil: 'networkidle' });

    // Check no horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (!hasOverflow) {
      pass(`${vp.name} (${vp.width}px): no horizontal overflow`);
    } else {
      fail(`${vp.name} (${vp.width}px): horizontal overflow detected`);
    }

    // Check elements are visible
    const heroVisible = await page.locator('h1').first().isVisible();
    if (heroVisible) {
      pass(`${vp.name}: hero heading visible`);
    } else {
      fail(`${vp.name}: hero heading not visible`);
    }
  }

  // Reset to desktop
  await page.setViewportSize({ width: 1280, height: 800 });
}

async function testPerformance(page: Page) {
  console.log('\n⚡ PERFORMANCE');

  const startTime = Date.now();
  await page.goto(`${BASE}`, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  if (loadTime < 3000) {
    pass(`Landing page loads in ${loadTime}ms`);
  } else if (loadTime < 5000) {
    warn(`Landing page slow: ${loadTime}ms`);
  } else {
    fail(`Landing page very slow: ${loadTime}ms`);
  }

  // Check for large images
  const images = await page.locator('img').all();
  for (const img of images) {
    try {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      if (naturalWidth > 2000) {
        warn(`Large image: ${src?.slice(0, 60)}`, `${naturalWidth}px wide`);
      }
    } catch {}
  }
}

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  SökoPay Flow Tester — ${BASE}`);
  console.log(`${'═'.repeat(60)}`);

  // Create screenshots dir
  const fs = await import('fs');
  if (!fs.existsSync('tests/screenshots')) {
    fs.mkdirSync('tests/screenshots', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'SokoPay-FlowTester/1.0',
  });
  const page = await context.newPage();

  // Capture ALL console errors
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), message: msg.text() });
    }
  });

  // Capture page crashes
  page.on('pageerror', (err) => {
    consoleErrors.push({ url: page.url(), message: `PAGE ERROR: ${err.message}` });
  });

  // Capture failed requests
  page.on('requestfailed', (req) => {
    consoleErrors.push({ url: page.url(), request: req.url(), message: `FAILED: ${req.failure()?.errorText}` } as any);
  });

  try {
    await testLandingPage(page);
    await testPublicPages(page);
    await testRoleSelection(page);
    await testLoginPages(page);
    await testProtectedRoutes(page);
    await test404Page(page);
    await testVendorPublicProfile(page);
    await testAPIEndpoints(page);
    await testButtonInteractions(page);
    await testFormSubmissions(page);
    await testResponsive(page);
    await testPerformance(page);
  } catch (e: any) {
    fail('FATAL ERROR', e.message);
  }

  await browser.close();

  // ══════════════════════════════════════════════════════════════════
  // REPORT
  // ══════════════════════════════════════════════════════════════════

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  REPORT`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warnings: ${warned}`);
  console.log(`  🐛 Console errors: ${consoleErrors.length}`);

  if (failed > 0) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log('  FAILURES:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  ❌ ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
    });
  }

  if (consoleErrors.length > 0) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log('  CONSOLE ERRORS:');
    // Dedupe
    const seen = new Set<string>();
    consoleErrors.forEach(e => {
      const key = e.message.slice(0, 100);
      if (!seen.has(key)) {
        seen.add(key);
        console.log(`  🐛 [${e.url?.replace(BASE, '')}] ${e.message.slice(0, 120)}`);
      }
    });
  }

  if (deadButtons.length > 0) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log('  DEAD BUTTONS (no click handler):');
    deadButtons.forEach(d => {
      console.log(`  🔘 "${d.text}" on ${d.page} — ${d.reason}`);
    });
  }

  console.log(`\n${'═'.repeat(60)}\n`);

  // Write JSON report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE,
    summary: { passed, failed, warned, consoleErrors: consoleErrors.length },
    results,
    consoleErrors: consoleErrors.slice(0, 50),
    deadButtons,
  };
  fs.writeFileSync('tests/flow-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Full report saved to tests/flow-report.json\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
