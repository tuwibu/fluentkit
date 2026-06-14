import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
async function drag(thText, dx) {
  const th = page.locator(`th:has-text("${thText}")`).first()
  const before = await th.evaluate(el => Math.round(el.getBoundingClientRect().width))
  const h = th.locator('[data-slot="column-resize-handle"]')
  const box = await h.boundingBox()
  if(!box) return { thText, before, after: 'NO_HANDLE' }
  await page.mouse.move(box.x+3, box.y+box.height/2)
  await page.mouse.down()
  await page.mouse.move(box.x+dx, box.y+box.height/2, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(250)
  const after = await th.evaluate(el => Math.round(el.getBoundingClientRect().width))
  return { thText, before, after, dx }
}
const grow = await drag('Name', 120)
const proxyShrink = await drag('Proxy', -250)
console.log(JSON.stringify({ grow, proxyShrink }))
await browser.close()
