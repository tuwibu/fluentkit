import type { ReactNode } from 'react'

export interface HeaderProps {
  /** Page title rendered in the left zone. */
  title?: ReactNode
  /** Leading slot — e.g. back button, mobile nav toggle. */
  leading?: ReactNode
  /** Right-side custom actions rendered before the theme toggle. */
  actions?: ReactNode
  /** Notification slot rendered before `actions`. */
  notifications?: ReactNode
  /** Show the Sun/Moon theme-toggle button. Defaults to true. */
  showThemeToggle?: boolean
  /** Extra class names forwarded to the `<header>` element. */
  className?: string
}
