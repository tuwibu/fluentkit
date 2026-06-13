import { Input, Select } from '@fluent-kit/ui'
import type { SelectOption } from '@fluent-kit/ui'

const ROLE_OPTIONS: SelectOption[] = [
  { label: 'All roles', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

interface UsersFiltersProps {
  search: string
  role: string
  onSearchChange: (v: string) => void
  onRoleChange: (v: string) => void
}

export function UsersFilters({ search, role, onSearchChange, onRoleChange }: UsersFiltersProps) {
  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      <div className="w-60">
        <Input
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
      </div>
      <div className="w-40">
        <Select
          options={ROLE_OPTIONS}
          value={role || 'all'}
          onChange={(v) => onRoleChange(v === 'all' ? '' : (v as string))}
          placeholder="Filter role"
        />
      </div>
    </div>
  )
}
