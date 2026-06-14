import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
for (const w of [1280, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `plans/reports/profiles-toolbar-${w}.png`, clip: { x: 0, y: 58, width: w, height: 80 } })
  await ctx.close()
}
await browser.close()
console.log('done')
