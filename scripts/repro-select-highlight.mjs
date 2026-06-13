import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const NEW = 'http://localhost:5173/profiles';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(NEW, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

const trig = page.locator('[data-slot="select-trigger"]').first();
await trig.click();
await page.waitForTimeout(500);
await shot(page, 'repro-1-open');

// click 2nd option
const items = page.locator('[data-slot="select-item"]');
const n = await items.count();
console.log('items:', n);
await items.nth(1).click();
await page.waitForTimeout(600);
await shot(page, 'repro-2-after-select-closed');

// move mouse away to neutral spot, screenshot again (residual highlight?)
await page.mouse.move(700, 750);
await page.waitForTimeout(400);
await shot(page, 'repro-3-mouse-away');

// reopen — is previously selected item auto-highlighted with full bg?
await trig.click();
await page.waitForTimeout(500);
await shot(page, 'repro-4-reopen');

// dump the highlighted/focused item state
const info = await page.evaluate(() => {
  const items = [...document.querySelectorAll('[data-slot="select-item"]')];
  return items.map((el) => ({
    text: el.textContent,
    state: el.getAttribute('data-state'),
    highlighted: el.hasAttribute('data-highlighted'),
    focused: document.activeElement === el,
    bg: getComputedStyle(el).backgroundColor,
  }));
});
console.log(JSON.stringify(info, null, 2));

await page.close();
console.log('done');
process.exit(0);
