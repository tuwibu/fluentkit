import { chromium } from 'playwright'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1100,height:800} })).newPage()
await p.goto('http://localhost:5173/profiles', { waitUntil:'networkidle' }); await p.waitForTimeout(900)
const th = p.locator('th:has-text("Name")').first()
const h = th.locator('[data-slot="column-resize-handle"]'); const box = await h.boundingBox()
await p.mouse.move(box.x+3, box.y+box.height/2); await p.mouse.down()
await p.mouse.move(box.x+600, box.y+box.height/2, { steps: 15 }); await p.mouse.up()
await p.waitForTimeout(400)
await p.screenshot({ path:'plans/reports/resize-scroll-1.png', clip:{x:0,y:95,width:1100,height:200} })
// try scroll the overflow-auto right
const scrolled = await p.evaluate(()=>{ const t=document.querySelector('[data-slot="data-table"] table'); const s=t.closest('.overflow-auto'); s.scrollLeft=9999; return s.scrollLeft })
await p.waitForTimeout(300)
await p.screenshot({ path:'plans/reports/resize-scroll-2.png', clip:{x:0,y:95,width:1100,height:200} })
// is there a scrollbar / overflow on ancestors?
const anc = await p.evaluate(()=>{ const t=document.querySelector('[data-slot="data-table"] table'); let el=t.parentElement; const out=[]; while(el && out.length<6){ const cs=getComputedStyle(el); out.push({cls:el.className.slice(0,40), overflowX:cs.overflowX, clientW:el.clientWidth, scrollW:el.scrollWidth}); el=el.parentElement } return out })
console.log(JSON.stringify({ scrolledLeft: scrolled, ancestors: anc }, null, 1))
await b.close()
