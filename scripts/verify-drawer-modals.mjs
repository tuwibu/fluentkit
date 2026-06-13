import { chromium } from 'playwright';

const OUT = 'plans/260613-2105-profile-drawer-modals/reports';
const NEW = 'http://localhost:5173/profiles';
const shot = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` }).then(() => console.log('shot', n));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());

async function fresh() { const p = await ctx.newPage(); await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(NEW, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2200); return p; }

// 1. detail drawer — click a row's Name cell
let p = await fresh();
try {
  await p.locator('tbody tr').first().locator('td').nth(2).click();
  await p.waitForTimeout(800);
  await shot(p, 'detail-drawer');
} catch (e) { console.log('drawer err', String(e).slice(0,150)); }
await p.close();

// 2. new profile modal
p = await fresh();
try {
  await p.locator('button', { hasText: 'New profile' }).first().click();
  await p.waitForTimeout(800);
  await shot(p, 'new-profile-modal');
} catch (e) { console.log('newprofile err', String(e).slice(0,150)); }
await p.close();

// 3. assign proxy modal — select rows then BulkBar action
p = await fresh();
try {
  const checks = p.locator('tbody [role="checkbox"], tbody input[type="checkbox"]');
  console.log('checks', await checks.count());
  await checks.nth(0).click(); await checks.nth(1).click();
  await p.waitForTimeout(500);
  await p.locator('button', { hasText: 'Assign proxy' }).first().click();
  await p.waitForTimeout(700);
  await shot(p, 'assign-proxy-modal');
} catch (e) { console.log('proxy err', String(e).slice(0,180)); await shot(p,'assign-proxy-err'); }
await p.close();

console.log('done');
process.exit(0);
