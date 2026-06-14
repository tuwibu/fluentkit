import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: 'plans/reports/table-new-5173.png', clip: { x: 220, y: 95, width: 1380, height: 360 } })
await browser.close()
console.log('done')
