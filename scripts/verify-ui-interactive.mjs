import { chromium } from 'playwright';

const OUT = 'plans/260613-1821-multiprofile-ui-library-parity/reports';
const NEW = 'http://localhost:5173/profiles';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(NEW, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1800);

// 1. user dropdown — first button in <aside>
try {
  await page.locator('aside button').first().click();
  await page.waitForTimeout(700);
  await shot(page, 'new-user-dropdown');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
} catch (e) { console.log('dropdown err', String(e).slice(0, 150)); }

// 2. theme toggle — header button with aria-label about mode
try {
  const toggle = page.locator('button[aria-label*="theme" i]').first();
  await toggle.click();
  await page.waitForTimeout(900);
  await shot(page, 'new-profiles-light');
  console.log('htmlClass after toggle:', await page.evaluate(() => document.documentElement.className));
  await toggle.click(); // back to dark
  await page.waitForTimeout(500);
} catch (e) { console.log('toggle err', String(e).slice(0, 150)); }

await page.close();
console.log('done');
process.exit(0);
