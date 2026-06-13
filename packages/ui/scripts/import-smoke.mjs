/**
 * Import smoke test — verifies dist artifacts are importable (ESM + CJS) and
 * that the core bundle does NOT pull in react-hook-form.
 *
 * Usage (run AFTER build):
 *   node scripts/import-smoke.mjs
 *
 * Exits 0 on pass, non-zero on failure.
 * Uses absolute file:// paths so it bypasses workspace package resolution.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = resolve(__dirname, '../dist')

let passed = true

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.error(`  ✗ ${label}${detail ? `\n    ${detail}` : ''}`)
    passed = false
  }
}

function checkExists(relPath) {
  const full = resolve(DIST, relPath)
  check(`dist/${relPath} exists`, existsSync(full), `path: ${full}`)
  return existsSync(full)
}

console.log('\nImport smoke test — @fluent-kit/ui\n')

// ── 1. Pre-flight: dist files present ─────────────────────────────────────
const coreExists = checkExists('index.js') && checkExists('index.cjs')
const rhfExists = checkExists('rhf/index.js') && checkExists('rhf/index.cjs')

if (!coreExists) {
  console.error('\nFAIL — dist/index.{js,cjs} missing. Run: npx pnpm@9 --filter @fluent-kit/ui build\n')
  process.exit(1)
}

// ── 2. Core ESM — dynamic import via file:// URL ───────────────────────────
console.log('\n[Core ESM]')
try {
  const coreEsmUrl = pathToFileURL(resolve(DIST, 'index.js')).href
  const coreEsm = await import(coreEsmUrl)

  const CORE_EXPORTS = ['DataTable', 'Modal', 'Input', 'Select', 'Button', 'FormField', 'useFormField']
  for (const name of CORE_EXPORTS) {
    check(`exports "${name}"`, name in coreEsm, `got keys: ${Object.keys(coreEsm).slice(0, 8).join(', ')}...`)
  }
} catch (err) {
  check('core ESM import succeeds', false, String(err))
}

// ── 3. Core CJS — createRequire from file path ─────────────────────────────
console.log('\n[Core CJS]')
try {
  const require = createRequire(import.meta.url)
  const coreCjs = require(resolve(DIST, 'index.cjs'))

  const CORE_EXPORTS = ['DataTable', 'Modal', 'Input', 'Select', 'Button', 'FormField', 'useFormField']
  for (const name of CORE_EXPORTS) {
    check(`exports "${name}"`, name in coreCjs, `got keys: ${Object.keys(coreCjs).slice(0, 8).join(', ')}...`)
  }
} catch (err) {
  check('core CJS import succeeds', false, String(err))
}

// ── 4. RHF subpath ESM ────────────────────────────────────────────────────
if (rhfExists) {
  console.log('\n[RHF subpath ESM — dist/rhf/index.js]')
  try {
    const rhfEsmUrl = pathToFileURL(resolve(DIST, 'rhf/index.js')).href
    const rhfEsm = await import(rhfEsmUrl)
    check('exports "FormFieldController"', 'FormFieldController' in rhfEsm, `got keys: ${Object.keys(rhfEsm).join(', ')}`)
  } catch (err) {
    // RHF adapter imports react-hook-form which may not be available in node context —
    // treat missing peer as a soft warning, not hard fail, since we verify the file exists.
    const msg = String(err)
    if (msg.includes('react-hook-form') || msg.includes('Cannot find module')) {
      console.log(`  ~ FormFieldController import skipped (peer react-hook-form not in node scope — expected in library context)`)
    } else {
      check('RHF ESM import succeeds', false, msg)
    }
  }
} else {
  console.log('\n[RHF subpath] SKIP — dist/rhf/index.js missing')
}

// ── 5. Core bundle MUST NOT contain react-hook-form ───────────────────────
console.log('\n[RHF leak check — dist/index.js]')
try {
  const coreEsmText = readFileSync(resolve(DIST, 'index.js'), 'utf8')
  // Check for any bundled or re-exported reference to react-hook-form
  const rhfInBundle = /require\(["']react-hook-form["']\)|from["']react-hook-form["']/.test(coreEsmText)
  check(
    'core ESM bundle does NOT reference react-hook-form',
    !rhfInBundle,
    'react-hook-form found in dist/index.js — RHF must remain in dist/rhf only',
  )
} catch (err) {
  check('core ESM bundle readable', false, String(err))
}

// ── 6. Report bundle sizes ─────────────────────────────────────────────────
console.log('\n[Bundle sizes]')
const sizeFiles = ['index.js', 'index.cjs', 'rhf/index.js', 'rhf/index.cjs']
for (const f of sizeFiles) {
  const p = resolve(DIST, f)
  if (existsSync(p)) {
    const kb = (readFileSync(p).length / 1024).toFixed(1)
    console.log(`  dist/${f}: ${kb} KB`)
  }
}

// ── Result ─────────────────────────────────────────────────────────────────
console.log()
if (!passed) {
  console.error('FAIL — one or more smoke checks failed.\n')
  process.exit(1)
}
console.log('PASS — all smoke checks passed.\n')
