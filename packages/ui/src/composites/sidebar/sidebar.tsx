import { useCallback, useLayoutEffect, useState } from 'react'
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

  // Re-resolve the active element from the live DOM whenever collapse state or
  // the active key changes. Toggling `collapsed` remounts the leaf button (the
  // tooltip wrapper is conditional), which can leave the registered ref pointing
  // at a detached node — the snake-rail would then measure a zeroed rect and
  // stick at the top. Querying [data-active="true"] always yields the current
  // button so the rail re-aligns after every collapse/expand.
  useLayoutEffect(() => {
    if (!asideEl) return
    const el = asideEl.querySelector<HTMLElement>('[data-active="true"]')
    // Ignore an element that is present but not laid out (e.g. the active item
    // inside a collapsed group with max-height:0) — its zeroed rect would stick
    // the rail at the top. Leave activeEl as registerActive set it in that case.
    if (el && el.getBoundingClientRect().height === 0) return
    setActiveEl((prev) => (prev === el ? prev : el))
  }, [collapsed, activeKey, asideEl])

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
        transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
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
