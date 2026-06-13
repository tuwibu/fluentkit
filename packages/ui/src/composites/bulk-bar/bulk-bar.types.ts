import type { ReactNode } from 'react'

export interface BulkAction {
  key: string
  label: ReactNode
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

export interface BulkBarProps {
  count: number
  actions?: BulkAction[]
  onClose: () => void
  /** Slot rendered right after the count chip, before actions */
  extra?: ReactNode
}
