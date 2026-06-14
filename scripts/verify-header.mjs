import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
// header bg vs body row bg
const d = await page.evaluate(() => {
  const th = document.querySelector('thead th:nth-child(2)')
  const td = document.querySelector('tbody tr td:nth-child(2)')
  return { headerBg: getComputedStyle(th).backgroundColor, bodyBg: getComputedStyle(td).backgroundColor }
})
// hover a header cell
const th = page.locator('thead th:has-text("Platform")').first()
await th.hover()
await page.waitForTimeout(200)
const hoverBg = await th.evaluate(el => getComputedStyle(el).backgroundColor)
await page.screenshot({ path: 'plans/reports/header-hover.png', clip: { x: 220, y: 95, width: 1060, height: 130 } })
await browser.close()
console.log(JSON.stringify({ ...d, hoverBg }))
