import type { ReactNode, LegacyRef } from 'react'

export interface DrawerSectionProps {
  /** Optional Lucide icon component (16×16). */
  icon?: ReactNode
  /** Section heading. */
  title: string
  /** Count shown next to title as "(N)". */
  count?: number
  /** Action slot rendered at the right of the header row. */
  action?: ReactNode
  /** When true, adds `p-4` to the body area. */
  padded?: boolean
  children: ReactNode
  className?: string
  'aria-label'?: string
  ref?: LegacyRef<HTMLElement>
}

export interface DrawerInfoRowProps {
  label: ReactNode
  value?: string | null
  /** Renders value in monospace font. */
  monospace?: boolean
  /** Full-width slot rendered below the row (e.g. TOTP countdown). */
  footer?: ReactNode
}
