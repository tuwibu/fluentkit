import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
const h = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('tbody tr')]
  // row 1 (Bob) has INLINE proxy
  const r = rows[1]
  const cells = [...r.children]
  const H = el => el ? Math.round(el.getBoundingClientRect().height) : null
  return {
    group: H(cells[1].querySelector('span')),
    status: H(cells[4].querySelector('span')),
    proxyInline: H(cells[5].querySelector('span')),
    tags: H(rows[0].children[6].querySelector('span')), // Alice has tags
  }
})
console.log(JSON.stringify(h))
await page.screenshot({ path: 'plans/reports/table-new-5173.png', clip: { x: 220, y: 95, width: 1380, height: 300 } })
await browser.close()
