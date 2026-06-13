import type { ReactNode } from 'react'

export interface SidebarNavItem {
  id: string
  label: ReactNode
  /** Optional group key — items sharing a group render under a group label. */
  group?: string
  /** Show a red dot beside the label (e.g. validation error). */
  hasError?: boolean
  /** Icon rendered before label. */
  icon?: ReactNode
  /** Disable selection — item renders muted and non-interactive. */
  disabled?: boolean
}

export interface SidebarNavGroup {
  /** Group key matching items[].group */
  key: string
  label: ReactNode
}

export interface SidebarNavProps {
  items: SidebarNavItem[]
  /** Currently active item id. */
  activeId: string
  /** Called when user selects an item. */
  onSelect: (id: string) => void
  /** Optional group label definitions. */
  groups?: SidebarNavGroup[]
  /** Sidebar width in px. Default 200. */
  sidebarWidth?: number
  className?: string
}
