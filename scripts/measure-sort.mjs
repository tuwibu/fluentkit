import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const d = await page.evaluate(() => {
  const w40 = document.querySelector('.w-40')
  const trigger = w40?.querySelector('button,[role="combobox"],[data-slot]')
  const r = el => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), tag: el.tagName, cls: el.className.slice(0,50) } : null
  return { wrapper: r(w40), trigger: r(trigger) }
})
console.log(JSON.stringify(d, null, 2))
await browser.close()
