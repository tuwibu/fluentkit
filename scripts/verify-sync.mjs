import { chromium } from 'playwright';

const OUT = 'plans/260613-2201-component-sync/reports';
const NEW = 'http://localhost:5173/profiles';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(NEW, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2200);
await shot(page, 'sync-base');

// hover a row action to trigger lib Tooltip
try {
  const del = page.locator('button[aria-label^="Delete "]').first();
  await del.hover();
  await page.waitForTimeout(900);
  const tip = await page.locator('[role="tooltip"]').count();
  console.log('tooltip role count:', tip);
  await shot(page, 'sync-tooltip');
} catch (e) { console.log('tooltip err', String(e).slice(0,150)); }

// pagination present?
const pag = await page.evaluate(() => document.body.innerText.includes('Rows per page') || document.body.innerText.includes('Showing'));
console.log('pagination text present:', pag);

await page.close();
console.log('done');
process.exit(0);
