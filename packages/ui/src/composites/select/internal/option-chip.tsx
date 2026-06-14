import type { ReactNode } from 'react'
import { Tag } from '../../../primitives/tag'

export interface OptionChipProps {
  icon?: ReactNode
  color?: string
  label: ReactNode
  removable?: boolean
  onRemove?: () => void
}

/**
 * Renders an option's metadata (icon + label + optional color) as a consistent chip.
 * - color present  → Tag primitive with color-mix styling (+ optional remove button).
 * - icon, no color → inline-flex span with icon + label.
 * - label only     → bare fragment.
 *
 * Internal to the Select composite family. Not exported from the barrel.
 */
export function OptionChip({ icon, color, label, removable, onRemove }: OptionChipProps) {
  if (color) {
    return (
      <Tag color={color} onRemove={removable ? onRemove : undefined}>
        {icon}
        {label}
      </Tag>
    )
  }

  if (icon) {
    return (
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
    )
  }

  return <>{label}</>
}
