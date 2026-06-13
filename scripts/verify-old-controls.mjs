import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const OLD = 'http://localhost:5180';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(OLD + '/profiles', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
await shot(page, 'old-profiles-tablecard');

// open first select-trigger (filter)
try {
  const trig = page.locator('[data-slot="select-trigger"]').first();
  if (await trig.count()) {
    await trig.click();
    await page.waitForTimeout(700);
    await shot(page, 'old-filter-select-open');
    await page.keyboard.press('Escape');
  } else { console.log('old: no select-trigger'); }
} catch (e) { console.log('old filter err', String(e).slice(0, 150)); }

await page.close();
console.log('done');
process.exit(0);
