import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = 'plans/260613-1821-multiprofile-ui-library-parity/reports';
const OLD = 'http://localhost:5180';
const NEW = 'http://localhost:5173';
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` }).then(() => console.log('shot', name));

const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0] ?? (await browser.newContext());

async function tryLogin(page) {
  const url = page.url();
  if (!/login|signin/i.test(url)) return;
  console.log('login page detected:', url);
  const user = await page.$('input[name="username"], input[name="email"], input[type="text"]');
  const pass = await page.$('input[type="password"]');
  if (user) await user.fill('admin');
  if (pass) await pass.fill('Hcm@@123');
  const submit = await page.$('button[type="submit"], form button');
  if (submit) await submit.click();
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

async function capture(label, base, path) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  const report = { label, base };
  try {
    await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await tryLogin(page);
    // navigate to /profiles if SPA didn't land there
    if (!page.url().includes('/profiles')) {
      await page.goto(base + '/profiles', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await tryLogin(page);
    }
    report.finalUrl = page.url();
    await shot(page, `${label}-profiles-dark`);
    // dump a snippet of DOM for structural diff
    report.bodyClass = await page.evaluate(() => document.documentElement.className);
    report.hasSidebar = await page.evaluate(() => !!document.querySelector('aside'));
    report.hasMica = await page.evaluate(() => {
      const els = [...document.querySelectorAll('div')];
      return els.some((e) => getComputedStyle(e).backdropFilter.includes('blur'));
    });
    report.headerH = await page.evaluate(() => {
      const h = document.querySelector('header, [class*="winbar"], aside ~ div > div');
      return h ? h.getBoundingClientRect().height : null;
    });
  } catch (e) {
    report.error = String(e).slice(0, 300);
    await shot(page, `${label}-error`).catch(() => {});
  }
  await page.close().catch(() => {});
  return report;
}

const results = [];
results.push(await capture('old', OLD, '/profiles'));
results.push(await capture('new', NEW, '/profiles'));

fs.writeFileSync(`${OUT}/verify-meta.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.disconnect();
