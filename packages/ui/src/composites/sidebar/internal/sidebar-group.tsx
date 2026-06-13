import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from '../../../lib/cx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../primitives/tooltip'
import type { MenuGroup, MenuLeaf } from '../sidebar.types'

// Indented sub-leaf button: slightly smaller left padding than the group header
// to visually communicate hierarchy without using a border-left line.
const SUB_BASE =
  'relative w-full flex items-center gap-3 pl-9 pr-3 py-[7px] rounded-[4px] text-body transition-all duration-100 text-foreground'

const COLLAPSED_LEAF_BASE =
  'relative w-full flex items-center gap-3 px-3 py-[7px] rounded-[4px] text-body transition-all duration-100 text-foreground'

interface SubLeafProps {
  item: MenuLeaf
  isActive: boolean
  parentOpen: boolean
  onSelect: (key: string) => void
  registerActive?: (el: HTMLElement | null) => void
}

function SubLeaf({ item, isActive, parentOpen, onSelect, registerActive }: SubLeafProps) {
  const elRef = useRef<HTMLButtonElement>(null)

  // MUST be useLayoutEffect to match SidebarLeaf — mismatched effect types make the
  // register/unregister ordering wrong across the sub↔leaf boundary.
  useLayoutEffect(() => {
    if (!registerActive || !isActive || !parentOpen) return
    registerActive(elRef.current)
    return () => registerActive(null)
  }, [isActive, parentOpen, registerActive])

  const iconNode = item.icon && (
    <span
      className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center"
      style={item.color ? { color: item.color } : undefined}
    >
      {item.icon}
    </span>
  )

  if (item.disabled) {
    return (
      <div
        className={cx(SUB_BASE, 'opacity-40 pointer-events-none select-none')}
        aria-disabled="true"
      >
        {iconNode}
        <span className="truncate">{item.label}</span>
      </div>
    )
  }

  return (
    <button
      ref={elRef}
      type="button"
      data-active={isActive ? 'true' : 'false'}
      className={cx(
        SUB_BASE,
        isActive ? 'bg-[var(--win11-hover)]' : 'hover:bg-[var(--win11-subtle)]',
      )}
      onClick={() => onSelect(item.key)}
      aria-current={isActive ? 'page' : undefined}
    >
      {iconNode}
      <span className="truncate">{item.label}</span>
    </button>
  )
}

interface CollapsedGroupLeafProps {
  item: MenuLeaf
  mergedItem: MenuLeaf
  leafTip: string
  isActive: boolean
  onSelect: (key: string) => void
  registerActive?: (el: HTMLElement | null) => void
}

// Collapsed-mode leaf: registers itself with the snake-rail when active,
// mirroring the same contract as SidebarLeaf / SubLeaf in expanded mode.
function CollapsedGroupLeaf({
  item,
  mergedItem,
  leafTip,
  isActive,
  onSelect,
  registerActive,
}: CollapsedGroupLeafProps) {
  const elRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    if (!registerActive || !isActive) return
    registerActive(elRef.current)
    return () => registerActive(null)
  }, [isActive, registerActive])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={elRef}
          type="button"
          data-active={isActive ? 'true' : 'false'}
          className={cx(
            COLLAPSED_LEAF_BASE,
            isActive ? 'bg-[var(--win11-hover)]' : 'hover:bg-[var(--win11-subtle)]',
          )}
          onClick={() => onSelect(item.key)}
          aria-current={isActive ? 'page' : undefined}
        >
          <span
            className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center"
            style={mergedItem.color ? { color: mergedItem.color } : undefined}
          >
            {mergedItem.icon}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {leafTip}
      </TooltipContent>
    </Tooltip>
  )
}

interface SidebarGroupProps {
  group: MenuGroup
  activeKey: string
  collapsed: boolean
  onSelect: (key: string) => void
  registerActive?: (el: HTMLElement | null) => void
}

export function SidebarGroup({
  group,
  activeKey,
  collapsed,
  onSelect,
  registerActive,
}: SidebarGroupProps) {
  const isInside = group.children.some((c) => c.key === activeKey)
  const [open, setOpen] = useState(isInside)
  const tip =
    group.tip ?? (typeof group.label === 'string' ? group.label : String(group.key))

  // Auto-open when active key moves inside this group
  useEffect(() => {
    if (isInside) setOpen(true)
  }, [isInside])

  // Collapsed: flatten children as individual tooltip-wrapped leaves
  if (collapsed) {
    return (
      <>
        {group.children.map((c) => {
          const leafTip =
            c.tip ?? (typeof c.label === 'string' ? c.label : tip)
          const mergedItem: MenuLeaf = {
            ...c,
            icon: c.icon ?? group.icon,
            tip: leafTip,
            color: c.color ?? group.color,
          }

          return (
            <CollapsedGroupLeaf
              key={c.key}
              item={c}
              mergedItem={mergedItem}
              leafTip={leafTip}
              isActive={c.key === activeKey}
              onSelect={onSelect}
              registerActive={registerActive}
            />
          )
        })}
      </>
    )
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        data-tip={tip}
        data-active={isInside ? 'true' : 'false'}
        className={cx(
          'relative w-full flex items-center gap-3 px-3 py-[7px] rounded-[4px] text-body transition-all duration-100 text-foreground',
          isInside ? 'bg-[var(--win11-hover)]' : 'hover:bg-[var(--win11-subtle)]',
        )}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span
          className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center"
          style={group.color ? { color: group.color } : undefined}
        >
          {group.icon}
        </span>
        <span className="truncate flex-1 text-left">{group.label}</span>
        <ChevronRight
          size={14}
          strokeWidth={2}
          className={cx(
            'ml-auto text-muted-foreground transition-transform duration-200 flex-shrink-0',
            open && 'rotate-90',
          )}
          aria-hidden
        />
      </button>

      {/* Children — animated collapse via maxHeight */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{
          maxHeight: open ? `${group.children.length * 36}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="flex flex-col gap-[2px] my-[1px] mb-[4px]">
          {group.children.map((c) => (
            <SubLeaf
              key={c.key}
              item={c}
              isActive={c.key === activeKey}
              parentOpen={open}
              onSelect={onSelect}
              registerActive={registerActive}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
