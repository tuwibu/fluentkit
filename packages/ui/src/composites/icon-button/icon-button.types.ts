import type { MouseEvent, ReactNode } from 'react'

export interface IconButtonProps {
  /** Icon element to render inside the button. */
  icon: ReactNode
  /** Accessible label — required for screen readers. */
  'aria-label': string
  /** Visual style variant. Default: 'default'. */
  variant?: 'default' | 'outlined' | 'danger' | 'launch'
  /** Button size. Default: 'md'. */
  size?: 'sm' | 'md'
  /** When provided, wraps the button in a Tooltip. */
  tooltip?: ReactNode
  /** Disables the button. */
  disabled?: boolean
  /** Shows a loading spinner in place of the icon and disables the button. */
  loading?: boolean
  /** Click handler. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Additional CSS classes. */
  className?: string
}
