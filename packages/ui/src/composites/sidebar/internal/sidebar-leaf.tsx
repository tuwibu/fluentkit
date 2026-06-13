import { useLayoutEffect, useRef } from 'react'
import { cx } from '../../../lib/cx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../primitives/tooltip'
import type { MenuLeaf } from '../sidebar.types'

// Collapsed mode shows icon-only; expanded shows icon + label + optional count badge.
const LEAF_BASE =
  'relative w-full flex items-center gap-3 px-3 py-[7px] rounded-[4px] text-body transition-all duration-100 text-foreground'

interface SidebarLeafProps {
  item: MenuLeaf
  isActive: boolean
  collapsed: boolean
  onSelect: (key: string) => void
  registerActive?: (el: HTMLElement | null) => void
}

function wrapTooltip(node: React.ReactNode, label: string) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export function SidebarLeaf({
  item,
  isActive,
  collapsed,
  onSelect,
  registerActive,
}: SidebarLeafProps) {
  const elRef = useRef<HTMLButtonElement>(null)
  const tip =
    item.tip ?? (typeof item.label === 'string' ? item.label : String(item.key))

  // useLayoutEffect so register fires before the browser paints — keeps snake-rail
  // position accurate on initial mount and active-key changes.
  useLayoutEffect(() => {
    if (!registerActive || !isActive) return
    registerActive(elRef.current)
    return () => registerActive(null)
  }, [isActive, registerActive])

  if (item.disabled) {
    const node = (
      <div
        data-active="false"
        className={cx(LEAF_BASE, 'opacity-40 cursor-not-allowed pointer-events-none')}
        aria-disabled="true"
      >
        <span
          className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center"
          style={item.color ? { color: item.color } : undefined}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <span className="truncate flex-1 text-left">{item.label}</span>
        )}
      </div>
    )
    return collapsed ? wrapTooltip(node, tip) : node
  }

  const node = (
    <button
      ref={elRef}
      type="button"
      data-active={isActive ? 'true' : 'false'}
      className={cx(
        LEAF_BASE,
        isActive ? 'bg-[var(--win11-hover)]' : 'hover:bg-[var(--win11-subtle)]',
      )}
      onClick={() => onSelect(item.key)}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center"
        style={item.color ? { color: item.color } : undefined}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.count != null && (
            <span className="ml-auto text-micro font-semibold text-muted-foreground tabular-nums">
              {item.count}
            </span>
          )}
        </>
      )}
    </button>
  )

  return collapsed ? wrapTooltip(node, tip) : node
}
