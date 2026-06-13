// UI comparison capture: original app (5180/profiles) vs demo (5173).
// ATTACH mode — connects to an already-running Edge/Chrome on CDP 9222.
// Usage: node scripts/ui-compare.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT = resolve('plans/reports/ui-compare-260613')
mkdirSync(OUT, { recursive: true })

const browser = await chromium.connectOverCDP('http://localhost:9222')
const ctx = browser.contexts()[0] ?? (await browser.newContext())

async function shot(page, name) {
  const p = resolve(OUT, name)
  await page.screenshot({ path: p, fullPage: true })
  console.log('saved', p)
}

// ---------- Original app: 5180/profiles (login if needed) ----------
const orig = await ctx.newPage()
await orig.setViewportSize({ width: 1600, height: 1000 })
await orig.goto('http://localhost:5180/profiles', { waitUntil: 'networkidle' }).catch(() => {})
await orig.waitForTimeout(1500)

const pwd = orig.locator('input[type="password"]')
if (await pwd.count()) {
  console.log('login form detected on 5180 — signing in')
  // username field = first text/email input before the password field
  const userField = orig.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first()
  await userField.fill('admin').catch(() => {})
  await pwd.first().fill('Hcm@@123').catch(() => {})
  // submit — try the form's button (any type), then Enter as fallback
  const submit = orig.locator('form button, button').last()
  if (await submit.count()) await submit.click().catch(() => {})
  await pwd.first().press('Enter').catch(() => {})
  // wait until we leave /login (max ~8s)
  await orig.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 8000 }).catch(() => {})
  await orig.waitForTimeout(1500)
  await orig.goto('http://localhost:5180/profiles', { waitUntil: 'networkidle' }).catch(() => {})
  await orig.waitForTimeout(2500)
}
console.log('orig url:', orig.url())
await shot(orig, 'orig-profiles.png')

// ---------- Demo: 5173 screens ----------
const demoRoutes = [
  ['demo-profiles.png', 'http://localhost:5173/profiles'],
]
const demo = await ctx.newPage()
await demo.setViewportSize({ width: 1600, height: 1000 })
for (const [name, url] of demoRoutes) {
  await demo.goto(url, { waitUntil: 'networkidle' }).catch(() => {})
  await demo.waitForTimeout(1800)
  await shot(demo, name)
}

await browser.close().catch(() => {}) // disconnect-equiv; leaves spawned Edge process alive via CDP
console.log('DONE')
