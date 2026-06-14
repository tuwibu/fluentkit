/**
 * status-pill.tsx
 * Demo-only status pill — mirrors the multiprofile-v2 reference `status-pill`:
 * a soft colored pill (borderless look) with a leading dot + colored text.
 *
 * Size scale matches the lib `Tag` (sm/md/lg) so the Status column lines up
 * 1:1 in height with Group / Tags pills. A transparent border keeps the box
 * height identical to the bordered `Tag` at the same size.
 *
 * Colors match reference VARIANT_PILL exactly (emerald/amber/red/gray).
 */
import { cn } from '@tuwibu/fluentkit'
import type { TagSize } from '@tuwibu/fluentkit'

export type ProfileStatus = 'Live' | 'Die' | 'Login Failed' | 'Pending'

type PillVariant = 'green' | 'amber' | 'red' | 'gray'

const VARIANT_DOT: Record<PillVariant, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  gray: 'bg-gray-400',
}

const VARIANT_PILL: Record<PillVariant, string> = {
  green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  red: 'bg-red-500/15 text-red-600 dark:text-red-400',
  gray: 'bg-gray-500/10 text-muted-foreground',
}

// Mirrors Tag's SIZE_CLS so Status pills match Group / Tags exactly.
const SIZE_CLS: Record<TagSize, string> = {
  sm: 'text-micro gap-1 py-[1px] px-[6px]',
  md: 'text-caption gap-[5px] py-[2px] px-[7px]',
  lg: 'text-body gap-1.5 py-0.5 px-2.5',
}

const DOT_SIZE: Record<TagSize, string> = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
}

const STATUS_VARIANT: Record<string, PillVariant> = {
  Live: 'green',
  Die: 'red',
  'Login Failed': 'red',
  Pending: 'amber',
}

interface StatusPillProps {
  status: string
  size?: TagSize
  className?: string
}

export function StatusPill({ status, size = 'md', className }: StatusPillProps) {
  const variant = STATUS_VARIANT[status] ?? 'gray'

  return (
    <span
      className={cn(
        // transparent border → same box height as the bordered lib Tag
        'inline-flex items-center whitespace-nowrap border border-transparent font-medium leading-snug rounded-[4px]',
        SIZE_CLS[size],
        VARIANT_PILL[variant],
        className,
      )}
    >
      <span
        className={cn('rounded-full shrink-0', DOT_SIZE[size], VARIANT_DOT[variant])}
        aria-hidden
      />
      {status}
    </span>
  )
}
