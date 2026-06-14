import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
// FilterSelect trigger = Platform (first filter). Find by text via toolbar buttons.
const trig = page.locator('button:has-text("Platform")').first()
const tc = await trig.evaluate(el => getComputedStyle(el).cursor)
await trig.click()
await page.waitForTimeout(400)
const oc = await page.evaluate(() => {
  // FilterSelect option = the role option button in the open popover
  const opt = document.querySelector('[role="option"]') || document.querySelector('[data-radix-popper-content-wrapper] button')
  return opt ? getComputedStyle(opt).cursor : 'NO_OPT'
})
console.log(JSON.stringify({ filterTrigger: tc, filterOption: oc }))
await browser.close()
