import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const d = await page.evaluate(() => {
  // actions column is pinned right. find a pinned td (position sticky)
  const tds = [...document.querySelectorAll('tbody tr:first-child td')]
  const pinned = tds.find(td => getComputedStyle(td).position === 'sticky')
  const g = el => el ? { bg: getComputedStyle(el).backgroundColor, shadow: getComputedStyle(el).boxShadow.slice(0,60), pos: getComputedStyle(el).position } : null
  return { pinnedTd: g(pinned), found: !!pinned }
})
console.log(JSON.stringify(d))
await browser.close()
