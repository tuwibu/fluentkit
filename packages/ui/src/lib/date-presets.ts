import { format, subDays, startOfMonth } from 'date-fns'

export type PresetId =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last14'
  | 'last30'
  | 'thisMonth'
  | 'last90'

export interface Preset {
  id: PresetId
  label: string
}

export const PRESETS: Preset[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last14', label: 'Last 14 days' },
  { id: 'last30', label: 'Last 30 days' },
  { id: 'thisMonth', label: 'This month' },
  { id: 'last90', label: 'Last 90 days' },
]

const fmt = (d: Date) => format(d, 'yyyy-MM-dd')

export function getPresetRange(id: PresetId, now = new Date()): { from: string; to: string } {
  const today = fmt(now)
  switch (id) {
    case 'today':
      return { from: today, to: today }
    case 'yesterday': {
      const d = fmt(subDays(now, 1))
      return { from: d, to: d }
    }
    case 'last7':
      return { from: fmt(subDays(now, 6)), to: today }
    case 'last14':
      return { from: fmt(subDays(now, 13)), to: today }
    case 'last30':
      return { from: fmt(subDays(now, 29)), to: today }
    case 'thisMonth':
      return { from: fmt(startOfMonth(now)), to: today }
    case 'last90':
      return { from: fmt(subDays(now, 89)), to: today }
    default: {
      // exhaustive check — TypeScript will error if a new PresetId is added without a case
      const _: never = id
      void _
      return { from: '', to: '' }
    }
  }
}
