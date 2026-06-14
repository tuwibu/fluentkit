import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// single-mode select = Sort (w-fit). Trigger cursor:
const sortTrigger = page.locator('[data-slot="select-composite"] [data-slot="select-trigger"]').first()
const triggerCursor = await sortTrigger.evaluate(el => getComputedStyle(el).cursor)
// open it, read an option cursor
await sortTrigger.click()
await page.waitForTimeout(400)
const itemCursor = await page.evaluate(() => {
  const it = document.querySelector('[data-slot="select-item"]')
  return it ? getComputedStyle(it).cursor : 'NO_ITEM'
})
console.log(JSON.stringify({ triggerCursor, itemCursor }))
await browser.close()
