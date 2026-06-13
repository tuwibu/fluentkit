import type { ReactNode } from 'react'

export interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Screen-reader accessible title (sr-only when no visible header title). */
  title: string
  /** Drawer side. Default 'right'. */
  side?: 'left' | 'right'
  /** Drawer width in px. Default 480. */
  width?: number
  /** Header slot: rendered at top, sticky. */
  header?: ReactNode
  /** Body slot: scrollable content area. */
  children?: ReactNode
  /** Footer slot: rendered at bottom. */
  footer?: ReactNode
}
