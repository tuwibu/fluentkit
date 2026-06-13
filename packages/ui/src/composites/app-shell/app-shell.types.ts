import type { ReactNode } from 'react'
import type { MenuItem, SidebarBrand } from '../sidebar/sidebar.types'

export interface AppShellProps {
  /** Navigation items passed to Sidebar. */
  menu: MenuItem[]
  /** Currently active nav key. */
  activeKey: string
  /** Called when a nav item is selected. */
  onSelect: (key: string) => void
  /** Sidebar brand slot (logo / name / version). */
  brand?: SidebarBrand
  /** Slot rendered at the bottom of the sidebar — typically a UserDropdown. */
  user?: ReactNode
  /** Title rendered in the Header left zone. */
  headerTitle?: ReactNode
  /** Right-side actions rendered in the Header. */
  headerActions?: ReactNode
  /** Full-width footer rendered below the sidebar+content row. */
  footer?: ReactNode
  /** Page content. */
  children: ReactNode
  /** Start the sidebar in collapsed state. Default false. */
  defaultCollapsed?: boolean
}
