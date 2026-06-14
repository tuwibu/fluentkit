import { chromium } from 'playwright'

const URL = process.argv[2] ?? 'http://localhost:5173/dashboard'
const OUT = process.argv[3] ?? 'plans/reports'

const viewports = [
  ['mobile-375', { width: 375, height: 812 }],
  ['tablet-768', { width: 768, height: 1024 }],
  ['desktop-1440', { width: 1440, height: 900 }],
]

const browser = await chromium.launch({ headless: true })
const report = []

for (const [name, vp] of viewports) {
  const context = await browser.newContext({ viewport: vp })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  const path = `${OUT}/dashboard-${name}.png`
  await page.screenshot({ path, fullPage: true })

  // Measure overflow + layout signals
  const metrics = await page.evaluate(() => {
    const de = document.documentElement
    const sidebar = document.querySelector('[data-slot="sidebar"]')
    const main = document.querySelector('main')
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      horizontalOverflow: de.scrollWidth > de.clientWidth,
      sidebarWidth: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : null,
      mainWidth: main ? Math.round(main.getBoundingClientRect().width) : null,
    }
  })
  report.push({ name, vp: `${vp.width}x${vp.height}`, ...metrics, path })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
