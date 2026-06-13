/**
 * Build artifact verification test.
 *
 * IMPORTANT: Run `build` before this test suite:
 *   npx pnpm@9 --filter @fluent-kit/ui build
 *
 * This test reads already-built dist files; it does NOT trigger a build.
 * Fails fast with a clear message if files are missing.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const DIST = resolve(__dirname, '../../dist')

const REQUIRED_FILES = [
  'index.js',
  'index.cjs',
  'index.d.ts',
  'styles.css',
  'rhf/index.js',
  'rhf/index.cjs',
  'rhf/index.d.ts',
]

describe('Build artifacts — dist/ completeness', () => {
  for (const file of REQUIRED_FILES) {
    it(`dist/${file} exists (run build first if this fails)`, () => {
      const fullPath = resolve(DIST, file)
      expect(
        existsSync(fullPath),
        `dist/${file} not found at ${fullPath} — run: npx pnpm@9 --filter @fluent-kit/ui build`,
      ).toBe(true)
    })
  }
})

describe('Build artifacts — .d.ts leak test', () => {
  it('dist/index.d.ts does not leak @tanstack import paths', () => {
    const dtsPath = resolve(DIST, 'index.d.ts')
    if (!existsSync(dtsPath)) {
      // Skip gracefully — file-existence test above already caught this
      return
    }
    const content = readFileSync(dtsPath, 'utf8')

    // Strip single-line comments (// ...) and block comments (/* ... */) before checking
    // to avoid false positives from JSDoc like "TanStack Table" in comments.
    const withoutComments = content
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')

    // Must not contain actual TS import/reference to @tanstack paths
    const tanstackImport = /from\s+['"]@tanstack/
    expect(
      tanstackImport.test(withoutComments),
      'dist/index.d.ts leaks @tanstack import — TanStack must be bundled, not referenced in .d.ts',
    ).toBe(false)

    // Must not reference internal/ path segments (internal implementation details)
    const internalRef = /from\s+['"][^'"]*\/internal\//
    expect(
      internalRef.test(withoutComments),
      'dist/index.d.ts leaks internal/ path — check tsup dts bundling',
    ).toBe(false)
  })

  it('dist/rhf/index.d.ts does not leak internal/ paths', () => {
    const dtsPath = resolve(DIST, 'rhf/index.d.ts')
    if (!existsSync(dtsPath)) {
      return
    }
    const content = readFileSync(dtsPath, 'utf8')
    const withoutComments = content
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')

    const internalRef = /from\s+['"][^'"]*\/internal\//
    expect(
      internalRef.test(withoutComments),
      'dist/rhf/index.d.ts leaks internal/ path',
    ).toBe(false)
  })
})

describe('Build artifacts — font files (C1 regression guard)', () => {
  const DIST_FILES = resolve(DIST, 'files')

  it('dist/files/ directory exists', () => {
    expect(
      existsSync(DIST_FILES),
      'dist/files/ missing — run: npx pnpm@9 --filter @fluent-kit/ui build',
    ).toBe(true)
  })

  it('dist/files/ contains at least one .woff2 font', () => {
    if (!existsSync(DIST_FILES)) return
    const woff2Files = readdirSync(DIST_FILES).filter((f) => f.endsWith('.woff2'))
    expect(
      woff2Files.length,
      `dist/files/ has no .woff2 files — copy-fonts.mjs may have failed`,
    ).toBeGreaterThanOrEqual(1)
  })

  it('every url(./files/X) in dist/styles.css has X present in dist/files/', () => {
    const cssPath = resolve(DIST, 'styles.css')
    if (!existsSync(cssPath) || !existsSync(DIST_FILES)) return

    const css = readFileSync(cssPath, 'utf8')
    const urlRe = /url\(["']?\.\/files\/([^"')]+\.woff2?)["']?\)/g
    const missing: string[] = []
    let m: RegExpExecArray | null

    while ((m = urlRe.exec(css)) !== null) {
      const filename = m[1]
      if (!existsSync(resolve(DIST_FILES, filename))) {
        missing.push(filename)
      }
    }

    expect(
      missing,
      `dist/styles.css references font files not present in dist/files/: ${missing.join(', ')}`,
    ).toHaveLength(0)
  })
})
