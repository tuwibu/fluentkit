import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// Sort trigger: the select-composite whose trigger shows "Sort by..."
const ok = await page.evaluate(() => {
  const trigs = [...document.querySelectorAll('[data-slot="select-trigger"]')]
  const sort = trigs.find(t => t.textContent.includes('Sort by'))
  if (!sort) return 'NO_SORT_TRIGGER:' + trigs.map(t=>t.textContent.trim()).join('|')
  sort.click()
  return 'clicked'
})
await page.waitForTimeout(400)
const h = await page.evaluate(() => { const i = document.querySelector('[data-slot="select-search"]'); return i ? Math.round(i.getBoundingClientRect().height) : 'NO_SEARCH' })
console.log(JSON.stringify({ ok, sortSearchH: h }))
await browser.close()
