/**
 * Build smoke test — asserts dist/styles.css was produced correctly.
 *
 * IMPORTANT: Run `build:css` before this test suite:
 *   npx pnpm@9 --filter @tuwibu/fluentkit build:css
 *
 * This test reads the already-built file; it does NOT trigger a build.
 * Fails fast with a clear message if the file is missing.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, beforeAll } from 'vitest'

const STYLES_PATH = resolve(__dirname, '../../dist/styles.css')

describe('Build smoke — dist/styles.css', () => {
  let css = ''

  beforeAll(() => {
    if (existsSync(STYLES_PATH)) {
      css = readFileSync(STYLES_PATH, 'utf8')
    }
  })

  it('dist/styles.css exists (run build:css first if this fails)', () => {
    expect(
      existsSync(STYLES_PATH),
      `dist/styles.css not found at ${STYLES_PATH} — run: npx pnpm@9 --filter @tuwibu/fluentkit build:css`,
    ).toBe(true)
  })

  it('contains --primary light token (#0078d4)', () => {
    expect(css, 'Light --primary value missing from compiled CSS').toContain('#0078d4')
  })

  it('contains --primary dark token (#60cdff)', () => {
    expect(css, 'Dark --primary value missing from compiled CSS').toContain('#60cdff')
  })

  it('contains compiled color utility mapping (--color-card or bg-card)', () => {
    const hasUtility =
      css.includes('--color-card') || css.includes('.bg-card') || css.includes('bg-card')
    expect(hasUtility, 'No compiled color utility found — @theme mapping may be broken').toBe(true)
  })

  it('contains --color-background Tailwind theme mapping', () => {
    expect(css, '--color-background missing — @theme inline block may not have compiled').toContain(
      '--color-background',
    )
  })

  it('contains Geist font reference', () => {
    expect(css, 'Geist font not found — @fontsource import may have failed').toContain('Geist')
  })
})
