# System Architecture — fluentui-react

## High-level overview

`@tuwibu/fluentkit` là một **component library hai tầng** nhằm decoupling công khai facade từ headless core, cho phép consumer chỉ phụ thuộc vào props contract, không bị ảnh hưởng bởi thay đổi lõi (TanStack, Radix).

```
┌─────────────────────────────────────────────────────────────┐
│                        Consumer App                         │
│  (Vite / Next.js / CRA — dùng @tuwibu/fluentkit components)   │
└────────────────────────┬────────────────────────────────────┘
                         │
                   Props + Callbacks
                         │
        ┌────────────────▼────────────────┐
        │  @tuwibu/fluentkit (Public API)    │
        │  ────────────────────────────    │
        │  • Primitives (16 components)   │
        │  • Composites (9 components)    │
        │  • Design tokens (CSS vars)     │
        │  • Compiled CSS (styles.css)    │
        │  • RHF adapter (subpath)        │
        └────────────────┬────────────────┘
                         │
              Internal props mapping
                         │
        ┌────────────────▼────────────────────┐
        │  Headless Core Layer (private)      │
        │  ──────────────────────────────────  │
        │  • TanStack React Table             │
        │  • Radix UI (Popover, Dropdown)     │
        │  • Custom hooks (useFormField, ...) │
        │  • Utilities (cn, clsx, CVA)        │
        └────────────────┬────────────────────┘
                         │
        ┌────────────────▴────────────────┐
        │                                 │
        ▼                                 ▼
  HTML / DOM                      CSS + Tailwind
```

---

## Two-tier architecture in detail

### Layer 1: Public facade (packages/ui)

**Entry point:** `src/index.ts`

Exports công khai cho consumer (và re-exported từ README):
- **16 primitives:** Button, Input, Select, Modal (Dialog), Card, Checkbox, Switch, Tag, Badge, Label, Separator, Skeleton, Popover, Dropdown-Menu, Tabs, Textarea, Tooltip, Sheet
- **9 composites:** DataTable, Modal (high-level), Input (form), Select (form), FormField, SidebarNav, SegmentedControl, DetailDrawer, DateRangePopover
- **Type exports:** `ColumnDef<T>` (from TanStack Table), component prop types
- **Design tokens:** TypeScript enums/consts (size, variant, intent colors)

**Props contract:** Mỗi component có interface `<ComponentName>Props` định nghĩa config-driven API (antd-shape style):
```tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  dataSource: T[]
  pagination?: { pageSize?: number; current?: number }
  onChange?: (pagination, filters, sorter) => void
  // ...
}
```

**Key principle:** Props KHÔNG bao gồm:
- Redux state / Zustand store references
- Service calls / axios instances
- Router navigate / useNavigate
- Wails bridge / IPC channels

Tất cả dữ liệu & hành động qua props + callback.

### Layer 2: Headless core (private, không export)

**Location:** `src/composites/{component}/internal/` và `src/lib/hooks/`

**TanStack React Table (DataTable internals):**
- `useTable()`, `useVirtualizer()` — manage pagination, sorting, filtering
- Wrapped bởi `<DataTableImpl>` internal component
- Consumer không thấy TanStack; chỉ biết `DataTable` props

**Radix UI (Popover, Dropdown, Dialog):**
- `usePopper()`, `useClickOutside()`, `useFocusTrap()` — accessibility primitives
- Composed thành `SelectImpl`, `ModalImpl`, `DropdownMenuImpl`
- Consumer thấy facade (`Select`, `Modal`) với props-only API

**Custom hooks (private):**
- `useFormField()` — context để sync FormField + input con
- `useSidebarNav()` — state quản lý active/expanded nav items
- `useDateRange()` — internal calendar logic

**Utilities:**
- `cn()` — clsx + tailwind-merge (class merging)
- `cva()` — class variance authority (component variants)
- `formatDate()`, `createRange()` — domain helpers

### Boundary enforcement

**ESLint rules** (`eslint.config.js`):
```js
// NO store/Redux in lib
rules: {
  'no-restricted-imports': ['error', {
    patterns: ['redux', 'zustand', '@store/*', 'services/*', '@services/*']
  }]
}

// NO router in lib
'react-router-dom': 'off'

// NO axios in lib (HTTP calls at app layer)
'axios': 'off'

// NO Wails bridge in lib
'@wailsjs/*': 'off'
```

**File-level guard:**
- Primitives (`src/primitives/`) — ZERO dependencies except React, Radix, Tailwind
- Composites (`src/composites/`) — may use TanStack, internal hooks, primitives
- No cross-import from internal/ to public index.ts

---

## CSS & design system

### Compiled output strategy

**Input pipeline:**
```
src/styles/index.css
  ├── @import './tokens.css'  (CSS vars: --color-*, --spacing-*, ...)
  ├── @tailwind base          (Tailwind reset)
  ├── @tailwind components    (Tailwind components layer)
  ├── @tailwind utilities     (Tailwind utility classes)
  └── Custom dark theme overrides
       │
       ▼
  tailwindcss CLI → dist/styles.css (minified, self-contained)
       │
       ├── Fonts: @import url(…) (Geist Variable + Mono from @fontsource)
       ├── Tokens: converted to inline CSS vars
       └── Tailwind: all classes compiled inline
```

**Output:** Single `dist/styles.css` file (~150KB minified)
- **ZERO @import directives** (all inlined)
- **ZERO PostCSS config needed in consumer app**
- Font files bundled in dist/ via `copy-fonts.mjs`

**Consumer usage:**
```tsx
import '@tuwibu/fluentkit/styles.css'  // That's it — no Tailwind, no PostCSS, no config
```

### Design tokens (CSS custom properties)

**File:** `src/styles/tokens.css`

**Token categories:**
- **Colors:** `--color-{primary,secondary,success,warning,error,neutral}-{50..900}`
- **Spacing:** `--spacing-{0,1,2,3,4,6,8,12,16,20,24,32}` (4px grid)
- **Typography:** `--font-size-{xs,sm,base,lg,xl,2xl}`, `--line-height-{tight,normal,relaxed}`
- **Shadows:** `--shadow-{sm,md,lg,xl,2xl}` (Fluent elevation)
- **Radius:** `--radius-{sm,md,lg}` (4px, 8px, 12px)
- **Z-index:** `--z-{dropdown,modal,popover,tooltip}` (modal: 1000, popover: 999, ...)

**Light/dark theme:** Data attribute switching
```html
<!-- Light (default) -->
<html>
  <!-- --color-primary: #0078d4 -->
</html>

<!-- Dark mode -->
<html data-theme="dark">
  <!-- --color-primary: #50b4ff -->
</html>
```

**Component usage:**
```tsx
// Primitive button
<button className={cn(
  'px-4 py-2 rounded-[var(--radius-md)]',
  'bg-[var(--color-primary)] text-white',
  'hover:bg-[var(--color-primary-700)]'
)}>
  Click me
</button>
```

### CVA for component variants

**CVA (class-variance-authority) pattern:**
```tsx
// src/primitives/button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      },
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
        ghost: 'bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]'
      }
    },
    defaultVariants: { size: 'md', variant: 'primary' }
  }
)

export function Button({ size, variant, ...props }: ButtonProps) {
  return <button className={buttonVariants({ size, variant })} {...props} />
}
```

---

## RHF adapter (subpath export)

**Location:** `src/rhf/`

**Entry point:** `src/rhf/index.ts`

**Exports:**
- `FormFieldAdapter<T>` — generic wrapper component
- `useFormField()` — context hook to access field state from react-hook-form

**How it works:**
```tsx
// Consumer code
import { useForm, useController } from 'react-hook-form'
import { FormFieldAdapter } from '@tuwibu/fluentkit/rhf'

function MyForm() {
  const { control } = useForm()
  const { field, fieldState } = useController({
    control,
    name: 'email',
    rules: { required: 'Email is required' }
  })

  return (
    <FormFieldAdapter control={control} name="email">
      <FormField label="Email">
        <Input {...field} />
      </FormField>
    </FormFieldAdapter>
  )
}
```

**Key design:**
- RHF (react-hook-form) is **optional peer dependency** (declared in package.json)
- Adapter does NOT force Zod validation (consumer may use joi, yup, custom)
- Keeps main lib unopinionated; form consumers may prefer Formik, plain state, etc.

---

## Demo app architecture

**Location:** `apps/demo/`

**Independence:** Fully isolated from lib. No symlink to src/, uses published npm package (workspace: *).

### API contract (envelope pattern)

**File:** `src/api/contract.ts`

```tsx
export interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
}
```

**Everywhere in demo:**
- ✅ MSW returns `{ success: true, data: { /* payload */ } }`
- ✅ axios wrapper unwraps: `const users = await apiGet<User[]>('/users')` (returns User[], not envelope)
- ✅ Error: `success: false` → throws `ApiError` (caught in try/catch)
- ❌ NO manual envelope checks in components

### MSW (Mock Service Worker)

**File:** `src/api/handlers.ts`

```tsx
export const handlers = [
  http.get('/api/users', ({ request }) => {
    return HttpResponse.json<ApiEnvelope<User[]>>({
      success: true,
      data: [
        { id: 1, name: 'Alice', email: 'alice@example.com' }
      ]
    })
  })
]
```

**Setup:** `src/main.tsx` → `setupServer()` (dev + test mode)

### axios wrapper

**File:** `src/api/client.ts`

```tsx
class ApiError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message)
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  const response = await axios.get<ApiEnvelope<T>>(url)
  if (!response.data.success) {
    throw new ApiError(response.data.message || 'API error')
  }
  return response.data.data!
}
```

**Usage in components:**
```tsx
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => apiGet<User[]>('/api/users')
})
```

### TanStack Query integration

**Setup:** `src/main.tsx`
```tsx
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* pages */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

**No caching complexity:** Demo uses defaults (staleTime: 0, gcTime: 5min). Real app may tune.

---

## Build & packaging

### tsup configuration

**File:** `packages/ui/tsup.config.ts`

```ts
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'rhf/index': 'src/rhf/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,  // Generate .d.ts
  outDir: 'dist',
  clean: true,
  sourcemap: false
})
```

**Output:**
- `dist/index.js` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/index.d.ts` (ESM types)
- `dist/index.d.cts` (CJS types)
- Same for `rhf/`

### CSS build

**Script:** `packages/ui/package.json` → `"build:css"`

```bash
tailwindcss -i src/styles/index.css -o dist/styles.css --minify && node scripts/copy-fonts.mjs
```

1. Tailwind compile: input `src/styles/index.css` → output `dist/styles.css` (minified)
2. Font copy: `@fontsource-variable/geist`, `@fontsource/geist-mono` → `dist/fonts/`

### Package exports (package.json)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.d.ts",
      "require": "./dist/index.cjs"
    },
    "./rhf": {
      "import": "./dist/rhf/index.js",
      "require": "./dist/rhf/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

**Multi-entry:** allows `import { Button } from '@tuwibu/fluentkit'` AND `import { FormFieldAdapter } from '@tuwibu/fluentkit/rhf'`

---

## Testing architecture

### Unit test pattern (vitest)

**File:** `src/primitives/button.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-primary)]')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

**Coverage goal:** Public API props + callback contract (not internal Radix/TanStack mechanics)

### Integration test pattern

**File:** `src/__tests__/form-integration.test.tsx`

```tsx
// Test FormField + Input together (but NOT with react-hook-form — that's demo-only)
describe('FormField + Input integration', () => {
  it('displays error message from FormField', () => {
    const { rerender } = render(
      <FormField label="Name" error={undefined}>
        <Input />
      </FormField>
    )
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

    rerender(
      <FormField label="Name" error="Name is required">
        <Input />
      </FormField>
    )
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })
})
```

### Compile gate (typecheck)

**Command:** `vitest --typecheck --run`

Validates full TypeScript surface (props, return types, generics) against declarations before releasing.

---

## Dependency management

### Peerwise contract

```json
{
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.68.0",
    "zod": "^3.24.0"
  },
  "peerDependenciesMeta": {
    "react-hook-form": { "optional": true },
    "zod": { "optional": true }
  }
}
```

**Signal:** Lib works standalone (React only). RHF adapter needs RHF (optional peer).

### No internal updates to Radix/TanStack

- Lib uses pinned versions (e.g., `radix-ui: ^1.4.3`, `@tanstack/react-table: ^8.21.3`)
- Breaking changes in those libs → plan new phase to migrate
- Consumer apps free to upgrade independently (Radix/TanStack are dev-only for lib)

---

## Error boundaries & accessibility

### Error boundary (demo only)

App-level error boundary wraps all routes. Lib components do NOT include error boundary (consumer's responsibility).

### Accessibility patterns

**Lib responsibility:**
- `role`, `aria-label`, `aria-labelledby` on primitives
- Keyboard navigation (Tab, Enter, Escape) via Radix
- Focus trapping (modal, popover) via Radix
- Color contrast ≥ 4.5:1 (Fluent palette meets WCAG AA)

**Consumer responsibility:**
- Semantic HTML (use `<button>` not `<div>`, etc.)
- Form `<label>` association (htmlFor)
- Screen reader testing in their app

---

## Deferred items

| Item | Reason | Target |
|------|--------|--------|
| npm public registry | Org registry/CI setup | Phase 9 (post-roadmap) |
| Windowed pagination | Impl ready, integration deferred | M3 (when virtual scrolling perf audit needed) |
| Storybook deploy | CI hosting | Phase 9 |
| Changelog automation | CI release notes | Phase 9 |

---

**Last updated:** 2026-06-13 · **Status:** Architecture finalized (8/8 phases completed)
