# @tuwibu/fluentkit

Thư viện component React theo phong cách **Windows 11 Fluent Design** — xây trên **React 18 + Tailwind CSS v4 + Radix UI + lucide-react**. API hướng cấu hình kiểu antd: truyền `menu`/`items`/`columns`/`options` vào là ra giao diện, kèm sẵn dark/light + color presets.

Monorepo (pnpm workspaces):
- `packages/ui` — thư viện `@tuwibu/fluentkit` (publishable).
- `apps/demo` — app demo (Vite + React Router) minh hoạ toàn bộ component.

---

## Cài đặt

```bash
pnpm add @tuwibu/fluentkit
# peer deps
pnpm add react react-dom next-themes
# (tuỳ chọn) cho form: react-hook-form zod
```

CSS đã được **biên dịch sẵn** (zero-config, không cần Tailwind ở app tiêu dùng) — chỉ cần import 1 lần ở entry:

```ts
import '@tuwibu/fluentkit/styles.css'
```

---

## Khởi tạo theme (bắt buộc)

Bọc app trong `ThemeProvider` (dark/light qua `next-themes`) + `ColorThemeProvider` (6 preset sáng + 4 tối, lưu `localStorage`):

```tsx
import { ThemeProvider, ColorThemeProvider } from '@tuwibu/fluentkit'
import '@tuwibu/fluentkit/styles.css'

export function Root({ children }) {
  return (
    <ThemeProvider>          {/* attribute="class", defaultTheme="dark", enableSystem */}
      <ColorThemeProvider>
        {children}
      </ColorThemeProvider>
    </ThemeProvider>
  )
}
```

Đổi theme trong code:

```tsx
import { useTheme, useColorTheme } from '@tuwibu/fluentkit'

const { resolvedTheme, setTheme } = useTheme()        // 'dark' | 'light'
const { currentTheme, setTheme: setColor, themeOptions } = useColorTheme()
```

---

## Bắt đầu nhanh — `AppShell`

`AppShell` ráp sẵn: wallpaper → lớp mica (`backdrop-filter: blur(30px)`) → sidebar + header + content + footer. Chỉ cần truyền `menu`:

```tsx
import { AppShell, UserDropdown } from '@tuwibu/fluentkit'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const menu = [
  { key: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  {
    key: 'profiles-group', label: 'Profiles', icon: <Users size={18} />,
    children: [
      { key: '/profiles', label: 'All Profiles' },
      { key: '/profiles/groups', label: 'Groups' },
    ],
  },
  { key: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

function App() {
  const [active, setActive] = useState('/profiles')
  return (
    <AppShell
      menu={menu}
      activeKey={active}
      onSelect={(key) => !key.endsWith('-group') && setActive(key)}
      brand={{ name: 'MultiProfile', version: 'v2.4.1' }}
      user={<UserDropdown user={{ name: 'Admin', email: 'admin@app.com' }} onLogout={() => {}} />}
      headerTitle="All Profiles"
    >
      {/* nội dung trang */}
    </AppShell>
  )
}
```

`AppShellProps`: `menu`, `activeKey`, `onSelect(key)`, `brand?{logo,name,version}`, `user?` (slot trên sidebar), `headerTitle?`, `headerActions?`, `footer?`, `children`, `defaultCollapsed?`. Toggle thu gọn sidebar qua hook `useAppShell()`.

`MenuItem = MenuLeaf | MenuGroup`:
- `MenuLeaf`: `{ key, label, icon?, tip?, color?, count?, disabled? }`
- `MenuGroup`: `{ key, label, icon?, tip?, color?, children: MenuLeaf[] }`

---

## Components

### Layout
| Component | Mô tả | Props chính |
|---|---|---|
| `AppShell` | App shell đầy đủ (mica + sidebar + header) | xem trên |
| `Sidebar` | Menu config-driven (group/snake-rail/user card) | `items`, `activeKey`, `onSelect`, `collapsed?`, `collapsedWidth?=56`, `brand?`, `userSlot?`, `width?=220` |
| `Header` | Thanh winbar 48px + toggle dark/light | `title?`, `leading?`, `actions?`, `notifications?`, `showThemeToggle?=true` |
| `UserDropdown` | Popover user (đổi theme + settings + logout) | `user{name,email,avatar?}`, `onLogout`, `onOpenSettings?`, `colorThemeControl?=true`, `collapsed?` |

### Overlay
| Component | Mô tả | Props chính |
|---|---|---|
| `Modal` | Dialog antd-style | `open`, `title?`, `footer?`, `onOk?`, `onCancel?`, `okText?`, `cancelText?`, `confirmLoading?`, `width?=520`, `closable?` |
| `modal.confirm()` | Mở confirm dialog mệnh lệnh | `{ title, content, okType?: 'primary'|'danger', okText?, cancelText?, onOk }` → `Promise` |
| `DetailDrawer` | Drawer trượt cạnh | `open`, `onOpenChange`, `title`, `side?='right'`, `width?=480`, `header?`, `footer?`, `children` |
| `DrawerSection` / `DrawerInfoRow` | Card section + hàng label/value (click-to-copy) | `DrawerSection{icon?,title,count?,action?,padded?}`, `DrawerInfoRow{label,value?,monospace?,footer?}` |
| `BulkBar` | Thanh bulk-action nổi (hiện khi `count>0`) | `count`, `actions: {key,label,icon?,danger?,disabled?,loading?,onClick}[]`, `onClose`, `extra?` |

### Data & Form
| Component | Mô tả | Props chính |
|---|---|---|
| `DataTable` | Bảng (TanStack) + row selection + pagination | `rowKey`, `columns`, `dataSource`, `loading?`, `pagination?`, `bordered?=true`, `rowSelection?`, `scroll?`, `emptyText?`, `onRow?` |
| `FormField` | Wrapper label + required + error + description | `label?`, `htmlFor?`, `required?`, `error?`, `description?`, `children` |
| `Input` (composite) | Input + prefix/suffix/addon/clear/size | `value`, `onChange`, `prefix?`, `suffix?`, `size?: 'small'|'middle'|'large'`, `status?`, `allowClear?`, `addonBefore?`, `addonAfter?` |
| `Select` (composite) | Select đơn/đa + search | `options`, `value`, `onChange`, `mode?: 'multiple'`, `showSearch?`, `loading?`, `allowClear?`, `placeholder?` |
| `FilterSelect` | Filter trigger Popover — title tĩnh + badge/chip active | `title`, `options`, `value`, `onChange`, `mode?`, `searchable?`, `triggerDisplay?`, `allLabel?`, `wide?`, `allowClear?` |
| `StatCard` | Card thống kê + delta + skeleton | `title`, `value`, `variant?`, `tone?`, `delta?`, `loading?` |
| `DateRangePopover` | Chọn khoảng ngày | `value`, `onChange`, `presets?` |
| `SegmentedControl` | Nhóm nút segmented | `options`, `value`, `onChange` |

> Form tích hợp `react-hook-form` có sẵn ở entry phụ: `import { ... } from '@tuwibu/fluentkit/rhf'`.

### Primitives
`Button` (`variant`: default/destructive/outline/secondary/ghost/link; `size`: sm/default/lg/icon/icon-sm/icon-lg), `Tag`, `Badge`, `Tabs`, `Checkbox`, `Switch`, `Textarea`, `Label`, `Separator`, `Skeleton`. Tiện ích: `cn`, `cx`.

---

---

## Select & FilterSelect — 5 loại dùng theo ngữ cảnh

| Loại | Component | Cấu hình | Dùng khi |
|---|---|---|---|
| 1 | `<Select>` | _(không có showSearch)_ | Dropdown đơn, ít lựa chọn (≤ 10) |
| 2 | `<Select showSearch>` | `showSearch` | Dropdown đơn có tìm kiếm, nhiều lựa chọn |
| 3 | `<FilterSelect mode='single'>` | `allLabel`, `allowClear`, `icon`/`color` trong options | Filter đơn — trigger luôn hiển thị title tĩnh |
| 4 | `<FilterSelect mode='multiple' searchable wide>` | `searchable`, `wide` | Filter đa với badge đếm số lựa chọn |
| 5 | `<FilterSelect mode='multiple' triggerDisplay='tags'>` | `triggerDisplay='tags'` | Filter đa hiển thị chip inline trong trigger |

### Ví dụ — FilterSelect với icon brand và màu status

```tsx
import { FilterSelect, getTagColor } from '@tuwibu/fluentkit'
import { SiFacebook, SiGoogle } from 'react-icons/si'

// Loại 3 — Platform filter với icon brand
const platformOptions = [
  { label: 'Google',   value: 'google',   icon: <span style={{ color: '#4285F4', display: 'flex' }}><SiGoogle size={13} /></span> },
  { label: 'Facebook', value: 'facebook', icon: <span style={{ color: '#1877F2', display: 'flex' }}><SiFacebook size={13} /></span> },
]

// Loại 3 — Status filter với color chip
const statusOptions = [
  { label: 'Live',    value: 'live',    color: '#10b981' },
  { label: 'Die',     value: 'die',     color: '#ef4444' },
  { label: 'Pending', value: 'pending', color: '#f59e0b' },
]

// Loại 5 — Tags filter với màu deterministic
const tagOptions = ['vip', 'seed', 'warmup'].map((t) => ({
  label: t, value: t, color: getTagColor(t),
}))

<FilterSelect title="Platform" options={platformOptions}
  value={platform} onChange={setPlatform}
  mode="single" allLabel="All Platforms" allowClear />

<FilterSelect title="Status" options={statusOptions}
  value={status} onChange={setStatus}
  mode="single" allLabel="All Status" allowClear />

<FilterSelect title="Tags" options={tagOptions}
  value={tags} onChange={setTags}
  mode="multiple" searchable triggerDisplay="tags" />
```

### Ví dụ — StatCard

```tsx
import { StatCard, StatCardSkeleton } from '@tuwibu/fluentkit'

// Loading skeleton
{isLoading ? <StatCardSkeleton /> : (
  <StatCard
    title="Active profiles"
    value={1234}
    tone="blue"
    delta={{ value: 12, direction: 'up', label: 'vs last week' }}
  />
)}
```

`StatCardProps`: `title`, `value` (number|string), `variant?: 'default'|'outline'`, `tone?: 'blue'|'green'|'red'|'amber'|'purple'|'gray'`, `delta?: { value, direction: 'up'|'down'|'flat', label? }`, `loading?`, `icon?`, `action?`.

---

## Ví dụ Modal + xác nhận xóa

```tsx
import { Modal, Button } from '@tuwibu/fluentkit'

<Modal
  open={!!target}
  title="Delete profile?"
  onCancel={() => setTarget(null)}
  footer={
    <>
      <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
      <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete <strong>{target?.name}</strong>?
</Modal>
```

---

## Phát triển (monorepo)

```bash
pnpm install

# Build thư viện (JS + CSS + fonts)
pnpm --filter @tuwibu/fluentkit build

# Chạy demo (Vite, http://localhost:5173)
pnpm --filter demo dev

# Test / typecheck
pnpm --filter @tuwibu/fluentkit test
pnpm -r typecheck

# Storybook
pnpm storybook
```

> Demo tiêu thụ thư viện qua bản **dist**. Sau khi sửa `packages/ui`, chạy lại `build` (+ restart Vite / xoá `node_modules/.vite`) để demo nạp bản mới.

---

## Theme tokens

Token màu/độ bo/typography định nghĩa bằng CSS variables (`:root` + `.dark`) trong `dist/styles.css` — đồng bộ Windows 11 Fluent (mica gradient, `--win11-*`, `--primary`, `--radius`, scale `text-micro → text-display`). `ColorThemeProvider` áp preset bằng cách set inline vars trên `documentElement`.

---

## License

MIT.
