import { chromium } from 'playwright'

const URL = process.argv[2] ?? 'http://localhost:5173/dashboard'
const OUT = process.argv[3] ?? 'plans/reports'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
const page = await context.newPage()
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

// Open the off-canvas drawer via the header hamburger.
await page.click('button[aria-label="Open navigation"]')
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/dashboard-mobile-drawer-open.png` })

const afterOpen = await page.evaluate(() => {
  const sidebar = document.querySelector('[data-slot="sidebar"]')
  const overlay = document.querySelector('[data-slot="sheet-overlay"]')
  return {
    drawerSidebarVisible: !!sidebar && sidebar.getBoundingClientRect().width > 0,
    overlayPresent: !!overlay,
  }
})

// Select a nav item → drawer should close + route changes.
await page.click('[data-slot="sidebar"] button:has-text("Users")').catch(() => {})
await page.waitForTimeout(600)
const afterSelect = await page.evaluate(() => ({
  drawerGone: !document.querySelector('[data-slot="sheet-overlay"]'),
  url: location.pathname,
}))

await browser.close()
console.log(JSON.stringify({ afterOpen, afterSelect }, null, 2))
