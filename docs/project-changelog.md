# Project Changelog — fluentui-react

All significant changes to this project are documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [0.1.0] — 2026-06-13

### Initial Release

First stable release of `@tuwibu/fluentkit` component library and demo app.

#### Added

**Primitives (16 components)**
- `Button` — action button with variants (primary, secondary, ghost)
- `Input` — text input with label, placeholder, error state
- `Select` — dropdown select with search
- `Checkbox` — checkbox with label
- `Switch` — toggle switch
- `Card` — container with padding and border
- `Label` — form label (accessible)
- `Badge` — small label/tag
- `Tag` — tag with optional close button
- `Textarea` — multi-line text input
- `Separator` — visual divider
- `Skeleton` — loading placeholder
- `Tooltip` — hover tooltip
- `Popover` — floating popover panel
- `Dropdown-Menu` — dropdown menu with items
- `Tabs` — tabbed interface
- `Sheet` — bottom sheet / side panel
- `Modal` (primitive) — unstyled dialog base

**Composites (9 components)**
- `DataTable<T>` — data table with sorting, filtering, pagination (TanStack Table core)
- `Modal` (high-level) — dialog facade (Radix Popover core)
- `FormField` — form field container (label + error + input wrapper)
- `Input` (composite) — controlled input with FormField integration
- `Select` (composite) — controlled select with FormField integration
- `SidebarNav` — sidebar navigation with active state
- `SegmentedControl` — button group / toggle group
- `DetailDrawer` — side panel drawer for detail view
- `DateRangePopover` — date range picker with calendar

**Design System**
- Design tokens (colors, spacing, typography, shadows, radius) as CSS custom properties
- Light/dark theme switching (data-theme attribute)
- Fluent/Windows-11 color palette
- Geist Sans + Mono fonts (bundled via @fontsource)
- Compiled CSS output (dist/styles.css) — zero Tailwind config required in consumer apps

**React Hook Form Integration**
- `@tuwibu/fluentkit/rhf` subpath export
- `FormFieldAdapter<T>` — wrapper for react-hook-form `useController`
- `useFormField()` — context hook for field state (error, touched)
- Optional peer dependencies: react-hook-form, zod

**Build & Tooling**
- tsup configuration (ESM + CJS + .d.ts)
- Tailwind CSS v4.1.10 compilation to single CSS file
- Vitest test runner with 399 tests (100% passed)
- Storybook integration (dev environment)
- ESLint configuration with boundary rules (no store/service/router/axios in lib)
- TypeScript strict mode

**Demo App**
- 5 sample screens (Dashboard, Users, Products, Invoices, Profile)
- React Router v7 setup
- TanStack Query integration (data fetching)
- Mock Service Worker (MSW) for API mocking
- API envelope contract (`{ success, data?, message? }`)
- axios wrapper with automatic envelope unwrapping
- 17 tests (100% passed)

**Documentation**
- Package README (`packages/ui/README.md`) with install & usage guide
- This changelog
- System architecture documentation
- Code standards document
- Codebase summary

#### Design Decisions

- **Two-tier architecture:** Public facade (config-driven props) + private headless core (TanStack, Radix). Allows safe updates to underlying libraries.
- **No global state in lib:** All state via props + callbacks. Consumer apps free to choose Redux, Zustand, TanStack Query, etc.
- **Compiled CSS:** Single `styles.css` output. Zero PostCSS or Tailwind configuration needed in consumer apps.
- **RHF as optional subpath:** Keeps main lib unopinionated on forms. Consumer may use RHF, Formik, plain state, or others.
- **ESLint boundary enforcement:** Prevents accidental coupling (store, axios, router in lib).
- **TDD for public API:** All props and callbacks tested before release.

#### Known Limitations

- **Windowed pagination:** TanStack Virtual integration ready in DataTable code, but pagination not wired. Deferred to M3 when performance audit needed.
- **npm registry:** Package is installable locally (workspace: *) in monorepo. Public npm publish deferred to phase 9 (requires registry setup + CI).
- **Storybook deploy:** Storybook runs locally (`pnpm storybook`, port 6006). Static hosting deferred to CI setup.
- **Changelog automation:** Manual entries for now. Automated changelog generation (via commitlint + conventional-changelog) deferred to CI.

#### Testing

- **Unit tests:** 399 tests in lib (vitest)
  - All primitives: render, props, interactions, accessibility
  - All composites: facade contract, callback behavior
  - Utilities: class merging, CVA variants
- **Integration tests:** FormField + Input, DataTable + pagination, etc.
- **Compile gate:** `vitest --typecheck` — full TypeScript validation
- **Coverage:** Focused on public API (props, callbacks), not internal headless core mechanics

#### Browser & environment support

- **React:** 18.2.0+
- **Node:** 18.x+ (build)
- **Browsers:** Evergreen (Chrome, Firefox, Safari, Edge latest)
- **Mobile:** Responsive design (Tailwind); tested on iOS Safari, Android Chrome

---

## Roadmap (future releases)

### Phase 9: npm publish + CI/CD (0.2.0)

- [ ] Public npm registry setup (optional: private or GitHub Packages)
- [ ] CI/CD pipeline (.github/workflows/release.yml)
- [ ] NPM_TOKEN secret management
- [ ] Automated version bumping (conventional-changelog)
- [ ] Storybook static deploy (Vercel / Netlify)
- [ ] Package status badge (npm version, downloads)

### Phase 10: Windowed pagination (0.2.0 or M3)

- [ ] Wire TanStack Virtual into DataTable (rows only, not columns)
- [ ] Performance benchmark: render 10k rows
- [ ] Memory profile test
- [ ] UX validation: scroll smoothness

### Phase 11: Extended component library (0.3.0+)

- [ ] Breadcrumbs, Pagination, Stepper
- [ ] Tree view, Accordion
- [ ] Rich text editor (optional)
- [ ] Date picker (standalone, not popover)
- [ ] Time picker
- [ ] Color picker

### Phase 12: Accessibility audit (0.3.0)

- [ ] WCAG 2.1 AA full audit
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation pass (Tab, Arrow, Enter, Escape)
- [ ] Axe testing integration (CI)

---

## Format reference

**Sections per release:**
- `Added` — new features, components
- `Changed` — breaking or significant behavior changes
- `Fixed` — bug fixes
- `Removed` — deprecations or deletions
- `Security` — security patches
- `Known Issues` — limitations, deferred work

**Version scheme:** Semantic versioning (MAJOR.MINOR.PATCH)
- 0.x.0 — pre-release (breaking changes allowed)
- 1.0.0+ — stable (semantic versioning enforced)

---

**Last updated:** 2026-06-13 · **Maintainer:** fluentui-react team
