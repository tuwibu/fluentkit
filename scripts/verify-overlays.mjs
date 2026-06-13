import { chromium } from 'playwright';

const OUT = 'plans/260613-1943-ui-parity-css-fixes/reports';
const NEW = 'http://localhost:5173';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(NEW + '/crud', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await shot(page, 'new-crud-base');

// DRAWER + FORM — first button in main content = "+ New User"
try {
  await page.locator('main button').first().click();
  await page.waitForTimeout(900);
  await shot(page, 'new-drawer-form-open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
} catch (e) { console.log('drawer err', String(e).slice(0, 180)); }

// MODAL — click a destructive Delete button in the table
try {
  const del = page.locator('button', { hasText: 'Delete' }).first();
  await del.click();
  await page.waitForTimeout(800);
  await shot(page, 'new-modal-confirm-open');
  await page.keyboard.press('Escape');
} catch (e) { console.log('modal err', String(e).slice(0, 180)); }

await page.close();
console.log('done');
process.exit(0);
