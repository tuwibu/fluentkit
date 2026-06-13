import { useCallback, useState } from 'react'
import { cx } from '../../lib/cx'
import { SidebarLeaf } from './internal/sidebar-leaf'
import { SidebarGroup } from './internal/sidebar-group'
import { SnakeRail } from './internal/snake-rail'
import { isGroup } from './sidebar.types'
import type { SidebarProps } from './sidebar.types'

export function Sidebar({
  items,
  activeKey,
  onSelect,
  collapsed = false,
  brand,
  userSlot,
  width = 220,
  collapsedWidth = 56,
  className,
}: SidebarProps) {
  const [asideEl, setAsideEl] = useState<HTMLElement | null>(null)
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null)

  const registerActive = useCallback((el: HTMLElement | null) => {
    setActiveEl((prev) => (prev === el ? prev : el))
  }, [])

  return (
    <aside
      ref={setAsideEl}
      data-slot="sidebar"
      aria-label="Main navigation"
      className={cx(
        'relative flex flex-col bg-transparent border-r',
        className,
      )}
      style={{
        width: collapsed ? `${collapsedWidth}px` : `${width}px`,
        borderColor: 'var(--win11-card-border)',
      }}
    >
      {/* Brand bar — h-12, logo 20px + name + version */}
      {brand && (
        <div
          className="h-12 shrink-0 flex items-center gap-2 px-4 select-none"
          style={{ borderBottom: '1px solid var(--win11-card-border)' }}
        >
          {brand.logo && (
            <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
              {brand.logo}
            </span>
          )}
          {!collapsed && brand.name && (
            <span className="text-body font-medium text-foreground">
              {brand.name}
            </span>
          )}
          {!collapsed && brand.version && (
            <span className="text-caption text-muted-foreground">
              {brand.version}
            </span>
          )}
        </div>
      )}

      {/* Snake rail — z-[60] ensures it renders above mica backdrop-filter stacking context */}
      <SnakeRail targetEl={activeEl} containerEl={asideEl} />

      {/* User slot — rendered above menu, below brand bar */}
      {userSlot && <div className="shrink-0">{userSlot}</div>}

      {/* Scroll area */}
      <div className="flex-1 overflow-auto px-2 py-1">
        <div className="py-[2px]">
          {items.map((item) =>
            isGroup(item) ? (
              <SidebarGroup
                key={item.key}
                group={item}
                activeKey={activeKey}
                collapsed={collapsed}
                onSelect={onSelect}
                registerActive={registerActive}
              />
            ) : (
              <SidebarLeaf
                key={item.key}
                item={item}
                isActive={item.key === activeKey}
                collapsed={collapsed}
                onSelect={onSelect}
                registerActive={registerActive}
              />
            ),
          )}
        </div>
      </div>
    </aside>
  )
}
