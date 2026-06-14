import { chromium } from 'playwright'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1280,height:800} })).newPage()
await p.goto('http://localhost:5173/profiles', { waitUntil:'networkidle' }); await p.waitForTimeout(800)
await p.hover('[data-slot="user-card-trigger"]').catch(()=>{})
await p.waitForTimeout(200)
await p.screenshot({ path:'plans/reports/usercard.png', clip:{x:0,y:48,width:230,height:80} })
await b.close(); console.log('done')
