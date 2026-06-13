import type { ReactNode } from 'react'

export interface MenuLeaf {
  key: string
  label: ReactNode
  icon?: ReactNode
  /** Tooltip text — shown when sidebar is collapsed. Defaults to label if string. */
  tip?: string
  /** Per-icon tint hex — mirrors Windows 11 colored sidebar icons. */
  color?: string
  /** Badge count shown at right edge. */
  count?: number
  disabled?: boolean
}

export interface MenuGroup {
  key: string
  label: ReactNode
  icon?: ReactNode
  tip?: string
  color?: string
  children: MenuLeaf[]
}

export type MenuItem = MenuLeaf | MenuGroup

/** Type guard: true when item has children (MenuGroup). */
export function isGroup(item: MenuItem): item is MenuGroup {
  return 'children' in item && Array.isArray((item as MenuGroup).children)
}

export interface SidebarBrand {
  /** ReactNode — consumer passes <img> or any logo element. Rendered at 20px. */
  logo?: ReactNode
  name?: ReactNode
  version?: ReactNode
}

export interface SidebarProps {
  items: MenuItem[]
  activeKey: string
  onSelect: (key: string) => void
  collapsed?: boolean
  brand?: SidebarBrand
  /** Slot rendered above the menu scroll area, below the brand bar (user card, etc.). */
  userSlot?: ReactNode
  /** Sidebar width in px. Default 220. */
  width?: number
  /** Width in px when collapsed (icon-only mode). Default 56. */
  collapsedWidth?: number
  className?: string
}
