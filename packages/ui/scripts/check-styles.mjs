/**
 * Build smoke check — verifies dist/styles.css was produced correctly.
 *
 * Usage (run AFTER build:css):
 *   node scripts/check-styles.mjs
 *
 * Exits 0 on pass, 1 on failure. Used by CI and the build smoke vitest.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const STYLES_PATH = resolve(__dirname, '../dist/styles.css')

let passed = true

function check(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.error(`  ✗ ${label}`)
    passed = false
  }
}

console.log('\nBuild smoke check — dist/styles.css\n')

// 1. File exists
check('dist/styles.css exists', existsSync(STYLES_PATH))

if (existsSync(STYLES_PATH)) {
  const css = readFileSync(STYLES_PATH, 'utf8')

  // 2. Contains --primary token (light)
  check('contains --primary: #0078d4 (light token)', css.includes('#0078d4'))

  // 3. Contains --primary dark token
  check('contains --primary: #60cdff (dark token)', css.includes('#60cdff'))

  // 4. At least one compiled Tailwind utility class referencing our tokens
  //    Tailwind v4 emits @property rules and var() refs — look for color-card or bg-card pattern
  const hasUtility =
    css.includes('--color-card') ||
    css.includes('.bg-card') ||
    css.includes('bg-card')
  check('contains compiled color utility (--color-card or .bg-card)', hasUtility)

  // 5. Contains @theme-derived --color-background mapping
  check('contains --color-background mapping', css.includes('--color-background'))

  // 6. Contains font family reference
  check('contains Geist font reference', css.includes('Geist'))

  console.log(`\nFile size: ${(css.length / 1024).toFixed(1)} KB\n`)
}

if (!passed) {
  console.error('FAIL — one or more checks failed. Run `build:css` first.\n')
  process.exit(1)
}

console.log('PASS — all smoke checks passed.\n')
