import { chromium } from 'playwright'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1100,height:800} })).newPage()
await p.goto('http://localhost:5173/profiles', { waitUntil:'networkidle' }); await p.waitForTimeout(900)
// drag Name wide
const th = p.locator('th:has-text("Name")').first()
const h = th.locator('[data-slot="column-resize-handle"]'); const box = await h.boundingBox()
await p.mouse.move(box.x+3, box.y+box.height/2); await p.mouse.down()
await p.mouse.move(box.x+600, box.y+box.height/2, { steps: 15 }); await p.mouse.up()
await p.waitForTimeout(400)
const d = await p.evaluate(()=>{
  const t=document.querySelector('[data-slot="data-table"] table'); const s=t.closest('.overflow-auto')
  const sr = s.getBoundingClientRect()
  return { scrollClientW: s.clientWidth, scrollSW: s.scrollWidth, canScrollX: s.scrollWidth>s.clientWidth,
    scrollBottom: Math.round(sr.bottom), viewportH: window.innerHeight,
    scrollbarVisibleInViewport: Math.round(sr.bottom) <= window.innerHeight }
})
console.log(JSON.stringify(d))
await b.close()
