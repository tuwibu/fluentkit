# @tuwibu/fluentkit

React component library with Fluent/Windows-11 design language. Config-driven antd-shaped API, ships compiled CSS — zero Tailwind configuration required in your app.

[![npm](https://img.shields.io/npm/v/@tuwibu/fluentkit)](https://www.npmjs.com/package/@tuwibu/fluentkit)
[![license](https://img.shields.io/npm/l/@tuwibu/fluentkit)](./LICENSE)

## Install

```bash
pnpm add @tuwibu/fluentkit react react-dom
# or
npm install @tuwibu/fluentkit react react-dom
```

**Peer dependencies:**
- `react` ^18.2.0 (required)
- `react-dom` ^18.2.0 (required)
- `react-hook-form` ^7.68.0 (optional — only for `@tuwibu/fluentkit/rhf` subpath)
- `zod` ^3.24.0 (optional — only for RHF + Zod validation)

## Quickstart

**1. Import styles once at your app root** (e.g. `main.tsx` or `_app.tsx`):

```tsx
import '@tuwibu/fluentkit/styles.css'
```

That's it — no Tailwind config, no PostCSS setup, no font download. Geist font is bundled.

**2. Use components:**

```tsx
import { Button, Input, Select, FormField, Modal, DataTable } from '@tuwibu/fluentkit'
import type { ColumnDef } from '@tuwibu/fluentkit'
import { useState } from 'react'

type User = { id: number; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { key: 'name', dataIndex: 'name', title: 'Name', sorter: true },
  { key: 'email', dataIndex: 'email', title: 'Email', ellipsis: true },
  { key: 'role', dataIndex: 'role', title: 'Role', width: 120 },
  {
    key: 'actions',
    title: '',
    width: 80,
    render: (_, record) => (
      <Button size="sm" variant="ghost" onClick={() => alert(record.id)}>
        Edit
      </Button>
    ),
  },
]

const data: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Member' },
]

export function UsersPage() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add User</Button>

      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ current: page, pageSize: 10, total: 42, onChange: setPage }}
      />

      <Modal
        open={open}
        title="Add User"
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <FormField label="Name" htmlFor="name" required>
          <Input id="name" placeholder="Full name" />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <Select
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Member', value: 'member' },
            ]}
            placeholder="Select role"
          />
        </FormField>
      </Modal>
    </>
  )
}
```

## Theming

### Light / Dark mode

Add the `dark` class to `<html>` (or any ancestor) to switch to dark mode:

```html
<html class="dark">...</html>
```

Toggle in JS:

```ts
document.documentElement.classList.toggle('dark')
```

### CSS variables

All design tokens are CSS custom properties. Override them in your global CSS:

```css
:root {
  --primary: oklch(0.56 0.19 263);       /* accent color */
  --background: oklch(1 0 0);            /* page background */
  --foreground: oklch(0.14 0 0);         /* primary text */
  --radius: 0.375rem;                    /* border radius */
  --font-sans: 'Inter', sans-serif;      /* body font (see Font section) */
}

.dark {
  --primary: oklch(0.65 0.19 263);
  --background: oklch(0.14 0 0);
  --foreground: oklch(0.98 0 0);
}
```

Key token groups:
- `--primary` / `--primary-foreground` — accent & contrast text
- `--background` / `--foreground` — page and text
- `--muted` / `--muted-foreground` — secondary surfaces
- `--destructive` — danger/error color
- `--border`, `--input`, `--ring` — form/border tokens
- `--radius` — unified border radius

### Font

Geist Sans and Geist Mono are bundled inside `styles.css` (woff2, zero external request). To use a different font, override `--font-sans` and/or `--font-mono`:

```css
:root {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Component API

### DataTable

Config-driven table. API mirrors antd `Table` subset; backed by TanStack Table (internal detail).

**`ColumnDef<T>`**

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique column identifier (React key). Required. |
| `title` | `ReactNode` | Column header content. |
| `dataIndex` | `keyof T` | Maps to a field in the row record. Omit for computed columns. |
| `width` | `number \| string` | Column width in px or CSS string (e.g. `'10%'`). |
| `align` | `'left' \| 'center' \| 'right'` | Cell content alignment. Default `'left'`. |
| `fixed` | `'left' \| 'right'` | Pin column to table edge. |
| `sorter` | `boolean \| (a: T, b: T) => number` | `true` = server-side sort signal; function = local compare. |
| `ellipsis` | `boolean` | Truncate overflow text with ellipsis. |
| `render` | `(value, record: T, index) => ReactNode` | Custom cell renderer. |

**`DataTableProps<T>`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowKey` | `keyof T \| (record: T) => string` | — | Required. Unique row key. |
| `columns` | `ColumnDef<T>[]` | — | Required. Column definitions. |
| `dataSource` | `T[]` | — | Required. Array of row records. |
| `loading` | `boolean \| { skeletonRows?: number }` | `false` | Show skeleton/spinner. |
| `pagination` | `PaginationConfig \| false` | — | Pagination bar config; `false` = show all rows. |
| `expandable` | `ExpandableConfig<T>` | — | Expandable row renderer. |
| `rowSelection` | `RowSelectionConfig<T>` | — | Checkbox multi-select. |
| `scroll` | `{ x?: number \| string; y?: number \| string }` | — | Horizontal/vertical scroll bounds. |
| `footer` | `(currentPageData: T[]) => ReactNode` | — | Footer below table body. |
| `onRow` | `(record: T) => { onClick?: (e) => void }` | — | Row-level event handlers. |
| `emptyText` | `ReactNode` | — | Shown when `dataSource` is empty. |

**`PaginationConfig`**

| Prop | Type | Description |
|------|------|-------------|
| `current` | `number` | Current page (1-based). |
| `pageSize` | `number` | Rows per page. |
| `total` | `number` | Total records across all pages. |
| `onChange` | `(page, pageSize) => void` | Called on page navigation. |

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Required. Controls visibility. |
| `title` | `ReactNode` | — | Modal title. |
| `children` | `ReactNode` | — | Modal body. |
| `footer` | `ReactNode \| null` | — | Custom footer; `null` = hide footer. |
| `onOk` | `() => void \| Promise<void>` | — | Ok button handler (supports async). |
| `onCancel` | `() => void` | — | Cancel/close handler. |
| `okText` | `ReactNode` | `'OK'` | Ok button label. |
| `cancelText` | `ReactNode` | `'Cancel'` | Cancel button label. |
| `confirmLoading` | `boolean` | `false` | Spinner on Ok button during async onOk. |
| `width` | `number \| string` | `520` | Modal width. |
| `destroyOnClose` | `boolean` | `false` | Destroy DOM on close. |
| `closable` | `boolean` | `true` | Show close icon. |

**Imperative confirm:**

```tsx
import { modal } from '@tuwibu/fluentkit'

await modal.confirm({
  title: 'Delete user?',
  content: 'This action cannot be undone.',
  okType: 'danger',
  okText: 'Delete',
})
```

### Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value. |
| `onChange` | `(e: ChangeEvent) => void` | — | Change handler. |
| `placeholder` | `string` | — | Placeholder text. |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Size variant. |
| `status` | `'error' \| 'warning'` | — | Validation status styling. |
| `prefix` | `ReactNode` | — | Content before text (icon). |
| `suffix` | `ReactNode` | — | Content after text (icon). |
| `addonBefore` | `ReactNode` | — | Outside-left addon (e.g. `'https://'`). |
| `addonAfter` | `ReactNode` | — | Outside-right addon (e.g. `'.com'`). |
| `allowClear` | `boolean` | `false` | Show clear (×) button. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `type` | `string` | `'text'` | Native input type. |

All native `<input>` attributes (`id`, `name`, `aria-*`, `autoComplete`, etc.) are forwarded.

### Select

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<V>[]` | — | Required. List of selectable options. |
| `value` | `V \| V[]` | — | Controlled value. |
| `onChange` | `(value: V \| V[]) => void` | — | Change handler. |
| `mode` | `'multiple'` | — | Multi-select with tag display. |
| `showSearch` | `boolean` | `false` | Filter options via search input. |
| `loading` | `boolean` | `false` | Loading spinner in trigger. |
| `allowClear` | `boolean` | `false` | Clear (×) button when value set. |
| `placeholder` | `string` | — | Placeholder when no value selected. |
| `disabled` | `boolean` | `false` | Disables interaction. |

**`SelectOption<V>`**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `ReactNode` | Display label. |
| `value` | `V` | Underlying value emitted on selection. |
| `disabled` | `boolean` | Prevents selection. |

### FormField

| Prop | Type | Description |
|------|------|-------------|
| `label` | `ReactNode` | Label text above the field. |
| `htmlFor` | `string` | `id` of the form control (wired to `<label htmlFor>`). |
| `required` | `boolean` | Renders required asterisk. |
| `error` | `ReactNode` | Validation error shown below field. |
| `description` | `ReactNode` | Helper text below field. |
| `children` | `ReactNode` | The form control to wrap. |

## RHF Adapter

`@tuwibu/fluentkit/rhf` provides `FormFieldController` — connects `FormField` to react-hook-form via `useController`. Install the optional peers first:

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormFieldController } from '@tuwibu/fluentkit/rhf'
import { Input, Button } from '@tuwibu/fluentkit'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
})

type FormValues = z.infer<typeof schema>

export function UserForm() {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FormFieldController
        control={control}
        name="name"
        label="Full Name"
        required
        render={(field) => <Input {...field} placeholder="Alice" />}
      />
      <FormFieldController
        control={control}
        name="email"
        label="Email"
        render={(field) => <Input {...field} type="email" placeholder="alice@example.com" />}
      />
      <Button type="submit">Save</Button>
    </form>
  )
}
```

**`FormFieldController` props** = `FormFieldProps` (minus `error`, auto-injected from RHF) plus:

| Prop | Type | Description |
|------|------|-------------|
| `control` | `Control<TFieldValues>` | RHF control from `useForm()`. |
| `name` | `FieldPath<TFieldValues>` | Field name matching form schema. |
| `render` | `(field) => ReactNode` | Render prop receiving RHF field object. |

## More examples

See [`apps/demo`](../../apps/demo) for full working demos of all components.

## License

MIT © fluentui-react contributors
