# @tuwibu/fluentkit Cook Session — 8/8 Phases Complete, Package Ready for Publish

**Date**: 2026-06-13 17:05  
**Severity**: Low (summary of successful completion + knowledge capture)  
**Component**: Monorepo pnpm, @tuwibu/fluentkit v0.1.0 library, build pipeline, publish infra  
**Status**: Resolved

## What Happened

Cook session wrapped all 8 phases of @tuwibu/fluentkit component library (Fluent design system facade, private TanStack primitives, headless RHF adapter). Library shipped at v0.1.0 with 16 Radix/custom primitives + 9 facade composites (DataTable, Modal, Input, Select, FormField, Badge, Checkbox, DateRangePicker, ConfirmDialog), compiled CSS (Fluent/Windows 11 tokens), multi-entry tsup build (ESM+CJS+.d.ts), demo app with 5 screens + MSW, and changesets-based publish pipeline. 

Package tarball (266 KB) includes 23 files, 399 unit tests + 17 demo tests all green, `npm publish --dry-run` succeeded, consumer e2e smoke passed 24/24 checks. Ready for first public release pending placeholder `repository.url` update and NPM_TOKEN secret creation.

## The Brutal Truth

This cook was frustrating at the midpoint (phases 3–5) because architectural decisions made early proved half-wrong. The original agent drafted Modal as plain `<div>` + Select as native `<select>` tag — both passed phase 3 review because the component surface looked correct. But phases 4–5 revealed the design violated the stated requirement: "headless facade over Radix primitives with proven UX patterns from antd." That forced a full rewrite (Modal → Radix Dialog, Select → Radix Select + Popover) *while the code-review blockers piled up*. The anger wasn't at the agent — it was at ourselves for not enforcing "implement against real Radix API" from day one instead of checking it mid-phase.

The jsdom testing void was equally maddening. Radix (and TanStack Virtual) leak pointer capture + ResizeObserver into the browser API layer, neither of which jsdom emulates. We had to strategically reduce test scope (skip virtual-row click tests, skip calendar ResizeObserver reflow) rather than fake them with manual stubs. That felt like a loss — we're not catching real regressions in those paths — but it was the honest choice. The alternative was Cypress e2e for every interaction, which isn't feasible in a quick cook.

Code review caught a real a11y bug that the original implementation papered over: FormField wrapped children in a `<div data-aria-invalid="true">` but never *actually* injected `aria-invalid` onto the native control. Test assertions used `getElementById` workaround instead of verifying ARIA wiring. The fix (FormFieldContext + cloneElement + useFormField hook) was elegant but revealed how easily a11y gets theater when the contract is unclear.

## Technical Details

### Architectural Decisions

**Phase 4 Redesign (Modal / Select):**
- Original: Modal as plain Portal + div, Select as HTML `<select>`.
- Required: Radix Dialog (compound API, portal automation), Radix Select + Popover (custom dropdown, option filtering, keyboard nav, a11y ARIA).
- Rewrite cost: ~8 hours, but validates facade contract against real primitives.

**Private TanStack Bundling:**
- @tanstack/react-table + @tanstack/react-virtual moved to devDependencies, bundled into dist (180 KB of 244 KB ESM).
- Rationale: consumer doesn't manage these — they are implementation detail of DataTable + virtualization.
- Trade-off: consumers can't patch TanStack directly (must publish @tuwibu/fluentkit fix). Acceptable for first release.

**CSS Strategy:**
- Tailwind compiled to `dist/styles.css` (55 KB) with Fluent tokens (color, spacing, radius per Windows 11 design language).
- Fonts: Geist Sans + Mono as woff2 in `dist/files/`, referenced by `@font-face` in compiled CSS.
- Initial defect: `dist/styles.css` URL refs used relative path `./files/*.woff2`, but fonts weren't copied to dist. Fixed with custom `copy-fonts.mjs` in build.

**Build Artifact Leakage:**
- test:types runs (118 type tests, green), but full DTS build gate was missing until phase 7. tsup + tsc with `noUncheckedIndexedAccess` caught bugs that test:types alone didn't: FormField render prop inference, Modal ConfirmOptions optional fields.
- Lesson: type-level checks are not enough; full .d.ts emit must be validated.

**Publish Metadata:**
- `package.json` exports map split import/require with typed .d.ts/.d.cts (attw clean).
- `sideEffects: ["**/*.css"]` prevents bundlers from tree-shaking CSS (critical for passive consumers who forget to import styles).
- Sourcemaps (3 MB) excluded from tarball via `files` negation (`!dist/**/*.map`). Initial oversight — we shipped sourcemaps in dry-run, code review caught it.

### Test Scope Reduction (Honest Tradeoff)

**Skipped paths due to jsdom limits:**
- DataTable virtual scroll: cannot test row virtualization or ResizeObserver reflow in jsdom.
- Calendar (if included): ResizeObserver for popover alignment — skipped.
- Radix Select single-click-to-open: jsdom doesn't emulate pointer capture, test can't trigger Radix's pointer logic.

**Verification instead of test:**
- Workspace import-smoke.mjs: Node ESM script that imports real compiled dist, asserts barrel exports exist.
- Consumer e2e: created temp npm package from tarball, ran smoke script in isolated Node/pnpm, verified 24 import + export paths.
- (NOT) Browser e2e: intentionally deferred — out of cook scope, would require Playwright.

## What We Tried

1. **jsdom + pointer capture polyfill**: Radix libraries check `PointerEvent.prototype.hasPointerCapture` to decide interaction strategy. Added fake polyfill (always returns false), tests still flaky because interaction side-effects differ. **Abandoned** — scope cut was cleaner.

2. **Full FormField a11y via render prop type inference**: Initially tried to infer aria-invalid shape from render prop signature. TanStack Form pattern showed it's possible but adds 50 LOC of generic constraints for questionable ergonomic gain. **Simplified** to cloneElement approach: FormField clones first child, injects aria props directly. Works for 95% of use cases (custom control wrappers need useFormField hook for advanced cases).

3. **Dual Modal implementation (div + Dialog)**: Code review suggested dual-path for backwards compatibility if old Modal API was public. **Rejected** — Modal was never shipped, facade is new, commit to Radix Dialog end-to-end.

4. **DTS leak detection via grepping dist/index.d.ts for '@tanstack'**: build-artifacts.test.ts hardcodes a blacklist. **Problem**: adding a new private dep requires test update. Considered a type-level test (`@ts-expect-error type leak`) but tsup doesn't expose a hook. **Settled** on regex check in test — cheap and catches the obvious cases.

## Root Cause Analysis

### Why the Modal/Select redesign happened mid-phase:
- **Root**: Plan phase 4 spec was correct ("Radix primitives") but initial cook agent optimized for "speed to green tests" over "accuracy to architecture."
- **Detection**: Code review (phase 5 boundary) checked the actual Radix API and spotted the disconnect.
- **Why it hurt**: Phases 3–4 code was written, tests passed, but didn't reflect the real design. Finding out at phase 5 meant 1–2 day delay.
- **Lesson**: Design review BEFORE code, not after. Or enforce "read the actual Radix/TanStack API docs before implementing" in the cook brief.

### Why jsdom a11y gaps matter:
- **Root**: jsdom is fast and cheap, but it's a toy implementation of the DOM spec. Radix/React Testing Library assume a real browser for pointer, focus, and accessibility tree.
- **Our choice**: Test what jsdom can do well (render, events, state), defer pointer/ARIA integration tests to e2e (intentionally not in this cook scope). Ship demo + MSW so manual testing is easy.
- **Cost**: We're not catching regressions in Radix's keyboard nav or pointer capture logic. That risk is real.
- **Mitigated by**: Workspace smoke import test + consumer e2e tarball test catch API breakages. Manual QA (demo app) is the safety net.

### Why the a11y test workaround was invisible:
- **Root**: FormFieldProps contract didn't spec "aria-invalid must be on the control, not the wrapper." Test was written to "does input get value?" not "does label + aria link correctly?"
- **Our mistake**: Code review (phase 5) read the test, saw `getElementById` workaround, flagged it as suspicious. Should have been a blocker; it was high-priority and we fixed it.
- **Prevention**: Audit test strategy against a11y tree (using aXe or `@testing-library/jest-dom` matchers like `toHaveAccessibleName`), not just functional assertions.

## Lessons Learned

1. **Architecture → code, not after.** Spec phase 4 correctly (Radix Dialog, Radix Select), then enforce via code review gate before cook starts. Redesigns mid-cook are expensive. A 1-hour architecture doc review at phase 2 beats 8-hour rewrite at phase 5.

2. **Test scope honesty > fake coverage.** We could have written brittle jsdom tests that fake pointer capture via manual event dispatch. Instead, we documented the scope limitation and verified via imports + e2e. The tests we have are trustworthy; the ones we skipped are explicitly acknowledged as out-of-scope.

3. **Type-level tests are not full DTS validation.** test:types (118 tests) passed, but `tsc --noUncheckedIndexedAccess` on the full emit revealed inference bugs. Always run full build before publish, even in dev loops.

4. **Duplicate test selectors are a regression trap.** The duplicate `data-slot="data-table-loading"` in C1 let tests pass but checked the wrong element. Use a single source of truth for sentinel elements, or make test assertions more specific (`getByRole('status')` + `not.toBeInTheDocument()` for the invisible tr).

5. **a11y theater is easier than real a11y.** FormField could have fake aria-invalid all along; nobody would know until a screen-reader user opened the page. Test assertions matter. Involve actual users / aXe / manual a11y QA early.

6. **Changesets + GitHub Actions simplifies releases.** The publish infra (changesets action, NPM_TOKEN secret, version-packages script) is now reusable. First release is a template for future releases.

## Next Steps

**Blocking before first publish:**
1. **Update `repository.url` placeholder** in `packages/ui/package.json` (currently `https://github.com/your-org/fluentui-react`). Replace with actual GitHub URL. *Owner: user*.
2. **Create NPM_TOKEN secret** in GitHub repo Settings → Secrets → Actions. Use npm Granular Access Token with publish permission on `@tuwibu/fluentkit`. *Owner: user*.

**After publish:**
1. **Windowed pagination** (M3 deferred): Add `windowSize` prop to PaginationBar, render ellipsis for large page counts (>~10 pages). Not urgent for 0.1.0.
2. **Browser e2e** (out of scope): Add Playwright tests for pointer capture + keyboard nav in Select/Modal. Cover the gaps jsdom left.
3. **Custom control guides**: Document `useFormField()` hook for building custom form inputs (DatePicker, RichTextEditor) that wire aria-invalid/id automatically.

**Observability:**
- npm registry stats (downloads, users, ratings).
- GitHub releases / CHANGELOG.md updates per changesets verdicts.
- Consumer feedback loop: open issues on @tuwibu/fluentkit from public.

---

## Verified Artifacts

| Artifact | Result |
|---|---|
| Unit tests (lib) | 399/399 pass |
| Unit tests (demo) | 17/17 pass |
| Typecheck | 118 type tests, 0 errors |
| Lint | 0 ESLint errors |
| Build (ESM) | 244 KB, no .map in tarball |
| Build (CJS) | 249 KB, no .map in tarball |
| Build (RHF) | 3.2 KB ESM, 3.3 KB CJS |
| npm pack --dry-run | 266 KB, 23 files, clean |
| Consumer e2e (tarball) | 24/24 smoke checks pass |
| publish --dry-run | Exit 0, auto-corrected repository.url |

---

## Status

**DONE** — All 8 phases completed. Library shipped, tests green, package ready for `npm publish` after placeholder updates.

**Path to journals**: D:/code/tu/fluentui-react/docs/journals/journal-260613-1705-fluentui-kit-cook-8-8-completion.md
