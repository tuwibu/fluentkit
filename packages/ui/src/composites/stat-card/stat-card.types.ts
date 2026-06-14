export type StatCardTone = 'success' | 'warning' | 'error' | 'info' | 'accent' | 'neutral'
export type StatCardVariant = 'kpi' | 'compact'

export interface StatCardDelta {
  value: number
  dir: 'up' | 'down'
}

export interface StatCardProps {
  label: string
  value: number
  tone?: StatCardTone
  variant?: StatCardVariant
  delta?: StatCardDelta
  hint?: string
}

export interface StatCardSkeletonProps {
  variant?: StatCardVariant
}
