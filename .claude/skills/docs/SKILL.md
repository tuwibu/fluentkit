---
name: docs
description: "Analyze codebase and manage project documentation. Use for doc initialization, updates, summaries, codebase analysis."
user-invocable: true
when_to_use: "Invoke to create, refresh, or audit project documentation."
category: utilities
keywords: [documentation, init, update, summarize]
argument-hint: "init|update|summarize [--preview]"
metadata:
  author: claudekit
  version: "1.3.0"
---

# Documentation Management

Analyze codebase and manage project documentation through scouting, analysis, and structured doc generation.

**IMPORTANT:** Invoke "/project-organization" skill to organize the outputs.

## Default (No Arguments)

If invoked without arguments, use `AskUserQuestion` to present available documentation operations:

| Operation | Description |
|-----------|-------------|
| `init` | Analyze codebase & create initial docs |
| `update` | Analyze changes & update docs |
| `summarize` | Quick codebase summary |

Present as options via `AskUserQuestion` with header "Documentation Operation", question "What would you like to do?".

## Subcommands

| Subcommand | Reference | Purpose |
|------------|-----------|---------|
| `/docs init` | `references/init-workflow.md` | Analyze codebase and create initial documentation |
| `/docs update` | `references/update-workflow.md` | Analyze codebase and update existing documentation |
| `/docs summarize` | `references/summarize-workflow.md` | Quick analysis and update of codebase summary |
| `--preview` flag | `references/flows-workflow.md` | Generate per-domain business-flow diagrams (init/update only; summarize ignores it) |

## Routing

Parse `$ARGUMENTS`:
1. Strip the `--preview` token if present; set **preview intent = true** for this invocation.
2. Match the first remaining word as the subcommand:
   - `init` → Load `references/init-workflow.md` (preview intent carried into Phase 2.5)
   - `update` → Load `references/update-workflow.md` (preview intent carried into Phase 2.5)
   - `summarize` → Load `references/summarize-workflow.md` (`--preview` noted but ignored — no diagram output)
   - empty/unclear → AskUserQuestion (do not auto-run `init`)

## Shared Context

Documentation lives in `./docs` directory:
```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

Use `docs/` directory as the source of truth for documentation.

When authoring or refreshing diagrams in `system-architecture.md`, apply standard SVG layout rules (component spacing, arrow routing, label placement, z-index ordering). Pair with `/preview --diagram` for visual self-review.

**IMPORTANT**: **Do not** start implementing code.
