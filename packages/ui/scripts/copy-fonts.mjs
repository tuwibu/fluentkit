/**
 * copy-fonts.mjs
 * Run AFTER tailwindcss compiles dist/styles.css.
 * Reads dist/styles.css, finds all url(./files/<name>) references,
 * resolves each font file from fontsource node_modules, copies to dist/files/.
 * Exits non-zero and prints missing filenames if any font cannot be found.
 */
import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PACKAGE_ROOT = resolve(__dirname, '..')
const DIST_CSS = join(PACKAGE_ROOT, 'dist', 'styles.css')
const DIST_FILES = join(PACKAGE_ROOT, 'dist', 'files')

// Candidate source dirs — order matters: try variable geist first, then mono
const FONT_SOURCE_DIRS = [
  join(PACKAGE_ROOT, 'node_modules', '@fontsource-variable', 'geist', 'files'),
  join(PACKAGE_ROOT, 'node_modules', '@fontsource', 'geist-mono', 'files'),
  // workspace-level node_modules fallback
  join(PACKAGE_ROOT, '..', '..', 'node_modules', '@fontsource-variable', 'geist', 'files'),
  join(PACKAGE_ROOT, '..', '..', 'node_modules', '@fontsource', 'geist-mono', 'files'),
]

if (!existsSync(DIST_CSS)) {
  console.error(`copy-fonts: dist/styles.css not found at ${DIST_CSS}`)
  console.error('Run build:css first.')
  process.exit(1)
}

const css = readFileSync(DIST_CSS, 'utf8')

// Match url(./files/<filename>) — with or without quotes
const URL_RE = /url\(["']?\.\/files\/([^"')]+\.woff2?)["']?\)/g
const referenced = new Set()
let m
while ((m = URL_RE.exec(css)) !== null) {
  referenced.add(m[1])
}

if (referenced.size === 0) {
  console.log('copy-fonts: no font url() references found in dist/styles.css — nothing to copy.')
  process.exit(0)
}

console.log(`copy-fonts: found ${referenced.size} font reference(s) in dist/styles.css`)

mkdirSync(DIST_FILES, { recursive: true })

const missing = []
let copied = 0

for (const filename of referenced) {
  let found = false
  for (const srcDir of FONT_SOURCE_DIRS) {
    const srcPath = join(srcDir, filename)
    if (existsSync(srcPath)) {
      const destPath = join(DIST_FILES, filename)
      copyFileSync(srcPath, destPath)
      console.log(`  copied: ${filename}`)
      copied++
      found = true
      break
    }
  }
  if (!found) {
    missing.push(filename)
  }
}

if (missing.length > 0) {
  console.error('\ncopy-fonts: FAILED — could not find source for:')
  for (const f of missing) {
    console.error(`  - ${f}`)
  }
  console.error('\nSearched in:')
  for (const d of FONT_SOURCE_DIRS) {
    console.error(`  ${d}`)
  }
  process.exit(1)
}

console.log(`\ncopy-fonts: done — ${copied} font file(s) copied to dist/files/`)
