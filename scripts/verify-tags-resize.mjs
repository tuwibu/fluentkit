import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const d = await page.evaluate(() => {
  const ths = [...document.querySelectorAll('thead th')]
  return ths.map(th => ({ col: th.textContent.trim().slice(0,10), handle: !!th.querySelector('[data-slot="column-resize-handle"]') })).filter(x=>x.col)
})
console.log(JSON.stringify(d))
await browser.close()
