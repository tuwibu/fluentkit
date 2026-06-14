import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Globe, Monitor, Smartphone, Server } from 'lucide-react'
import { FilterSelect } from './filter-select'
import { getTagColor } from '../../lib/tag-color'

const meta: Meta<typeof FilterSelect> = {
  title: 'Composites/FilterSelect',
  component: FilterSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof FilterSelect>

// ---------------------------------------------------------------------------
// Story: Platform (single, icon, toggle-to-clear) — loại 3
// ---------------------------------------------------------------------------
const PLATFORM_OPTIONS = [
  { label: 'Web', value: 'web', icon: <Globe size={14} /> },
  { label: 'Desktop', value: 'desktop', icon: <Monitor size={14} /> },
  { label: 'Mobile', value: 'mobile', icon: <Smartphone size={14} /> },
  { label: 'Server', value: 'server', icon: <Server size={14} /> },
]

export const PlatformSingle: Story = {
  name: 'Platform (single · toggle-to-clear)',
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <div className="flex flex-col gap-3 min-w-[260px]">
        <FilterSelect
          title="Platform"
          options={PLATFORM_OPTIONS}
          value={val}
          onChange={(v) => setVal(v as string | undefined)}
          mode="single"
          allLabel="All platforms"
        />
        <p className="text-sm text-muted-foreground">Selected: {val ?? '(none)'}</p>
        <p className="text-xs text-muted-foreground">
          Click the selected option again to deselect (toggle-to-clear).
        </p>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story: Status (multiple, count badge) — loại 4
// ---------------------------------------------------------------------------
const STATUS_OPTIONS = [
  { label: 'Active', value: 'active', color: '#059669' },
  { label: 'Pending', value: 'pending', color: '#d97706' },
  { label: 'Suspended', value: 'suspended', color: '#dc2626' },
  { label: 'Inactive', value: 'inactive', color: '#6b7280' },
]

export const StatusMultiCount: Story = {
  name: 'Status (multiple · count badge)',
  render: () => {
    const [val, setVal] = useState<string[] | undefined>(undefined)
    return (
      <div className="flex flex-col gap-3 min-w-[260px]">
        <FilterSelect
          title="Status"
          options={STATUS_OPTIONS}
          value={val}
          onChange={(v) => setVal(v as string[] | undefined)}
          mode="multiple"
          triggerDisplay="count"
          wide
        />
        <p className="text-sm text-muted-foreground">
          Selected: {val?.join(', ') ?? '(none)'}
        </p>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story: Tags (multiple, searchable, tags display) — loại 5
// ---------------------------------------------------------------------------
const TAG_LABELS = ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Vite', 'Vitest', 'Storybook']
const TAG_OPTIONS = TAG_LABELS.map((t) => ({
  label: t,
  value: t.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  color: getTagColor(t),
}))

export const TagsMultiDisplay: Story = {
  name: 'Tags (multiple · tags display · searchable)',
  render: () => {
    const [val, setVal] = useState<string[] | undefined>(undefined)
    return (
      <div className="flex flex-col gap-3 min-w-[320px]">
        <FilterSelect
          title="Tags"
          options={TAG_OPTIONS}
          value={val}
          onChange={(v) => setVal(v as string[] | undefined)}
          mode="multiple"
          triggerDisplay="tags"
          searchable
          wide
        />
        <p className="text-sm text-muted-foreground">
          Selected: {val?.join(', ') ?? '(none)'}
        </p>
      </div>
    )
  },
}
