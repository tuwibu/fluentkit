import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 760, height: 600 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
// select first row
await page.locator('tbody tr td:first-child').first().click().catch(()=>{})
// scroll the table horizontally to reveal pinned separator
await page.evaluate(() => { const s=document.querySelector('[data-slot="data-table-scroll"]')||document.querySelector('main .overflow-auto, [class*="overflow-auto"]'); if(s) s.scrollLeft = 400 })
await page.waitForTimeout(400)
await page.screenshot({ path: 'plans/reports/pinned-actions.png' })
await browser.close()
console.log('done')
