import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForSelector('table')
await page.waitForTimeout(500)

const trigger = page.locator('thead th button[aria-haspopup="menu"]').nth(1)
await trigger.click()
await page.waitForTimeout(300)

// highlight the first menu item via keyboard (ArrowDown focuses it)
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(150)

const result = await page.evaluate(() => {
  const item = document.querySelector('[role="menuitem"][data-highlighted], [role="menuitem"]:focus')
  if (!item) return { error: 'no highlighted item' }
  const svg = item.querySelector('svg')
  const cs = getComputedStyle(item)
  const svgCs = svg ? getComputedStyle(svg) : null
  return {
    itemText: item.textContent?.trim().slice(0, 20),
    itemBg: cs.backgroundColor,
    itemColor: cs.color,
    iconColor: svgCs?.color,
    iconMatchesText: svgCs?.color === cs.color,
  }
})
console.log(JSON.stringify(result, null, 0))
await browser.close()
