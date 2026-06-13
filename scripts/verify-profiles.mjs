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
await shot(page, 'profiles-card-search'); // card wraps toolbar+table+footer; search input styled

// open filter select
try {
  const trig = page.locator('[data-slot="select-trigger"]').first();
  if (await trig.count()) {
    await trig.click(); await page.waitForTimeout(600);
    await shot(page, 'profiles-filter-open');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  }
} catch (e) { console.log('filter err', String(e).slice(0,150)); }

// open New profile drawer
try {
  const btn = page.locator('button', { hasText: 'New profile' }).first();
  await btn.click(); await page.waitForTimeout(800);
  await shot(page, 'profiles-newdrawer-open');
} catch (e) { console.log('drawer err', String(e).slice(0,180)); }

await page.close();
console.log('done');
process.exit(0);
