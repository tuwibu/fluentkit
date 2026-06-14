import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
// handles present?
const handles = await page.locator('[data-slot="column-resize-handle"]').count()
// measure Name column header width before
const nameTh = page.locator('th:has-text("Name")').first()
const before = await nameTh.evaluate(el => Math.round(el.getBoundingClientRect().width))
// drag the Name column handle right by 80px
const h = nameTh.locator('[data-slot="column-resize-handle"]')
const box = await h.boundingBox()
if (box) {
  await page.mouse.move(box.x + 3, box.y + box.height/2)
  await page.mouse.down()
  await page.mouse.move(box.x + 83, box.y + box.height/2, { steps: 8 })
  await page.mouse.up()
}
await page.waitForTimeout(300)
const after = await nameTh.evaluate(el => Math.round(el.getBoundingClientRect().width))
// table-fixed?
const tableLayout = await page.evaluate(() => { const t=document.querySelector('[data-slot="data-table"] table'); return getComputedStyle(t).tableLayout })
await page.screenshot({ path: 'plans/reports/resize-after.png', clip: { x: 220, y: 95, width: 1060, height: 120 } })
await browser.close()
console.log(JSON.stringify({ handles, before, after, delta: after-before, tableLayout }))
