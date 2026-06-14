import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
// measure header vs cell center
const m = await page.evaluate(() => {
  const th = [...document.querySelectorAll('th')].find(t => t.textContent.trim().startsWith('Action'))
  const firstActionCell = (() => {
    const idx = [...document.querySelectorAll('th')].indexOf(th)
    const row = document.querySelector('tbody tr')
    return row ? row.children[idx] : null
  })()
  const c = el => el ? Math.round(el.getBoundingClientRect().left + el.getBoundingClientRect().width/2) : null
  const label = th?.querySelector('span span') || th?.querySelector('span')
  return {
    thCenter: c(th),
    cellCenter: c(firstActionCell),
    labelCenter: c(label),
  }
})
console.log(JSON.stringify(m))
await page.screenshot({ path: 'plans/reports/profiles-action-header.png', clip: { x: 1080, y: 95, width: 360, height: 160 } })
await browser.close()
