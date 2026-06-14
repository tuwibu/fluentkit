import { cn } from '../../lib/cn'
import { Skeleton } from '../../primitives/skeleton'
import type { StatCardProps, StatCardSkeletonProps, StatCardTone } from './stat-card.types'

const TONE_CLASS: Record<StatCardTone, string> = {
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error:   'text-destructive',
  info:    'text-primary',
  accent:  'text-[var(--accent)]',
  neutral: 'text-foreground',
}

const CARD_BASE =
  'flex flex-col rounded-lg overflow-hidden backdrop-blur-xl bg-[var(--win11-card-bg)] border border-[var(--win11-card-border)]'

export function StatCard({
  label,
  value,
  tone = 'neutral',
  variant = 'compact',
  delta,
  hint,
}: StatCardProps) {
  const valueClass = TONE_CLASS[tone]

  if (variant === 'kpi') {
    const deltaColor = delta
      ? delta.dir === 'up' ? 'text-emerald-500' : 'text-destructive'
      : ''
    const deltaArrow = delta ? (delta.dir === 'up' ? '▲' : '▼') : null

    return (
      <div className={cn(CARD_BASE, 'flex-col gap-[6px] px-5 py-4 min-w-[140px]')}>
        <span className="text-caption uppercase tracking-wide text-muted-foreground font-[600]">
          {label}
        </span>
        <span className={cn('text-[32px] font-bold tabular-nums leading-none', valueClass)}>
          {value.toLocaleString()}
        </span>
        {(delta || hint) && (
          <div className="flex items-center gap-[6px] mt-[2px]">
            {delta && (
              <span className={cn('text-caption font-[600] tabular-nums', deltaColor)}>
                {deltaArrow} {Math.abs(delta.value).toLocaleString()}
              </span>
            )}
            {hint && (
              <span className="text-caption text-muted-foreground">{hint}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  // compact (default)
  return (
    <div className={cn(CARD_BASE, 'flex-col gap-1 px-4 py-3 min-w-[100px]')}>
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className={cn('text-[22px] font-semibold leading-none tabular-nums', valueClass)}>
        {value.toLocaleString()}
      </span>
      {hint && <span className="text-caption text-muted-foreground">{hint}</span>}
    </div>
  )
}

export function StatCardSkeleton({ variant = 'compact' }: StatCardSkeletonProps) {
  if (variant === 'kpi') {
    return (
      <div className={cn(CARD_BASE, 'flex-col gap-[8px] px-5 py-4 min-w-[140px]')}>
        <Skeleton className="h-[12px] w-20" />
        <Skeleton className="h-[32px] w-24" />
        <Skeleton className="h-[11px] w-16" />
      </div>
    )
  }

  return (
    <div className={cn(CARD_BASE, 'flex-col gap-2 px-4 py-3 min-w-[100px]')}>
      <Skeleton className="h-[14px] w-14" />
      <Skeleton className="h-[22px] w-10" />
    </div>
  )
}
