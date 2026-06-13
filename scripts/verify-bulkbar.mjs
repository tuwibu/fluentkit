import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const NEW = 'http://localhost:5173/profiles';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(NEW, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2200);

// select a couple of row checkboxes in the table body
try {
  const checks = page.locator('tbody [role="checkbox"], tbody button[role="checkbox"], tbody input[type="checkbox"]');
  const n = await checks.count();
  console.log('row checkboxes:', n);
  if (n >= 2) { await checks.nth(0).click(); await checks.nth(1).click(); await checks.nth(2).click().catch(()=>{}); }
  else {
    // fallback: header select-all
    const head = page.locator('thead [role="checkbox"], thead input[type="checkbox"]').first();
    if (await head.count()) await head.click();
  }
  await page.waitForTimeout(800);
  await shot(page, 'profiles-bulkbar');
} catch (e) { console.log('bulk err', String(e).slice(0,200)); await shot(page,'profiles-bulkbar-err'); }

await page.close();
console.log('done');
process.exit(0);
