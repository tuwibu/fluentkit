/**
 * Token coverage test — reads tokens.css as text and asserts all required
 * CSS variables exist under BOTH :root and .dark selectors.
 *
 * Run: npx pnpm@9 --filter @fluent-kit/ui test
 * Must be GREEN before ship. Add new required vars here when extending the token set.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const TOKENS_PATH = resolve(__dirname, '../../src/styles/tokens.css')

// All required token names — derived from multiprofile-v2 globals.css
const REQUIRED_TOKENS = [
  // Base semantic
  '--background',
  '--background-solid',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  // Charts
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  // Radius
  '--radius',
  // Sidebar
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
  // Win11 Fluent Design tokens
  '--win11-mica',
  '--win11-wallpaper',
  '--win11-card-border',
  '--win11-card-border-bottom',
  '--win11-card-bg',
  '--win11-card-bg-solid',
  '--win11-hover',
  '--win11-active',
  '--win11-subtle',
  '--win11-shadow',
  '--win11-shadow-lg',
  // Win11 control fill tokens
  '--win11-control-bg',
  '--win11-control-border',
  '--win11-control-hover',
  // Win11 pinned column tokens
  '--win11-pinned',
  '--win11-pinned-cell',
  '--win11-pinned-hover',
  '--win11-pinned-selected',
] as const

/**
 * Extract all CSS variable declarations (--foo: ...) within a selector block.
 * Returns a Set of var names found.
 */
function extractVarsInBlock(css: string, selectorPattern: RegExp): Set<string> {
  const vars = new Set<string>()
  // Find the selector block — match balanced braces
  const selectorMatch = css.search(selectorPattern)
  if (selectorMatch === -1) return vars

  let depth = 0
  let inBlock = false
  let blockStart = -1

  for (let i = selectorMatch; i < css.length; i++) {
    if (css[i] === '{') {
      depth++
      if (!inBlock) {
        inBlock = true
        blockStart = i
      }
    } else if (css[i] === '}') {
      depth--
      if (inBlock && depth === 0) {
        const block = css.slice(blockStart, i + 1)
        // Extract all --var-name: declarations
        const varRegex = /(--[\w-]+)\s*:/g
        let m: RegExpExecArray | null
        while ((m = varRegex.exec(block)) !== null) {
          vars.add(m[1])
        }
        break
      }
    }
  }
  return vars
}

describe('Design token coverage', () => {
  let css: string
  let rootVars: Set<string>
  let darkVars: Set<string>

  try {
    css = readFileSync(TOKENS_PATH, 'utf8')
    rootVars = extractVarsInBlock(css, /:root\s*\{/)
    darkVars = extractVarsInBlock(css, /\.dark\s*\{/)
  } catch {
    css = ''
    rootVars = new Set()
    darkVars = new Set()
  }

  it('tokens.css file exists and is non-empty', () => {
    expect(css.length, 'tokens.css must exist and have content').toBeGreaterThan(0)
  })

  it('contains :root block', () => {
    expect(rootVars.size, ':root block must have CSS variables').toBeGreaterThan(0)
  })

  it('contains .dark block', () => {
    expect(darkVars.size, '.dark block must have CSS variables').toBeGreaterThan(0)
  })

  for (const token of REQUIRED_TOKENS) {
    it(`":root" contains ${token}`, () => {
      expect(rootVars.has(token), `Missing in :root: ${token}`).toBe(true)
    })

    it(`".dark" contains ${token}`, () => {
      // --radius only in :root (no change in dark) — intentional
      if (token === '--radius') return
      expect(darkVars.has(token), `Missing in .dark: ${token}`).toBe(true)
    })
  }
})
