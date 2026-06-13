# Codebase Summary — fluentui-react

## Tổng quan
Monorepo pnpm chứa component library React publishable (`@fluent-kit/ui`) và demo app không publish. Library cung cấp ~25 component UI (16 primitives + 9 composites) với thiết kế Fluent/Windows-11, API config-driven shape như antd, shipping CSS đã compile (zero Tailwind config yêu cầu ở app consumer).

**Repo root:** `D:/code/tu/fluentui-react`  
**Version hiện tại:** 0.1.0 (first release candidate)  
**License:** MIT  
**Status:** 8/8 phase completed (greenfield → usable + publishable)

---

## Cấu trúc workspace

```
fluentui-react/
├── packages/
│   └── ui/                          # publishable library (@fluent-kit/ui)
│       ├── src/
│       │   ├── primitives/          # 16 base components (headless-ready)
│       │   │   ├── badge, button, card, checkbox, dropdown-menu, input,
│       │   │   ├── label, popover, select, separator, sheet, skeleton,
│       │   │   ├── switch, tabs, tag, textarea, tooltip
│       │   │   ├── *.tsx (component)
│       │   │   ├── *.test.tsx (vitest)
│       │   │   └── *.stories.tsx (storybook)
│       │   ├── composites/          # 9 business-logic components (facade + headless core)
│       │   │   ├── data-table/      # Table facade (TanStack Table core)
│       │   │   ├── modal/           # Dialog facade (Radix Popover core)
│       │   │   ├── input/           # Composite form field
│       │   │   ├── select/          # Dropdown facade (Headless core)
│       │   │   ├── form-field/      # Controlled form wrapper
│       │   │   ├── sidebar-nav/     # Sidebar + navigation
│       │   │   ├── segmented-control/ # Button group
│       │   │   ├── detail-drawer/   # Side panel/drawer
│       │   │   └── date-range-popover/ # Date picker (headless)
│       │   ├── lib/                 # Utilities (cn, type exports, tokens)
│       │   ├── rhf/                 # react-hook-form adapter (subpath export)
│       │   ├── styles/              # Tailwind CSS input + compiled output
│       │   └── __tests__/           # Integration tests
│       ├── dist/                    # Build output (tsup ESM+CJS+.d.ts)
│       ├── package.json             # Exports: . (main), ./rhf (subpath), ./styles.css
│       ├── tsup.config.ts           # Build config (ESM+CJS, .d.ts)
│       ├── vitest.config.ts         # Test runner
│       └── README.md                # Package documentation
├── apps/
│   └── demo/                        # Non-publishable demo app (Vite + React Router)
│       ├── src/
│       │   ├── pages/               # 5 sample screens
│       │   ├── components/          # Demo-specific UI
│       │   ├── api/                 # axios envelope contract, MSW mocks
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
├── pnpm-workspace.yaml              # Workspace config (packages/*, apps/*)
├── package.json                     # Root scripts (build, test, lint, dev, storybook)
├── tsconfig.json                    # Shared TypeScript config
├── eslint.config.js                 # ESLint rules (no store/service/router/axios in lib)
└── plans/                           # Implementation planning docs
```

---

## Packages

### `@fluent-kit/ui` (packages/ui)
**Publishable component library.**

**Exports:**
- **Main:** `@fluent-kit/ui` — all components (primitives + composites), ColumnDef, design tokens
- **Subpath:** `@fluent-kit/ui/rhf` — react-hook-form wrapper (FormFieldAdapter, useFormField)
- **Styles:** `@fluent-kit/ui/styles.css` — pre-compiled CSS (Tailwind + Geist font + theme tokens)

**Entry point:** `packages/ui/src/index.ts`

**Key technologies:**
- **React 18.2.0+** (framework)
- **Tailwind CSS 4.1.10** (styling, compiled to single .css file)
- **Radix UI 1.4.3** (headless primitives: Popover, Dropdown, Dialog)
- **TanStack React Table 8.21.3** (DataTable headless core)
- **TanStack React Virtual 3.13.24** (windowed pagination — deferred to roadmap)
- **CVA 0.7.1** (class variants for component states)
- **react-hook-form 7.68.0+** (optional, for RHF adapter)
- **Zod 3.24.0+** (optional, for validation in RHF)
- **Geist font** (bundled via @fontsource-variable, Mono via @fontsource)

**Build chain:**
1. `tsup` → ESM (`.js`), CJS (`.cjs`), TypeScript declarations (`.d.ts`, `.d.cts`)
2. `tailwindcss` → single compiled `styles.css` (no `@import` directives, self-contained)
3. `copy-fonts.mjs` → font files into dist (referenced by @import in generated CSS)

**Test coverage:** 399 tests (vitest), 100% compile gate on typings.

**Boundary (anti-coupling):**
- ✅ Props-only (no global state, no Redux/Zustand)
- ✅ Callback-only (no service calls, no HTTP direct)
- ✅ No router dependencies (no `useNavigate`, no `Link`)
- ✅ No Wails/Electron bridge
- ✅ Headless core not exported (only facade)
- ESLint enforces: `no-store`, `no-services`, `no-wails`, `no-redux`, `no-router`, `no-axios`

**RHF adapter:** `@fluent-kit/ui/rhf` (subpath, optional)
- Exports: `FormFieldAdapter<T>`, `useFormField()`
- Integrates controlled FormField with `useController` (react-hook-form v7)
- Zod validation optional (no peer dependency enforced, but shown in demo)

---

### `demo` (apps/demo)
**Non-publishable demo app** (Vite + React Router 7 + TanStack Query).

**Purpose:** Showcase 5 sample screens (Users, Products, Invoices, Profile, Dashboard) using `@fluent-kit/ui` components.

**Architecture:**
- **API contract:** `src/api/contract.ts` — envelope shape `{ success, data?, message? }`
- **MSW (Mock Service Worker):** `src/api/handlers.ts` — intercepts HTTP GET/POST, returns envelope
- **axios wrapper:** `src/api/client.ts` — unwraps envelope, throws `ApiError` on `success: false`
- **Router:** `src/routes.tsx` — React Router 7 app structure
- **State:** TanStack Query + axios, no Redux (decoupled from lib)

**Key pages:**
- Dashboard (overview + charts via Recharts)
- Users (DataTable + inline sort)
- Products (DataTable + pagination)
- Invoices (DataTable + filters)
- Profile (Form + modal)

**Test:** 17 tests (vitest).

---

## Design & Styling

### Design tokens
Stored in `packages/ui/src/styles/tokens.css` (CSS custom properties):
- **Colors:** Fluent palette (neutral, brand, success, warning, error)
- **Spacing:** 4px grid (0.25rem → 16rem)
- **Typography:** 14px base (Geist Sans / Mono)
- **Shadows:** Fluent elevation (0 → 28)
- **Radius:** 4px, 8px, 12px (smooth corners)
- **Z-index:** modal (1000), popover (999), tooltip (998)

### Compiled styles
- **Input:** `src/styles/index.css` (Tailwind directives + token imports)
- **Output:** `dist/styles.css` (single file, minified, ~150KB)
- **Font bundling:** Geist Variable + Mono imported via `@import url(…)` in generated CSS
- **Theme:** Fluent light/dark (CSS vars, switchable via `data-theme` attribute)

---

## Build & Release

### Build pipeline
```bash
pnpm build              # root: builds all packages/
packages/ui build       # tsup + tailwindcss
```

Output:
- `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/index.d.cts`
- `dist/rhf/index.js`, `dist/rhf/index.cjs`, `dist/rhf/index.d.ts`, `dist/rhf/index.d.cts`
- `dist/styles.css` (pre-compiled, fonts embedded)

### Version & registry
- **Current version:** 0.1.0 (in `packages/ui/package.json`)
- **Registry:** Placeholder `https://github.com/your-org/fluentui-react` (defer public npm publish to roadmap)
- **Scope:** `@fluent-kit` (chosen to avoid collision)
- **Access:** `public` (publishConfig set)

### CI/CD (deferred)
- Placeholder `.github/workflows/release.yml` needed (requires `NPM_TOKEN` secret)
- Dry-run publish tested locally in phase 8; full CI release pending

---

## Testing strategy

### Unit & integration tests
- **Framework:** Vitest (v3.2.6)
- **React utilities:** `@testing-library/react` (v16.3.0)
- **Assertions:** Jest matchers (jsdom environment)
- **Coverage:** 399 tests in lib, 17 in demo
- **Compile gate:** `vitest --typecheck` (full TypeScript validation)

### TDD boundary
- Public API (composites props, facade contract) locked by test
- Headless core (TanStack, Radix internals) mocked in tests
- Snapshots avoided (brittle); behavioral assertions preferred

### Test organization
- `*.test.tsx` colocated with component
- `__tests__/` for integration suites
- MSW for demo HTTP mocking (no axios mocking)

---

## Development workflow

### Local setup
```bash
# Install
pnpm install

# Run lib tests
pnpm --filter ui test

# Run demo app
pnpm dev

# Build all
pnpm build

# Storybook
pnpm storybook
```

### Git & commits
- **Convention:** Conventional Commits (feat, fix, refactor, test, style, perf, ci, build)
- **Scope:** `fluentui-react` or `demo`
- **Example:** `feat(fluentui-react): add DateRangePopover composite`

### Linting
```bash
pnpm lint              # ESLint all packages
packages/ui lint       # Library-specific
```

**Rules enforced:**
- Kebab-case file names
- No store/Redux imports in lib
- No axios/service calls in lib
- No router/wails imports in lib
- TypeScript strict mode

---

## Key decisions

1. **Two-tier architecture:** Public facade (config-driven props) + private headless core (TanStack/Radix). Decouples consumers from core updates.
2. **Compiled CSS:** Ship single `styles.css` (zero Tailwind setup in apps).
3. **RHF adapter as subpath:** Optional, not in main export. Keeps lib unopinionated on forms.
4. **Design tokens as CSS vars:** Themeable (light/dark), not hard-coded.
5. **No global state in lib:** All state passed via props + callbacks. Demo app free to choose TanStack Query + axios.

---

## Status & roadmap

| Item | Status |
|------|--------|
| 16 primitives | ✅ Complete (tested) |
| 9 composites | ✅ Complete (facade + headless core) |
| 5 demo screens | ✅ Complete (MSW + envelope contract) |
| Build (tsup + CSS) | ✅ Complete (ESM+CJS+.d.ts) |
| Dry-run publish | ✅ Complete |
| npm public publish | ⏳ Deferred (requires registry & CI) |
| Windowed pagination (M3) | ⏳ Deferred (TanStack Virtual ready, not wired) |
| Full CI/CD (release.yml) | ⏳ Deferred (needs NPM_TOKEN) |

---

## Quick links

- **Library README:** `packages/ui/README.md`
- **Demo README:** `apps/demo/README.md` (if any)
- **Plan (8 phases):** `plans/260613-0953-fluentui-component-library/plan.md`
- **TypeScript config:** `tsconfig.json` (shared, strict mode)
- **Tailwind config:** `tailwind.config.ts` (in both packages & demo)

---

**Last updated:** 2026-06-13 · **Updated by:** docs-manager · **Phase status:** Complete (8/8)
