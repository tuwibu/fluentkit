import { chromium } from 'playwright'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1280,height:850} })).newPage()
await p.goto('http://localhost:5173/profiles', { waitUntil:'networkidle' }); await p.waitForTimeout(900)
// user card inset
const uc = await p.evaluate(() => { const el=document.querySelector('[data-slot="user-card-trigger"]'); if(!el) return null; const cs=getComputedStyle(el); return { ml:cs.marginLeft, mr:cs.marginRight } })
// pagination gap
const pg = await p.evaluate(() => { const nav=document.querySelector('[data-slot="pagination"] nav'); return nav?getComputedStyle(nav).gap:null })
await p.screenshot({ path:'plans/reports/misc-fixes.png', clip:{x:0,y:780,width:760,height:60} })
console.log(JSON.stringify({ userCard: uc, paginationGap: pg })); await b.close()
