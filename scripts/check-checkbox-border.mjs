import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const d = await page.evaluate(() => {
  const td = document.querySelector('tbody tr td:first-child')
  return { borderBottom: getComputedStyle(td).borderBottomWidth, color: getComputedStyle(td).borderBottomColor }
})
console.log(JSON.stringify(d))
await page.screenshot({ path: 'plans/reports/checkbox-border.png', clip: { x: 220, y: 95, width: 360, height: 200 } })
await browser.close()
