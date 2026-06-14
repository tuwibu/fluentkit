/**
 * column-header-menu.tsx — PRIVATE
 * Dropdown menu rendered inside a column header when `columnMenu` is enabled.
 * Supports: sort asc/desc/clear · pin left/right/unpin · reorder · hide + visibility submenu.
 */
import { useRef, useState } from 'react'
import type { Column, Table } from '@tanstack/react-table'
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  PinOff,
  EyeOff,
  Columns3,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from '../../../primitives/dropdown-menu'
import { cn } from '../../../lib/cn'
import type { ResolvedColumnMenuConfig } from '../data-table.types'

// ── helpers ──────────────────────────────────────────────────────────────────

function moveColumn<T>(
  table: Table<T>,
  columnId: string,
  direction: 'left' | 'right',
): void {
  const order = [...table.getState().columnOrder]
  const idx = order.indexOf(columnId)
  // Guard: if the column id isn't in the order (state diverged), bail out —
  // otherwise `idx === -1` would let the 'right' branch run splice(-1, …) and
  // silently move the wrong column.
  if (idx === -1) return
  if (direction === 'left' && idx > 0) {
    const next = [...order]
    // splice returns (string | undefined)[] — element is guaranteed non-null given idx > 0 check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const col = next.splice(idx, 1)[0]!
    next.splice(idx - 1, 0, col)
    table.setColumnOrder(next)
  } else if (direction === 'right' && idx < order.length - 1) {
    const next = [...order]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const col = next.splice(idx, 1)[0]!
    next.splice(idx + 1, 0, col)
    table.setColumnOrder(next)
  }
}

function canMove<T>(table: Table<T>, columnId: string, direction: 'left' | 'right'): boolean {
  const order = table.getState().columnOrder
  const idx = order.indexOf(columnId)
  return direction === 'left' ? idx > 0 : idx < order.length - 1
}

// ── SortIcon ─────────────────────────────────────────────────────────────────

function SortIcon<T>({ column }: { column: Column<T> }) {
  const sorted = column.getIsSorted()
  if (sorted === 'asc') return <ArrowUp className="size-3 opacity-60" aria-hidden />
  if (sorted === 'desc') return <ArrowDown className="size-3 opacity-60" aria-hidden />
  return <ArrowUpDown className="size-3 opacity-40" aria-hidden />
}

// ── ColumnHeaderMenu ─────────────────────────────────────────────────────────

interface ColumnHeaderMenuProps<T> {
  column: Column<T>
  table: Table<T>
  config: ResolvedColumnMenuConfig
  /** String title used for aria-label and trigger display. */
  title: string
}

export function ColumnHeaderMenu<T>({
  column,
  table,
  config,
  title,
}: ColumnHeaderMenuProps<T>) {
  const [open, setOpen] = useState(false)
  // Prevent re-opening when click closes the menu (radix pattern).
  const wasOpenRef = useRef(false)

  const canSort = config.sort && column.getCanSort()
  const canPin = config.pin && column.getCanPin()
  const isPinned = column.getIsPinned()
  const sorted = column.getIsSorted()

  const showSortSection = canSort
  const showPinSection = canPin
  const showReorderSection = config.reorder
  const showHideSection = config.hide

  // Collect hideable columns for the submenu.
  const hideableColumns = config.hide
    ? table.getAllColumns().filter((c) => c.getCanHide())
    : []

  return (
    <div className="inline-flex items-center gap-1 h-full w-full">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger
          asChild
          onPointerDown={(e) => {
            e.preventDefault()
            wasOpenRef.current = open
          }}
          onClick={() => {
            if (wasOpenRef.current) return
            setOpen(true)
          }}
        >
          <button
            type="button"
            data-slot="column-menu-trigger"
            aria-label={`Column options for ${title}`}
            className={cn(
              'inline-flex items-center gap-1.5 h-full px-0 border-0 bg-transparent',
              'font-[inherit] text-sm font-medium cursor-pointer select-none whitespace-nowrap',
              'text-muted-foreground transition-colors duration-150',
              'hover:text-foreground focus-visible:outline-none focus-visible:text-foreground',
              open && 'text-foreground',
            )}
          >
            <span>{title}</span>
            {canSort && <SortIcon column={column} />}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" style={{ minWidth: 180 }}>
          {/* ── Sort section ── */}
          {showSortSection && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  sorted === 'asc' ? column.clearSorting() : column.toggleSorting(false)
                }
              >
                <ArrowUp className="size-4" aria-hidden />
                <span className="flex-1">Sort ascending</span>
                {sorted === 'asc' && <Check className="size-3.5" aria-hidden />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  sorted === 'desc' ? column.clearSorting() : column.toggleSorting(true)
                }
              >
                <ArrowDown className="size-4" aria-hidden />
                <span className="flex-1">Sort descending</span>
                {sorted === 'desc' && <Check className="size-3.5" aria-hidden />}
              </DropdownMenuItem>
              {sorted && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <ArrowUpDown className="size-4" aria-hidden />
                  <span className="flex-1">Clear sort</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* ── Pin section ── */}
          {showSortSection && showPinSection && <DropdownMenuSeparator />}
          {showPinSection && (
            <>
              <DropdownMenuItem
                onClick={() => column.pin(isPinned === 'left' ? false : 'left')}
              >
                <ArrowLeftToLine className="size-4" aria-hidden />
                <span className="flex-1">Pin to left</span>
                {isPinned === 'left' && <Check className="size-3.5" aria-hidden />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.pin(isPinned === 'right' ? false : 'right')}
              >
                <ArrowRightToLine className="size-4" aria-hidden />
                <span className="flex-1">Pin to right</span>
                {isPinned === 'right' && <Check className="size-3.5" aria-hidden />}
              </DropdownMenuItem>
              {isPinned && (
                <DropdownMenuItem onClick={() => column.pin(false)}>
                  <PinOff className="size-4" aria-hidden />
                  <span className="flex-1">Unpin</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* ── Reorder section ── */}
          {(showSortSection || showPinSection) && showReorderSection && (
            <DropdownMenuSeparator />
          )}
          {showReorderSection && (
            <>
              <DropdownMenuItem
                disabled={!canMove(table, column.id, 'left') || isPinned !== false}
                onClick={() => moveColumn(table, column.id, 'left')}
              >
                <ArrowLeft className="size-4" aria-hidden />
                <span>Move left</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canMove(table, column.id, 'right') || isPinned !== false}
                onClick={() => moveColumn(table, column.id, 'right')}
              >
                <ArrowRight className="size-4" aria-hidden />
                <span>Move right</span>
              </DropdownMenuItem>
            </>
          )}

          {/* ── Hide / Visibility section ── */}
          {(showSortSection || showPinSection || showReorderSection) && showHideSection && (
            <DropdownMenuSeparator />
          )}
          {showHideSection && (
            <>
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="size-4" aria-hidden />
                <span>Hide column</span>
              </DropdownMenuItem>
              {hideableColumns.length > 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Columns3 className="size-4" aria-hidden />
                    <span>Columns</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {hideableColumns.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        checked={col.getIsVisible()}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
                      >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- meta shape is typed internally */}
                        {(col.columnDef.meta as any)?.headerTitle ?? col.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
