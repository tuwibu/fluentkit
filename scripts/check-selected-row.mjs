import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// click first row checkbox
await page.locator('tbody tr td:first-child').first().click()
await page.waitForTimeout(300)
const d = await page.evaluate(() => {
  const tr = document.querySelector('tbody tr[data-state="selected"]')
  const firstTd = tr?.querySelector('td')
  return { selected: !!tr, shadow: firstTd ? getComputedStyle(firstTd).boxShadow : null }
})
console.log(JSON.stringify(d))
await page.screenshot({ path: 'plans/reports/selected-row-bar.png', clip: { x: 220, y: 95, width: 700, height: 130 } })
await browser.close()
