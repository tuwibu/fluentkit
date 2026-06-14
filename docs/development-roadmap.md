# Development Roadmap — fluentui-react

Long-term vision and upcoming phases for the `@tuwibu/fluentkit` component library and ecosystem.

---

## Current Status

| Phase | Name | Status | Completion | Notes |
|-------|------|--------|------------|-------|
| 1 | Workspace & tooling setup | ✅ Complete | 100% | pnpm workspace, Vite, Storybook, ESLint |
| 2 | Design tokens & compiled styles | ✅ Complete | 100% | CSS vars, Tailwind v4, Geist font bundled |
| 3 | Primitives (TDD) | ✅ Complete | 100% | 16 components, 399 tests, all pass |
| 4 | Public API contract (antd-shape) | ✅ Complete | 100% | Props interfaces, facade pattern defined |
| 5 | Composites & headless core (TDD) | ✅ Complete | 100% | 9 components, TanStack Table, Radix core |
| 6 | Sample screens + MSW demo | ✅ Complete | 100% | 5 pages, envelope contract, 17 tests |
| 7 | Build (tsup — ESM+CJS+.d.ts) | ✅ Complete | 100% | Single CSS output, smoke tests pass |
| 8 | Publish dry-run & README | ✅ Complete | 100% | v0.1.0 ready, dry-run successful |

**Total progress:** 8/8 phases (100%) — **v0.1.0 ready for release**

---

## Phase 9: npm publish + CI/CD (Q3 2026)

**Goal:** Public release on npm registry with automated CI/CD pipeline.

**Priority:** P1 (blocks external adoption)

**Status:** Planned

**Deliverables:**
- [ ] npm registry decision (public npm, GitHub Packages, or private)
- [ ] `.github/workflows/release.yml` — automated version bumping + publish
- [ ] `NPM_TOKEN` secret setup in GitHub Actions
- [ ] Automated changelog generation (conventional-changelog)
- [ ] Git tag + release notes automation
- [ ] Package status badges (version, downloads, license)
- [ ] Storybook static export + deploy (Vercel / Netlify)

**Success criteria:**
- Package published to npm with correct version
- CI release triggered on `release/` branch push
- Storybook accessible via public URL
- Version bump on conventional commits (feat, fix)
- Release notes auto-generated from changelog

**Estimated effort:** 1 week

**Dependencies:** None (Phase 8 complete)

**Follow-ups:**
- Monitor npm download metrics
- Set up package security scanning (npm audit)
- Create npm organization (@fluent-kit)

---

## Phase 10: Windowed pagination (0.2.0 or M3)

**Goal:** Wire TanStack Virtual into DataTable for efficient rendering of large datasets (10k+ rows).

**Priority:** P2 (performance optimization)

**Status:** Planned (deferred from Phase 5)

**Context:** TanStack Virtual integration is partially implemented (hooks ready, not wired to DataTable).

**Deliverables:**
- [ ] `useVirtualizer` integration in DataTable internal core
- [ ] Row virtualization (height:40px per row, estimated)
- [ ] Performance benchmark: render 10k rows, measure FPS + memory
- [ ] UX validation: smooth scroll, no jank
- [ ] Update demo DataTable page to test large dataset
- [ ] Backward compatibility: opt-in via prop (e.g., `virtual={true}`)

**Success criteria:**
- DataTable renders 10k rows at 60 FPS
- Memory usage < 50MB (vs. 500MB without virtual)
- Scroll feels smooth (no stuttering)
- API unchanged for non-virtual mode

**Estimated effort:** 1 week

**Dependencies:** Phase 9 (publish) ideally done first, but can run parallel

**Testing:**
- Benchmark test: measure render time, FPS, memory
- Integration test: virtual + sort + filter behavior
- Visual test: scroll performance on various devices

---

## Phase 11: Extended component library (0.3.0+)

**Goal:** Add commonly-needed components (breadcrumbs, pagination, stepper, tree, accordion).

**Priority:** P3 (feature expansion)

**Status:** Planned

**Candidate components (prioritized):**
1. **Breadcrumbs** — navigation trail (high demand)
2. **Pagination** — page navigator (low lift, complements DataTable)
3. **Stepper** — multi-step form wizard
4. **Tree view** — hierarchical data display
5. **Accordion** — collapsible sections
6. **Date picker** — standalone (not popover-based)
7. **Time picker** — complements date picker
8. **Color picker** — optional, medium complexity
9. **Rich text editor** — optional, high complexity (defer to v0.4.0)

**Deliverables (per component):**
- [ ] Props interface (antd-shaped)
- [ ] TDD: full coverage (unit + integration)
- [ ] Storybook story + variants
- [ ] Accessibility audit (WCAG AA)
- [ ] Headless core + facade pattern
- [ ] Demo page (if high-value)

**Success criteria:**
- Each component ≥95% test coverage
- All tests pass (unit + integration + typecheck)
- Zero ESLint violations
- Storybook stories run without errors

**Estimated effort:** 2–3 weeks (for 4–5 components)

**Dependencies:** Phase 9 (publish), optional Phase 10 (perf)

**Phasing:**
- **0.3.0:** Breadcrumbs, Pagination, Stepper (quick wins)
- **0.4.0:** Tree, Accordion, Date picker (medium effort)
- **0.5.0:** Time picker, Color picker (low priority)

---

## Phase 12: Accessibility audit + WCAG 2.1 AA (0.3.0)

**Goal:** Ensure all components meet WCAG 2.1 Level AA standards.

**Priority:** P2 (quality gate for production use)

**Status:** Planned

**Deliverables:**
- [ ] Automated Axe audit (CI integration)
- [ ] Manual screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation pass (Tab, Arrow, Enter, Escape, Home, End)
- [ ] Color contrast audit (≥4.5:1 for normal text, ≥3:1 for large text)
- [ ] Focus management (visible focus indicator, tab order)
- [ ] ARIA labels & descriptions (aria-label, aria-labelledby, aria-describedby)
- [ ] Form accessibility (labels, error messages, required fields)
- [ ] Documentation: accessibility guidelines for consumers

**Success criteria:**
- Axe audit: zero violations (errors)
- Manual testing: keyboard-only navigation works for all components
- Screen reader: all content accessible (tested on at least 2 readers)
- WCAG 2.1 AA conformance statement published

**Estimated effort:** 2 weeks

**Dependencies:** Phase 11 (component expansion)

**Tools:**
- Axe DevTools (automated)
- NVDA (free, Windows)
- JAWS or JAWS trial (paid, Windows)
- VoiceOver (free, macOS/iOS)

---

## Phase 13: Theming system v2 (0.4.0+)

**Goal:** Advanced theming API (custom palettes, font families, spacing scales).

**Priority:** P3 (customization)

**Status:** Planned (future)

**Current state:** Light/dark theme via CSS vars (data-theme attribute). One-size-fits-all Fluent palette.

**Vision:** Support per-brand color palettes, custom fonts, spacing overrides.

**Deliverables:**
- [ ] Theme configuration object (TypeScript)
- [ ] CSS var generation from theme object
- [ ] Runtime theme switching (React context + CSS vars)
- [ ] Preset themes (Fluent, Material, custom)
- [ ] Documentation: theme creation guide

**Example:**
```tsx
import { ThemeProvider, createTheme } from '@tuwibu/fluentkit/theme'

const myTheme = createTheme({
  colors: { primary: '#0078d4', /* ... */ },
  fonts: { sans: 'Segoe UI', mono: 'Fira Code' },
  spacing: { base: 4 } // 4px grid
})

export function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <MyApp />
    </ThemeProvider>
  )
}
```

**Estimated effort:** 2 weeks

**Dependencies:** Phase 12 (foundation)

---

## Phase 14: Component composition utilities (0.4.0+)

**Goal:** Helpers for assembling custom components from primitives.

**Priority:** P4 (nice-to-have)

**Status:** Backlog

**Ideas:**
- Layout components (Flex, Grid, Stack, Spacer)
- Form builder (auto-generate forms from schema)
- Table builder (custom column render functions)
- Modal builder (declarative modal factory)

**Estimated effort:** 1–2 weeks (if needed)

---

## Long-term vision (1.0.0+)

**Stability:** After Phase 9, `@tuwibu/fluentkit` reaches v1.0.0 (stable, semantic versioning enforced).

**Maintenance:** Active maintenance, community contributions welcome.

**Integration targets:**
- Next.js / Remix (SSR support)
- Storybook (CSF 3+, Webpack 5+)
- TailwindCSS plugin ecosystem
- Design tools (Figma plugin, eventually)

**Community:**
- GitHub Discussions for questions
- Issue templates (bug, feature request, discussion)
- Contribution guidelines (CONTRIBUTING.md)
- Code of Conduct

---

## Deferred items (out of scope for 0.1.0)

| Item | Reason | Target Phase |
|------|--------|--------------|
| npm public publish | Registry setup, CI/CD | Phase 9 |
| Windowed pagination | Implementation ready, perf audit deferred | Phase 10 |
| Extended components | Scope reduction for 0.1.0 | Phase 11+ |
| WCAG 2.1 AA audit | Foundation first, audit after | Phase 12 |
| Advanced theming | Simple CSS vars sufficient for 0.1.0 | Phase 13 |
| Figma plugin | Design tool integration (future) | TBD |

---

## Success metrics

### For each phase:

- **Code quality:** 100% ESLint pass, TypeScript strict, ≥95% test coverage
- **Performance:** Compile time <30s, bundle size tracking
- **Accessibility:** Axe audit pass (post-Phase 12), WCAG 2.1 AA goal
- **Documentation:** README, JSDoc, Storybook stories complete
- **Testing:** Unit + integration tests, all green, no skip

### Overall (v1.0.0 readiness):

- ✅ 50+ component library (primitives + composites)
- ✅ Public npm package (>100 weekly downloads)
- ✅ WCAG 2.1 AA compliant
- ✅ Zero critical security vulnerabilities
- ✅ Active community (GitHub issues, discussions)
- ✅ Documented architecture + onboarding guide

---

## Maintenance & support

### Release cycle

- **Minor releases (0.x.0):** quarterly (Feb, May, Aug, Nov)
- **Patch releases (0.x.y):** as-needed (security, critical bugs)
- **Major releases (1.0.0+):** yearly, after Phase 9

### Support periods

- **0.1.x — 0.3.x:** Active development (breaking changes allowed)
- **0.4.0 — 0.9.x:** Stability phase (minimal breaking changes)
- **1.0.0+:** Long-term support (semver enforced)

### Issue triage

- **P1 (blocker):** Security, breaking bug in published version — fixed within 24h
- **P2 (critical):** Feature request with 10+ votes, accessibility issue — fixed within 1 week
- **P3 (normal):** Bug report, enhancement — fixed within 2 weeks
- **P4 (backlog):** Discussion, nice-to-have — no SLA

---

## Stakeholders & communication

**Decision makers:**
- Repo maintainers (TBD)
- Community contributors

**Feedback channels:**
- GitHub Issues (bugs, features)
- GitHub Discussions (questions, ideas)
- Twitter / X (announcements)

**Cadence:**
- Weekly standup (TBD, when team established)
- Monthly roadmap review
- Quarterly release notes + blog post

---

**Last updated:** 2026-06-13 · **Next review:** 2026-09-13 · **Status:** In progress (Phase 8/8 complete, Phase 9 pending)
