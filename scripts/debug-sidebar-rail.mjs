import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'plans/reports'
mkdirSync(OUT, { recursive: true })

const RAIL = 'aside[data-slot="sidebar"] span[data-instant]'
const ACTIVE = 'aside[data-slot="sidebar"] [data-active="true"]'
const ASIDE = 'aside[data-slot="sidebar"]'
const TOGGLE = 'header button[aria-label="Collapse sidebar"], header button[aria-label="Expand sidebar"]'

async function measure(page, tag) {
  return await page.evaluate(({ RAIL, ACTIVE, ASIDE }) => {
    const rail = document.querySelector(RAIL)
    const active = document.querySelector(ACTIVE)
    const aside = document.querySelector(ASIDE)
    const r = rail?.getBoundingClientRect()
    const a = active?.getBoundingClientRect()
    const s = aside?.getBoundingClientRect()
    const railMid = r ? r.top + r.height / 2 : null
    const activeMid = a ? a.top + a.height / 2 : null
    return {
      asideWidth: s ? Math.round(s.width) : null,
      railTop: r ? Math.round(r.top) : null,
      railHeight: r ? Math.round(r.height) : null,
      railMid: railMid != null ? Math.round(railMid) : null,
      railVisible: !!rail,
      railInstant: rail?.getAttribute('data-instant'),
      activeMid: activeMid != null ? Math.round(activeMid) : null,
      activeText: active?.textContent?.trim()?.slice(0, 20) ?? null,
      misalign: railMid != null && activeMid != null ? Math.round(railMid - activeMid) : null,
    }
  }, { RAIL, ACTIVE, ASIDE })
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' })
await page.waitForSelector(ASIDE)
await page.waitForTimeout(400)

const log = []
log.push(['expanded(initial)', await measure(page, 'expanded')])
await page.locator(ASIDE).screenshot({ path: `${OUT}/sidebar-1-expanded.png` })

// collapse
await page.click(TOGGLE)
await page.waitForTimeout(50)
log.push(['collapsed(+50ms)', await measure(page)])
await page.waitForTimeout(400)
log.push(['collapsed(+450ms)', await measure(page)])
await page.locator(ASIDE).screenshot({ path: `${OUT}/sidebar-2-collapsed.png` })

// expand again
await page.click(TOGGLE)
await page.waitForTimeout(50)
log.push(['expanded(+50ms)', await measure(page)])
await page.waitForTimeout(400)
log.push(['expanded(+450ms)', await measure(page)])
await page.locator(ASIDE).screenshot({ path: `${OUT}/sidebar-3-expanded-again.png` })

// collapse once more to confirm
await page.click(TOGGLE)
await page.waitForTimeout(450)
log.push(['collapsed(again)', await measure(page)])

for (const [tag, m] of log) {
  console.log(tag.padEnd(20), JSON.stringify(m))
}
await browser.close()
