# Code Standards — fluentui-react

## Overview

Tài liệu này quy định convention & standards cho codebase monorepo `fluentui-react`. Mục tiêu: consistency, maintainability, giảm technical debt, và enforce decoupling (`packages/ui` không phụ thuộc Redux/service/router/axios).

---

## File & folder structure

### Naming convention

**Kebab-case:** Tất cả file/folder (TypeScript, styles, config)
- ✅ `src/primitives/button.tsx`, `src/composites/data-table.tsx`
- ✅ `src/lib/hooks/use-form-field.ts`, `src/styles/tokens.css`
- ❌ `src/primitives/Button.tsx` (PascalCase — chỉ React component NAME, không filename)
- ❌ `src/lib/useFormField.ts` (camelCase)

**Folders:** Descriptive, plural for collections
- ✅ `src/primitives/`, `src/composites/`, `src/lib/`, `src/styles/`
- ❌ `src/component/`, `src/util/`, `src/style/`

### File size limits

**Target:** Keep individual files under 200 LOC (lines of code, excluding comments/blank)
- **Primitives:** 80–120 LOC (component + minimal logic)
- **Composites:** 150–200 LOC (facade + light state management)
- **Tests:** 100–150 LOC (focused test suite per component)
- **Utilities:** 50–100 LOC (single responsibility)

**If file exceeds 200 LOC:**
1. Extract utility functions → `src/lib/`
2. Extract custom hooks → `src/lib/hooks/`
3. Split composite into sub-components (internal folder)

### Folder organization (components)

```
src/primitives/{component}/
  ├── {component}.tsx              # Component export
  ├── {component}.test.tsx         # Unit tests
  └── {component}.stories.tsx      # Storybook story

src/composites/{component}/
  ├── {component}.tsx              # Facade (public export)
  ├── {component}.test.tsx         # Integration tests
  ├── {component}.stories.tsx      # Storybook story
  └── internal/
      ├── {component}-impl.tsx     # Private headless core
      └── use-{hook}.ts            # Private hooks
```

**Rationale:** Colocate test + story with component. Hide internal/ from public index.ts exports.

---

## TypeScript & types

### Strict mode

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Enforcement:** All `.ts`, `.tsx` must pass `tsc --noEmit` and `vitest --typecheck`.

### Component props interface

**Pattern:**
```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Is button disabled */
  disabled?: boolean
  /** Loading state (shows spinner) */
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={buttonVariants({ variant, size })} {...props} />
  }
)
Button.displayName = 'Button'
```

**Rules:**
- Extend native HTML attributes when possible (ButtonHTMLAttributes, InputHTMLAttributes)
- JSDoc comments on each prop (one-line description)
- Explicit `defaultVariants` for props with defaults
- Always use `React.forwardRef` for primitives (allow consumer ref access)
- Set `displayName` for debugging (DevTools)

### Composite props (config-driven)

**Pattern:**
```tsx
export interface DataTableProps<T> {
  /** Column definitions (antd-like shape) */
  columns: ColumnDef<T>[]
  /** Data rows */
  dataSource: T[]
  /** Pagination config */
  pagination?: {
    pageSize?: number
    current?: number
    total?: number
  }
  /** Callback when pagination/sort/filter change */
  onChange?: (pagination: any, filters: any, sorter: any) => void
  /** Custom className for table root */
  className?: string
  /** Show loading overlay */
  loading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  pagination,
  onChange,
  ...props
}: DataTableProps<T>) {
  // ...
}
```

**Rules:**
- Generics for type safety (T = record type)
- Flatten shape: avoid `<T extends { id: number }>` unless necessary
- Config object (e.g., `pagination`) groups related options
- Callbacks return values app needs, not internal state

### Type exports

**Location:** `src/lib/types.ts`

```tsx
export type { ColumnDef } from '@tanstack/react-table'
export interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
}
export type Size = 'sm' | 'md' | 'lg'
export type Variant = 'primary' | 'secondary' | 'ghost'
```

**Export from:** `src/index.ts` (main) and `src/rhf/index.ts` (subpath)

**Rule:** One source of truth. Consumer imports types from lib, not reimplements.

---

## React patterns

### Hooks

**Custom hook file naming:** `use-{feature}.ts`
- ✅ `src/lib/hooks/use-form-field.ts`
- ❌ `src/lib/hooks/formFieldHook.ts`

**Custom hook pattern:**
```tsx
// src/lib/hooks/use-form-field.ts
import { createContext, useContext } from 'react'

interface FormFieldContextValue {
  fieldName: string
  error?: string
  touched: boolean
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormField() {
  const ctx = useContext(FormFieldContext)
  if (!ctx) {
    throw new Error('useFormField must be called inside FormField provider')
  }
  return ctx
}

export function FormFieldProvider({ fieldName, error, touched, children }) {
  return (
    <FormFieldContext.Provider value={{ fieldName, error, touched }}>
      {children}
    </FormFieldContext.Provider>
  )
}
```

**Rules:**
- Throw error if context missing (fail fast)
- Single responsibility (one hook = one concern)
- Export both hook + provider if needed
- Document with JSDoc

### Component composition

**Prefer composition over inheritance:**
```tsx
// ✅ Composition
export function ModalDialog({ title, onClose, children }: ModalDialogProps) {
  return (
    <Modal onOpenChange={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

// ❌ Inheritance (discouraged)
class ModalDialog extends React.Component<ModalDialogProps> {
  // ...
}
```

**Props drilling:** Acceptable for <3 levels. Beyond that, use context or compound components.

### Render props & compound components

**Use when:** Multiple child components need shared state (DataTable + Header + Body, Form + Fields + Button).

```tsx
// DataTable compound pattern
export function DataTable<T>({ columns, dataSource, ...props }: DataTableProps<T>) {
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 })

  return (
    <DataTableContext.Provider value={{ pagination, setPagination, columns, dataSource }}>
      <table {...props}>
        {/* children rendered as <DataTable.Header>, <DataTable.Body>, etc. */}
      </table>
    </DataTableContext.Provider>
  )
}

DataTable.Header = function Header() {
  const { columns } = useDataTableContext()
  return <thead>{/* render headers */}</thead>
}

DataTable.Body = function Body() {
  const { dataSource } = useDataTableContext()
  return <tbody>{/* render rows */}</tbody>
}
```

---

## Styling & CSS

### Tailwind classes (colocated)

**Component styling pattern:**
```tsx
import { cn } from '@/lib/cn'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center font-medium rounded',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      },
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-700)]',
        ghost: 'bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]'
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed'
      }
    },
    defaultVariants: { size: 'md', variant: 'primary' }
  }
)

export function Button({ size, variant, disabled, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ size, variant, disabled }), className)}
      disabled={disabled}
      {...props}
    />
  )
}
```

**Rules:**
- Use `cva()` for variants (type-safe)
- Use `cn()` to merge custom className overrides
- Reference CSS tokens: `bg-[var(--color-primary)]` (not hard-coded colors)
- Dark mode: `dark:bg-[var(--color-primary-dark)]` (CSS var switches at data-theme)

### No custom CSS files in lib

**Rule:** Styling happens in component files (Tailwind classes) or global `src/styles/index.css` (tokens only).

**Anti-pattern:**
```tsx
// ❌ DON'T: separate .css file
import styles from './button.module.css'

<button className={styles.button} />
```

**Pattern:**
```tsx
// ✅ DO: Tailwind + cva
<button className={cn(buttonVariants({ size, variant }), className)} />
```

---

## Testing

### Test-driven development (TDD)

**For each component:**
1. Write test spec (describe use cases)
2. Implement component
3. Test passes, no skips
4. Coverage goal: public API contract (props + callbacks)

### Test file organization

**File:** `{component}.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  describe('rendering', () => {
    it('renders button element with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies variant class', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('text-[var(--color-neutral-600)]')
    })
  })

  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Click</Button>)
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick} disabled>Disabled</Button>)
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('can be focused with keyboard', async () => {
      render(<Button>Click</Button>)
      const btn = screen.getByRole('button')
      btn.focus()
      expect(btn).toHaveFocus()
    })
  })
})
```

**Rules:**
- Organize by behavior (rendering, interactions, accessibility)
- Test public API only (props + behavior, not internal state)
- Use accessibility queries (getByRole, getByLabelText, not getByTestId)
- Avoid snapshots (brittle); assert on behavior
- No `vi.mock()` for internal utilities; mock external deps only (axios, router, etc. — but NOT in lib)

### Mocking guidelines (lib)

**DO mock:**
- Radix UI primitives (when testing facade wrapper behavior)
- TanStack utilities (when testing data-table behavior)

**DON'T mock:**
- Other lib components (import & use real)
- Internal hooks (always use real)
- CSS/Tailwind (verify via getByRole + class assertion)

```tsx
// ✅ Mock external lib when behavior not relevant to test
vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }) => <div>{children}</div>
}))

// ❌ Don't mock internal components
// vi.mock('./button') — just import real Button

describe('Composite using Button', () => {
  it('button calls onConfirm', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalled()
  })
})
```

### Demo app tests (separate contract)

**Location:** `apps/demo/__tests__/`

```tsx
// ✅ Demo tests mock API (envelope contract)
vi.mock('@/api/client', () => ({
  apiGet: vi.fn().mockResolvedValue([
    { id: 1, name: 'Alice', email: 'alice@example.com' }
  ])
}))

describe('Users page', () => {
  it('renders DataTable with fetched users', async () => {
    render(<UsersPage />)
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })
})
```

**Rules:**
- Mock axios wrapper (not MSW — test integration, not mocking)
- Test component integration with Query, Router, etc.
- Demo contract (envelope) tested via mock

---

## ESLint & linting

### ESLint configuration

**File:** `eslint.config.js`

```js
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import typescriptPlugin from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...typescriptPlugin.configs.recommended,
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: ['redux', 'zustand', '@store/*', 'services/*']
      }],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
]
```

**Key rules for lib:**
- ✅ No Redux/Zustand imports
- ✅ No service calls (axios, fetch direct)
- ✅ No react-router (useNavigate, Link, etc.)
- ✅ No @wailsjs (Wails bridge)
- ✅ TypeScript strict
- ✅ Unused vars warning (prefix with _ if intentional)

**Demo-specific relaxation:**
```js
{
  files: ['apps/demo/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': 'off'  // Demo may use router, axios, etc.
  }
}
```

### Run linting

```bash
# Root
pnpm lint

# Lib only
pnpm --filter ui lint

# Fix auto-fixable
pnpm --filter ui lint -- --fix
```

---

## Git & commit conventions

### Conventional commits

**Format:** `{type}({scope}): {subject}`

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code restructuring (no behavior change)
- `test` — test suite changes
- `style` — formatting, ESLint fixes
- `perf` — performance optimization
- `ci` — CI/CD config changes
- `build` — build system changes
- ❌ `chore` — avoid (unclear intent)
- ❌ `docs` — avoid for `.claude/` files (use `feat` or `fix` instead)

**Scope:** `fluentui-react` (lib) or `demo` (app)

**Examples:**
```
feat(fluentui-react): add DateRangePopover composite
fix(fluentui-react): correct DataTable pagination callback signature
refactor(demo): extract API client error handling to helper
test(fluentui-react): add integration test for FormField + Input
perf(fluentui-react): memoize DataTable row rendering
```

### Commit size & scope

- **Single feature per commit** (no mixing feat + fix + refactor)
- **Focused scope** (<100 files touched, if possible)
- **Tested before commit** (all tests green)
- **Linted before commit** (ESLint + tsc --noEmit)

---

## Error handling & logging

### Error handling in lib

**Pattern:**
```tsx
// Lib should NOT throw validation errors to consumer
// Instead, accept invalid props gracefully or warn

export function DataTable<T extends Record<string, any>>({ columns, dataSource, ...props }: DataTableProps<T>) {
  if (!Array.isArray(dataSource)) {
    console.warn('DataTable: dataSource must be an array')
    return null
  }

  if (!columns || columns.length === 0) {
    console.warn('DataTable: at least one column is required')
    return <div>No columns defined</div>
  }

  return <table>{/* render */}</table>
}
```

**Rules:**
- Validate prop types at component start
- Log warnings (not errors) for developer guidance
- Fail gracefully (return null or fallback UI)
- Never throw from component render
- Error boundary at consumer app (lib does not provide)

### Error handling in demo

**Pattern:**
```tsx
// Demo may throw + catch (it has boundary)

async function fetchUsers() {
  try {
    const users = await apiGet<User[]>('/api/users')
    setUsers(users)
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message)
    } else {
      toast.error('Unexpected error')
    }
  }
}
```

**Rules:**
- Wrap API calls in try/catch
- Display user-friendly error messages
- Log full error to console for debugging
- Never swallow errors silently

---

## Performance considerations

### Component optimization

**Use memo for composites with expensive render:**
```tsx
const DataTableMemo = React.memo(DataTable, (prevProps, nextProps) => {
  return (
    prevProps.dataSource === nextProps.dataSource &&
    prevProps.columns === nextProps.columns &&
    prevProps.pagination?.current === nextProps.pagination?.current
  )
})

export { DataTableMemo as DataTable }
```

**Avoid premature memoization:** Profile first. Memo adds comparison overhead; use only if re-renders are frequent.

### CSS classes optimization

**Tailwind utilities are stripped:** Unused classes removed at build time (via content config).

```tsx
// Safe to use conditional classes — unused ones stripped
const className = cn(
  'px-4 py-2',
  variant === 'primary' && 'bg-blue-500',
  variant === 'ghost' && 'bg-transparent',
  disabled && 'opacity-50'
)
```

---

## Documentation

### JSDoc comments

**For components:**
```tsx
/**
 * Button component — primary action in UI.
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 *
 * @param props - Button props
 * @returns React button element
 */
export function Button(props: ButtonProps) {
  // ...
}
```

**For hooks:**
```tsx
/**
 * Access FormField context (error, touched state).
 *
 * Must be called within FormField provider.
 *
 * @throws Error if called outside FormField provider
 * @returns Form field state
 */
export function useFormField() {
  // ...
}
```

### README files

- **`packages/ui/README.md`** — usage guide (install, quickstart, API reference)
- **`apps/demo/README.md`** (optional) — demo setup + screenshots

### Storybook stories

**Pattern:** `{component}.stories.tsx` colocated with component

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' }
}

export const Ghost: Story = {
  args: { children: 'Ghost Button', variant: 'ghost' }
}

export const Disabled: Story = {
  args: { children: 'Disabled Button', disabled: true }
}
```

---

## Checklist for new components

Before submitting code:

- [ ] File named kebab-case (`button.tsx`, not `Button.tsx`)
- [ ] Props interface defined with JSDoc
- [ ] Component uses forwardRef (if primitive)
- [ ] Tests cover public API (props, callbacks, edge cases)
- [ ] Test file colocated with component
- [ ] Storybook story created
- [ ] Styling uses Tailwind + cva (no separate CSS)
- [ ] No store/service/router/axios imports
- [ ] `vitest run` passes (100% compiled)
- [ ] `pnpm lint` passes (no errors)
- [ ] Commit message is conventional
- [ ] PR description links plan phase

---

**Last updated:** 2026-06-13 · **Status:** Standards finalized after 8 phases
