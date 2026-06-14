import { chromium } from 'playwright'
const browser = await chromium.connectOverCDP('http://localhost:9222')
const contexts = browser.contexts()
let page
for (const c of contexts) {
  for (const pg of c.pages()) {
    const u = pg.url()
    if (u.includes('/profiles') || u.includes('localhost:5173')) { page = pg; break }
  }
  if (page) break
}
if (!page) { console.log(JSON.stringify({ error:'no profiles page', urls: contexts.flatMap(c=>c.pages().map(p=>p.url())) })); await browser.close(); process.exit(0) }
const d = await page.evaluate(() => {
  const tbl = document.querySelector('[data-slot="data-table"] table')
  if (!tbl) return { error: 'no table', url: location.href }
  const root = document.querySelector('[data-slot="data-table"]')
  const scroll = tbl.closest('.overflow-auto')
  // walk ancestors, find who clips x and their sizes
  const chain = []
  let el = tbl.parentElement
  while (el && chain.length < 10) {
    const cs = getComputedStyle(el)
    chain.push({ cls: el.className.slice(0,46), ox: cs.overflowX, oy: cs.overflowY, cw: el.clientWidth, sw: el.scrollWidth, ch: el.clientHeight, sh: el.scrollHeight, h: cs.height })
    el = el.parentElement
  }
  const sr = scroll?.getBoundingClientRect()
  return {
    url: location.href,
    tableW: Math.round(tbl.getBoundingClientRect().width),
    rootCls: root?.className,
    scrollCls: scroll?.className,
    scroll: scroll ? { cw: scroll.clientWidth, sw: scroll.scrollWidth, ch: scroll.clientHeight, sh: scroll.scrollHeight, canX: scroll.scrollWidth>scroll.clientWidth, scrollLeft: scroll.scrollLeft, bottom: Math.round(sr.bottom), vh: window.innerHeight } : null,
    chain,
  }
})
console.log(JSON.stringify(d, null, 1))
await browser.close()
