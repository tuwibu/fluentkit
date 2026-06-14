import { useId } from 'react'
import { Button, FilterSelect, Input, Select, IconButton, Switch, Label } from '@fluent-kit/ui'
import { RefreshCw, Columns3, Search, Plus } from 'lucide-react'
import type { ProfileFilters } from './use-profiles'
import {
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  SORT_OPTIONS,
  TAG_OPTIONS,
} from './profile-filter-presets'

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
  const deletedId = useId()
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Left: icon actions */}
      <div className="flex items-center gap-1">
        <IconButton
          variant="outlined"
          size="sm"
          icon={<RefreshCw size={14} />}
          aria-label="Refresh profiles"
          tooltip="Refresh"
          onClick={onRefresh}
        />
        <IconButton
          variant="outlined"
          size="sm"
          icon={<Columns3 size={14} />}
          aria-label="Toggle columns"
          tooltip="Column visibility"
        />
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

      {/* Separator */}
      <div className="w-px h-6 self-center bg-[var(--win11-card-border)] shrink-0" aria-hidden />

      {/* 1. Platform — FilterSelect single + icon brand */}
      <FilterSelect
        title="Platform"
        options={PLATFORM_OPTIONS}
        value={filters.platform || undefined}
        onChange={(v) => onFilterChange({ platform: (v as string) ?? '' })}
        mode="single"
        allLabel="All Platforms"
        allowClear
      />

      {/* 2. Status — FilterSelect single + color chip */}
      <FilterSelect
        title="Status"
        options={STATUS_OPTIONS}
        value={filters.status || undefined}
        onChange={(v) => onFilterChange({ status: (v as string) ?? '' })}
        mode="single"
        allLabel="All Status"
        allowClear
      />

      {/* 3. Country — FilterSelect multiple + searchable + badge count */}
      <FilterSelect
        title="Country"
        options={COUNTRY_OPTIONS}
        value={filters.country}
        onChange={(v) => onFilterChange({ country: (v as string[]) ?? [] })}
        mode="multiple"
        searchable
        wide
      />

      {/* 4. Tags — FilterSelect multiple + searchable + tags display */}
      <FilterSelect
        title="Tags"
        options={TAG_OPTIONS}
        value={filters.tags}
        onChange={(v) => onFilterChange({ tags: (v as string[]) ?? [] })}
        mode="multiple"
        searchable
        triggerDisplay="tags"
      />

      {/* 5. Sort — Select single + search (loại 2) */}
      <div className="w-40">
        <Select
          options={SORT_OPTIONS}
          value={filters.sort || undefined}
          onChange={(v) => onFilterChange({ sort: (v as string) ?? '' })}
          showSearch
          allowClear
          placeholder="Sort by..."
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Deleted / trash toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <Switch
          id={deletedId}
          checked={filters.deleted}
          onCheckedChange={(next) => onFilterChange({ deleted: next })}
        />
        <Label htmlFor={deletedId} className="text-body cursor-pointer">
          Deleted
        </Label>
      </div>

      <Button variant="default" size="sm" onClick={onNewProfile}>
        <Plus size={14} className="mr-1" />
        New profile
      </Button>
    </div>
  )
}
