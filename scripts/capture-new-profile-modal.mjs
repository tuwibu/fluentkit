import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
// open New profile modal
await page.click('button:has-text("New profile")')
await page.waitForTimeout(600)
const dialog = page.locator('[role="dialog"]').first()
await dialog.screenshot({ path: 'plans/reports/new-profile-modal-block.png' })
await browser.close()
console.log('done')
