import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const d = await page.evaluate(() => {
  const row = document.querySelector('tbody tr')
  const status = row.children[4].querySelector('span')
  // is there a .text-caption rule applying?
  return { cls: status.className }
})
console.log(d.cls)
await browser.close()
