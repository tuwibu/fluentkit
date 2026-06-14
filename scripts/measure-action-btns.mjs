import { chromium } from 'playwright'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1280,height:800} })).newPage()
await p.goto('http://localhost:5173/profiles', { waitUntil:'networkidle' }); await p.waitForTimeout(800)
const d = await p.evaluate(() => {
  const cell = document.querySelector('tbody tr td:last-child')
  const btns = [...cell.querySelectorAll('button')]
  return btns.map(x=>{const r=x.getBoundingClientRect();return {label:x.getAttribute('aria-label')?.slice(0,12),w:Math.round(r.width),h:Math.round(r.height)}})
})
console.log(JSON.stringify(d)); await b.close()
