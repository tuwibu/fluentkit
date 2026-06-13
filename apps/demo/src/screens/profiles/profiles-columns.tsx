import type { ColumnDef } from '@fluent-kit/ui'
import { Tag } from '@fluent-kit/ui'
import { Play, Pencil, Trash2, Globe } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { StatusPill } from '@/components/status-pill'
import type { ProfileRecord } from '@/mocks/fixtures/profiles.fixtures'

// Win11 icon-button style for row actions (matches multiprofile-v2 ICON_BTN)
const ICON_BTN =
  'inline-flex items-center justify-center w-7 h-7 rounded-[4px] text-muted-foreground cursor-pointer transition-[background,color] duration-[120ms] hover:bg-[var(--win11-control-hover)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed'

// Map groupTone → CSS color for Tag `color` prop
const GROUP_TONE_COLOR: Record<ProfileRecord['groupTone'], string> = {
  purple: '#a855f7',
  orange: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  cyan: '#06b6d4',
}

// Map status fixture value → StatusPill display string
const STATUS_LABEL: Record<ProfileRecord['status'], string> = {
  live: 'Live',
  die: 'Die',
  login_failed: 'Login Failed',
  pending: 'Pending',
}

// Map platform → display label
const PLATFORM_LABEL: Record<ProfileRecord['platform'], string> = {
  google: 'Google',
  facebook: 'Facebook',
  twitter: 'Twitter',
}

export function createProfilesColumns(
  onDelete: (record: ProfileRecord) => void,
  onView?: (record: ProfileRecord) => void,
): ColumnDef<ProfileRecord>[] {
  return [
  {
    key: 'group',
    title: 'Group',
    dataIndex: 'group',
    width: 120,
    render: (_value: string, record: ProfileRecord) => (
      <Tag color={GROUP_TONE_COLOR[record.groupTone]}>{record.group}</Tag>
    ),
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    render: (_value: string, record: ProfileRecord) => (
      <div className="flex items-center gap-2 min-w-0">
        <Avatar name={record.name} size="sm" />
        <div className="min-w-0">
          <div className="text-body font-medium truncate leading-tight">{record.name}</div>
          <div className="text-[11px] text-muted-foreground truncate opacity-60 leading-tight">
            {record.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'platform',
    title: 'Platform',
    dataIndex: 'platform',
    width: 110,
    render: (_value: string, record: ProfileRecord) => (
      <div className="flex items-center gap-1.5">
        <Globe size={13} className="text-muted-foreground shrink-0" />
        <span className="text-body">{PLATFORM_LABEL[record.platform]}</span>
      </div>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    render: (_value: string, record: ProfileRecord) => (
      <StatusPill status={STATUS_LABEL[record.status]} />
    ),
  },
  {
    key: 'proxy',
    title: 'Proxy',
    dataIndex: 'proxyType',
    width: 220,
    render: (_value: string, record: ProfileRecord) => {
      if (record.proxyType === 'inline' && record.proxy) {
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag variant="warning" className="shrink-0">
              INLINE
            </Tag>
            <span className="text-caption font-mono text-muted-foreground truncate">
              {record.proxy}
            </span>
          </div>
        )
      }
      return (
        <span className="text-caption italic text-muted-foreground opacity-60">
          Direct connection
        </span>
      )
    },
  },
  {
    key: 'tags',
    title: 'Tags',
    dataIndex: 'tags',
    width: 100,
    render: (_value: string[], record: ProfileRecord) => {
      if (!record.tags || record.tags.length === 0) {
        return <span className="text-muted-foreground opacity-50">—</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {record.tags.map((t) => (
            <Tag key={t} variant="neutral">
              {t}
            </Tag>
          ))}
        </div>
      )
    },
  },
  {
    key: 'lastF',
    title: 'Last F',
    dataIndex: 'lastF',
    width: 90,
    render: (_value: string | undefined) => (
      <span className="text-caption text-muted-foreground opacity-70">
        {_value ?? '—'}
      </span>
    ),
  },
  {
    key: 'actions',
    title: '',
    width: 100,
    align: 'right',
    render: (_value: unknown, record: ProfileRecord) => (
      <div className="flex items-center gap-1.5 justify-end">
        <button
          type="button"
          className={ICON_BTN}
          aria-label={`Run ${record.name}`}
          onClick={(e) => {
            e.stopPropagation()
            console.log('run', record.id)
          }}
        >
          <Play size={13} className="fill-current" />
        </button>
        <button
          type="button"
          className={ICON_BTN}
          aria-label={`Edit ${record.name}`}
          onClick={(e) => {
            e.stopPropagation()
            if (onView) onView(record)
            else console.log('edit', record.id)
          }}
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          className={`${ICON_BTN} text-destructive hover:text-destructive hover:bg-destructive/10`}
          aria-label={`Delete ${record.name}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(record)
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    ),
  },
  ]
}
