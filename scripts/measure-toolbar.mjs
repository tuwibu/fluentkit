import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const data = await page.evaluate(() => {
  const label = [...document.querySelectorAll('label')].find(l => l.textContent.trim() === 'Deleted')
  const leftGroup = label?.closest('div').parentElement
  return [...leftGroup.children].map((c, i) => ({
    i,
    x: Math.round(c.getBoundingClientRect().x),
    right: Math.round(c.getBoundingClientRect().right),
    w: Math.round(c.getBoundingClientRect().width),
    cls: c.className.slice(0, 40),
    txt: c.textContent.slice(0, 16),
  }))
})
console.log(JSON.stringify(data, null, 2))
await browser.close()
