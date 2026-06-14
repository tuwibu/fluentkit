import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForSelector('aside[data-slot="sidebar"]')
await page.waitForTimeout(400)

const TOGGLE = 'header button[aria-label="Collapse sidebar"]'

async function scan(tag) {
  return await page.evaluate(() => {
    const aside = document.querySelector('aside[data-slot="sidebar"]')
    const disabled = aside.querySelectorAll('[aria-disabled="true"]')
    const buttons = aside.querySelectorAll('button[data-active]')
    return {
      disabledCount: disabled.length,
      disabledAreButtons: Array.from(disabled).filter((d) => d.tagName === 'BUTTON').length,
      disabledOpacity: Array.from(disabled).map((d) => getComputedStyle(d).opacity)[0],
      disabledPointer: Array.from(disabled).map((d) => getComputedStyle(d).pointerEvents)[0],
      leafButtons: buttons.length,
    }
  })
}

console.log('expanded:', JSON.stringify(await scan()))
await page.click(TOGGLE)
await page.waitForTimeout(450)
console.log('collapsed:', JSON.stringify(await scan()))
await browser.close()
