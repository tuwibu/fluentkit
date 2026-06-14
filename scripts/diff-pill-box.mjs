import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const d = await page.evaluate(() => {
  const row = document.querySelector('tbody tr')
  const cells = [...row.children]
  const group = cells[1].querySelector('span')
  const status = cells[4].querySelector('span')
  const probe = el => { const s = getComputedStyle(el); return { h: Math.round(el.getBoundingClientRect().height), fs: s.fontSize, lh: s.lineHeight, pt: s.paddingTop, pb: s.paddingBottom, bt: s.borderTopWidth, bb: s.borderBottomWidth, box: s.boxSizing, display: s.display } }
  return { group: probe(group), status: probe(status) }
})
console.log(JSON.stringify(d, null, 2))
await browser.close()
