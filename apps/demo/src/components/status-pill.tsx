/**
 * status-pill.tsx
 * Demo-only wrapper around lib Tag.
 * Maps proxy/profile status → Tag variant (success / error / warning / neutral).
 *
 * Colors:
 *   Live         → success  (emerald-500 via Tag)
 *   Die          → error    (destructive via Tag)
 *   Login Failed → error
 *   Pending      → warning  (amber-500 via Tag)
 *   (unknown)    → neutral
 *
 * No hex hardcoding — all color comes from Tag's VARIANT_CLS tokens.
 */
import { Tag } from '@fluent-kit/ui'

export type ProfileStatus = 'Live' | 'Die' | 'Login Failed' | 'Pending'

const STATUS_VARIANT: Record<string, 'success' | 'error' | 'warning' | 'neutral'> = {
  Live: 'success',
  Die: 'error',
  'Login Failed': 'error',
  Pending: 'warning',
}

interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const variant = STATUS_VARIANT[status] ?? 'neutral'

  return (
    <Tag variant={variant} bullet className={className}>
      {status}
    </Tag>
  )
}
