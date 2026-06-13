import { Button, Input, Select } from '@fluent-kit/ui'
import { RefreshCw, Columns3, Search, Plus } from 'lucide-react'
import type { ProfileFilters } from './use-profiles'
import { PROFILE_FIXTURES } from '@/mocks/fixtures/profiles.fixtures'

// Sentinel used for "All" options — Radix Select.Item forbids empty string value
const ALL = '__all__'

// Map sentinel back to empty string (= no filter)
function filterVal(v: string): string {
  return v === ALL ? '' : v
}

// Derive unique groups from fixture data for the group filter
const GROUP_OPTIONS = [
  { label: 'All Groups', value: ALL },
  ...Array.from(new Set(PROFILE_FIXTURES.map((p) => p.group))).map((g) => ({
    label: g,
    value: g,
  })),
]

const PLATFORM_OPTIONS = [
  { label: 'All Platforms', value: ALL },
  { label: 'Google', value: 'google' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter', value: 'twitter' },
]

const STATUS_OPTIONS = [
  { label: 'All Status', value: ALL },
  { label: 'Live', value: 'live' },
  { label: 'Die', value: 'die' },
  { label: 'Login Failed', value: 'login_failed' },
  { label: 'Pending', value: 'pending' },
]

interface ProfilesToolbarProps {
  filters: ProfileFilters
  onFilterChange: (next: Partial<ProfileFilters>) => void
  onRefresh: () => void
  onNewProfile: () => void
}

export function ProfilesToolbar({
  filters,
  onFilterChange,
  onRefresh,
  onNewProfile,
}: ProfilesToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Left: icon actions — bordered win11 control buttons */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-[4px] text-muted-foreground"
          aria-label="Refresh profiles"
          onClick={onRefresh}
        >
          <RefreshCw size={14} />
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-[4px] text-muted-foreground"
          aria-label="Toggle columns"
          title="Column visibility"
        >
          <Columns3 size={14} />
        </Button>
      </div>

      {/* Search */}
      <div className="w-44">
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          prefix={<Search size={14} className="text-muted-foreground" />}
          size="middle"
        />
      </div>

      {/* Separator between search and filters */}
      <div className="w-px h-6 self-center bg-[var(--win11-card-border)] shrink-0" aria-hidden />

      {/* Filters */}
      <div className="w-32">
        <Select
          options={PLATFORM_OPTIONS}
          value={filters.platform || ALL}
          onChange={(v) => onFilterChange({ platform: filterVal(v as string) })}
          placeholder="Platform"
        />
      </div>

      <div className="w-32">
        <Select
          options={STATUS_OPTIONS}
          value={filters.status || ALL}
          onChange={(v) => onFilterChange({ status: filterVal(v as string) })}
          placeholder="Status"
        />
      </div>

      <div className="w-36">
        <Select
          options={GROUP_OPTIONS}
          value={filters.group || ALL}
          onChange={(v) => onFilterChange({ group: filterVal(v as string) })}
          placeholder="Group"
        />
      </div>

      {/* Spacer pushes New profile to the right */}
      <div className="flex-1" />

      <Button variant="default" size="sm" onClick={onNewProfile}>
        <Plus size={14} className="mr-1" />
        New profile
      </Button>
    </div>
  )
}
