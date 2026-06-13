import { useMemo } from 'react'
import { cn } from '../../lib/cn'
import type { SidebarNavItem, SidebarNavGroup, SidebarNavProps } from './sidebar-nav.types'

// Re-export types for barrel
export type { SidebarNavItem, SidebarNavGroup, SidebarNavProps }

function NavItemButton({
  item,
  active,
  onSelect,
}: {
  item: SidebarNavItem
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      key={item.id}
      type="button"
      data-nav-id={item.id}
      aria-current={active ? 'page' : undefined}
      disabled={item.disabled}
      onClick={() => {
        if (!item.disabled) onSelect(item.id)
      }}
      className={cn(
        'relative my-px flex items-center gap-2 rounded-[4px] py-1.5 pr-3 text-left',
        'transition-colors duration-100 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring/50',
        active ? 'pl-4' : 'pl-3',
        item.disabled
          ? 'cursor-not-allowed opacity-50 text-muted-foreground'
          : active
            ? 'bg-accent text-foreground font-semibold'
            : 'text-muted-foreground hover:bg-accent/60',
      )}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.hasError && (
        <span
          aria-label="has error"
          className="size-1.5 shrink-0 rounded-full bg-destructive"
        />
      )}
    </button>
  )
}

function NavItemList({
  items,
  activeId,
  onSelect,
}: {
  items: SidebarNavItem[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <NavItemButton
          key={item.id}
          item={item}
          active={item.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

/**
 * SidebarNav — data-driven vertical navigation list.
 * Navigation via callback (no router). Supports optional grouping.
 */
export function SidebarNav({
  items,
  activeId,
  onSelect,
  groups,
  sidebarWidth = 200,
  className,
}: SidebarNavProps) {
  const grouped = useMemo(() => {
    const ungrouped = items.filter((i) => !i.group)
    const byGroup = new Map<string, SidebarNavItem[]>()
    items.forEach((i) => {
      if (!i.group) return
      const list = byGroup.get(i.group) ?? []
      list.push(i)
      byGroup.set(i.group, list)
    })
    return { ungrouped, byGroup }
  }, [items])

  const groupOrder: SidebarNavGroup[] =
    groups ?? Array.from(grouped.byGroup.keys()).map((key) => ({ key, label: key }))

  return (
    <nav
      data-slot="sidebar-nav"
      aria-label="Sidebar navigation"
      className={cn('flex flex-col', className)}
      style={{ width: sidebarWidth }}
    >
      {grouped.ungrouped.length > 0 && (
        <NavItemList items={grouped.ungrouped} activeId={activeId} onSelect={onSelect} />
      )}

      {groupOrder.map((g) => {
        const list = grouped.byGroup.get(g.key)
        if (!list || list.length === 0) return null
        return (
          <div key={g.key} className="mt-2">
            <div className="px-3 pb-1 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground opacity-70">
              {g.label}
            </div>
            <NavItemList items={list} activeId={activeId} onSelect={onSelect} />
          </div>
        )
      })}
    </nav>
  )
}
