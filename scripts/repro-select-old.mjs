import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:5180/profiles', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);

// find any select trigger
const trig = page.locator('[data-slot="select-trigger"]').first();
const cnt = await trig.count();
console.log('old select-trigger count:', cnt);
if (cnt) {
  await trig.click(); await page.waitForTimeout(500);
  const items = page.locator('[data-slot="select-item"]');
  console.log('old items:', await items.count());
  if (await items.count() > 1) { await items.nth(1).click(); }
  await page.waitForTimeout(500);
  await page.mouse.move(900, 760); await page.waitForTimeout(400);
  await shot(page, 'repro-old-after-select');
  // dump trigger computed border
  const tinfo = await page.evaluate(() => {
    const t = document.querySelector('[data-slot="select-trigger"]');
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { focusedIsTrigger: document.activeElement === t, borderColor: cs.borderColor, boxShadow: cs.boxShadow, state: t.getAttribute('data-state') };
  });
  console.log(JSON.stringify(tinfo, null, 2));
}
await page.close();
console.log('done');
process.exit(0);
