import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const NEW = 'http://localhost:5173';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(NEW + '/profiles', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2200);
await shot(page, 'new-profiles-tablecard'); // table card visible

// 1. filter select open — first select-trigger on page (toolbar filter)
try {
  const trig = page.locator('[data-slot="select-trigger"]').first();
  if (await trig.count()) {
    await trig.click();
    await page.waitForTimeout(700);
    await shot(page, 'new-filter-select-open');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } else { console.log('no select-trigger on profiles toolbar'); }
} catch (e) { console.log('filter err', String(e).slice(0, 150)); }

// 2. user dropdown + theme select
try {
  await page.locator('aside button').first().click();
  await page.waitForTimeout(700);
  await shot(page, 'new-userdropdown-open');
  // theme select inside the dialog panel
  const themeTrig = page.locator('[role="dialog"] [data-slot="select-trigger"]').first();
  if (await themeTrig.count()) {
    await themeTrig.click();
    await page.waitForTimeout(700);
    await shot(page, 'new-theme-select-open');
  } else {
    console.log('no select-trigger in dropdown; dump panel');
    const html = await page.locator('[role="dialog"]').first().innerHTML().catch(() => '');
    console.log(html.slice(0, 600));
  }
} catch (e) { console.log('dropdown err', String(e).slice(0, 200)); }

await page.close();
console.log('done');
process.exit(0);
