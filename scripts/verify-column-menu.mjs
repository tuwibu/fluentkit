import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'plans/reports'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('http://localhost:5173/profiles', { waitUntil: 'networkidle' })
await page.waitForSelector('table')
await page.waitForTimeout(600)

// header menu triggers
const triggers = page.locator('thead th button[aria-haspopup="menu"]')
const triggerCount = await triggers.count()
console.log('header menu triggers:', triggerCount)

async function colState() {
  return await page.evaluate(() => {
    const ths = Array.from(document.querySelectorAll('thead th'))
    return {
      headerCount: ths.length,
      pinned: ths
        .map((th) => ({
          text: th.textContent?.trim().slice(0, 14),
          pos: getComputedStyle(th).position,
          left: getComputedStyle(th).left,
          right: getComputedStyle(th).right,
        }))
        .filter((c) => c.pos === 'sticky'),
    }
  })
}

console.log('before:', JSON.stringify(await colState()))
await page.screenshot({ path: `${OUT}/colmenu-1-initial.png` })

// open first column menu
if (triggerCount > 0) {
  await triggers.nth(1).click().catch(() => triggers.first().click())
  await page.waitForTimeout(300)
  const menuItems = await page.locator('[role="menuitem"], [role="menuitemcheckbox"]').allInnerTexts()
  console.log('menu items:', JSON.stringify(menuItems))
  await page.screenshot({ path: `${OUT}/colmenu-2-open.png` })

  // click a "Pin to left" item if present
  const pinLeft = page.locator('[role="menuitem"]', { hasText: /pin to left/i })
  if (await pinLeft.count()) {
    await pinLeft.first().click()
    await page.waitForTimeout(300)
    console.log('after pin-left:', JSON.stringify(await colState()))
    await page.screenshot({ path: `${OUT}/colmenu-3-pinned.png` })
  } else {
    console.log('Pin left item NOT found')
    await page.keyboard.press('Escape')
  }

  // hide a column: open another menu, click hide
  await triggers.nth(2).click().catch(() => {})
  await page.waitForTimeout(250)
  const hide = page.locator('[role="menuitem"]', { hasText: /hide column/i })
  const beforeHide = (await colState()).headerCount
  if (await hide.count()) {
    await hide.first().click()
    await page.waitForTimeout(250)
    const afterHide = (await colState()).headerCount
    console.log(`hide column: headers ${beforeHide} -> ${afterHide}`)
  } else {
    console.log('Hide column item NOT found')
    await page.keyboard.press('Escape')
  }
}

await browser.close()
