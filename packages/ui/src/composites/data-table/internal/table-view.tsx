/**
 * table-view.tsx — PRIVATE
 * Renders <table> from a TanStack Table instance.
 * Handles: virtual rows, sticky header, expandable rows, row selection checkboxes,
 *          column header menu (sort/pin/reorder/hide) when columnMenu is enabled.
 */
import { CSSProperties, Fragment, useRef } from 'react'
import { flexRender, type Table, type Row, type Column } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Checkbox } from '../../../primitives/checkbox'
import { cn } from '../../../lib/cn'
import type { DataTableProps } from '../data-table.types'
import { resolveColumnMenuConfig } from '../data-table.types'
import { LoadingRows, EmptyRow } from './table-states'
import { PaginationBar } from './pagination-bar'
import { ColumnHeaderMenu } from './column-header-menu'

export { PaginationBar }

// ── constants ────────────────────────────────────────────────────────────────
const DEFAULT_ROW_HEIGHT = 44
const DEFAULT_SKELETON_ROWS = 3

// ── helpers ──────────────────────────────────────────────────────────────────

function getSkeletonCount(loading: DataTableProps<unknown>['loading']): number {
  if (loading === true) return DEFAULT_SKELETON_ROWS
  if (typeof loading === 'object' && loading !== null) {
    return loading.skeletonRows ?? DEFAULT_SKELETON_ROWS
  }
  return DEFAULT_SKELETON_ROWS
}

/**
 * Returns inline styles for a pinned column cell (<th> or <td>).
 * When not pinned returns an empty object — no style applied.
 */
function getPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned()
  if (!isPinned) return {}
  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: 'sticky',
    zIndex: 2,
  }
}

// ── TableView ────────────────────────────────────────────────────────────────

interface TableViewProps<T> {
  table: Table<T>
  props: DataTableProps<T>
  /** Current page data forwarded to footer renderer. */
  currentPageRows: T[]
}

export function TableView<T extends object>({ table, props, currentPageRows }: TableViewProps<T>) {
  const {
    loading,
    expandable,
    scroll,
    footer,
    onRow,
    emptyText,
    rowSelection: rowSelectionConfig,
    columnMenu,
  } = props

  const menuConfig = resolveColumnMenuConfig(columnMenu)
  const menuEnabled = menuConfig !== null
  const pinEnabled = menuEnabled && menuConfig.pin

  const isLoading = loading === true || (typeof loading === 'object' && loading !== null)
  const hasScrollY = scroll?.y != null
  const scrollParentRef = useRef<HTMLDivElement>(null)

  const rows = table.getRowModel().rows as Row<T>[]
  const colSpan =
    table.getVisibleFlatColumns().length +
    (rowSelectionConfig ? 1 : 0) +
    (expandable ? 1 : 0)

  // Virtualizer — only when scroll.y set AND scrollParent has layout (not jsdom).
  const virtualizer = useVirtualizer({
    count: hasScrollY && !isLoading ? rows.length : 0,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => DEFAULT_ROW_HEIGHT,
    overscan: 5,
  })

  const virtualItems = hasScrollY && !isLoading ? virtualizer.getVirtualItems() : null
  const hasVirtualItems = virtualItems !== null && virtualItems.length > 0
  const totalVirtualSize = hasVirtualItems ? virtualizer.getTotalSize() : 0
  const paddingTop = hasVirtualItems ? (virtualItems[0] as { start: number }).start : 0
  const lastVirtualItem = hasVirtualItems ? virtualItems[virtualItems.length - 1] : undefined
  const paddingBottom = hasVirtualItems && lastVirtualItem
    ? totalVirtualSize - (lastVirtualItem as { end: number }).end
    : 0

  const rowsToRender: Row<T>[] =
    hasVirtualItems
      ? (virtualItems.map((vi) => rows[vi.index]).filter(Boolean) as Row<T>[])
      : rows

  return (
    <div data-slot="data-table" className="flex flex-col w-full overflow-hidden">
      {/* loading sentinel — single element with role="status" for AT + tests */}
      {isLoading && (
        <div data-slot="data-table-loading" role="status" aria-label="Loading" className="sr-only" />
      )}

      {/* Scroll container */}
      <div
        ref={scrollParentRef}
        className={cn('overflow-auto w-full', hasScrollY && 'relative')}
        style={hasScrollY ? { maxHeight: scroll!.y, overflowY: 'auto' } : undefined}
      >
        <table className="w-full border-collapse text-sm">
          {/* ── thead ── */}
          <thead className={cn(hasScrollY && 'sticky top-0 z-10 bg-background')}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border">
                {expandable && (
                  <th className="w-10 px-2 py-2 text-left" aria-label="Expand" />
                )}
                {rowSelectionConfig && (
                  <th className="w-10 px-2 py-2 text-left">
                    <Checkbox
                      aria-label="Select all"
                      checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
                      }
                      onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                  </th>
                )}
                {hg.headers.map((header) => {
                  const col = header.column
                  const canSort = col.getCanSort()
                  const sortDir = col.getIsSorted()
                  const align =
                    (col.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
                  const isPinned = col.getIsPinned()

                  // Derive string title for the menu trigger label.
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- meta is typed internally
                  const headerTitle: string = (col.columnDef.meta as any)?.headerTitle ?? col.id

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-3 py-2 font-medium text-muted-foreground whitespace-nowrap select-none',
                        !menuEnabled && canSort && 'cursor-pointer hover:text-foreground transition-colors',
                        align === 'center' && 'text-center',
                        align === 'right' && 'text-right',
                        // Pinned header: opaque background + shadow separator
                        isPinned && 'bg-background',
                        isPinned === 'left' && 'shadow-[inset_-1px_0_0_hsl(var(--border))]',
                        isPinned === 'right' && 'shadow-[inset_1px_0_0_hsl(var(--border))]',
                      )}
                      style={{
                        ...(col.columnDef.size ? { width: col.columnDef.size } : {}),
                        ...(pinEnabled ? getPinningStyles(col) : {}),
                      }}
                      // Only attach sort handler when menu is OFF (backward-compat click-to-sort).
                      onClick={!menuEnabled && canSort ? col.getToggleSortingHandler() : undefined}
                      aria-sort={
                        sortDir === 'asc'
                          ? 'ascending'
                          : sortDir === 'desc'
                          ? 'descending'
                          : canSort
                          ? 'none'
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : menuEnabled ? (
                        // Menu mode: wrap header content in dropdown trigger.
                        <ColumnHeaderMenu
                          column={col}
                          table={table}
                          config={menuConfig}
                          title={headerTitle}
                        />
                      ) : (
                        // Legacy mode: plain label + sort indicator.
                        <span className="inline-flex items-center gap-1">
                          {flexRender(col.columnDef.header, header.getContext())}
                          {canSort && (
                            <span aria-hidden="true" className="text-xs opacity-50">
                              {sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'}
                            </span>
                          )}
                        </span>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          {/* ── tbody ── */}
          <tbody>
            {isLoading ? (
              <LoadingRows
                table={table}
                skeletonCount={getSkeletonCount(loading)}
                hasExpandable={!!expandable}
                hasRowSelection={!!rowSelectionConfig}
              />
            ) : rows.length === 0 ? (
              <EmptyRow colSpan={colSpan} emptyText={emptyText} />
            ) : (
              <>
                {paddingTop > 0 && (
                  <tr aria-hidden="true" style={{ height: paddingTop }}>
                    <td colSpan={colSpan} />
                  </tr>
                )}
                {rowsToRender.map((row) => {
                  const canExpand = row.getCanExpand()
                  const isExpanded = row.getIsExpanded()
                  const isSelected = row.getIsSelected()
                  const rowHandlers = onRow ? onRow(row.original) : undefined
                  const rowKey = row.id

                  return (
                    <Fragment key={rowKey}>
                      <tr
                        data-slot="data-row"
                        data-state={isSelected ? 'selected' : undefined}
                        className={cn(
                          'border-b border-border transition-colors',
                          isSelected && 'bg-primary/5',
                          rowHandlers?.onClick && 'cursor-pointer hover:bg-muted/50',
                          !rowHandlers?.onClick && 'hover:bg-muted/30',
                        )}
                        onClick={
                          rowHandlers?.onClick
                            ? (e) => rowHandlers.onClick!(e as unknown as MouseEvent)
                            : undefined
                        }
                      >
                        {expandable && (
                          <td className="px-2 py-2 w-10">
                            <button
                              type="button"
                              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                              disabled={!canExpand}
                              onClick={(e) => {
                                e.stopPropagation()
                                row.toggleExpanded()
                              }}
                              className={cn(
                                'inline-flex items-center justify-center w-6 h-6 rounded text-muted-foreground transition-colors',
                                canExpand
                                  ? 'hover:bg-muted cursor-pointer'
                                  : 'opacity-30 cursor-not-allowed',
                              )}
                            >
                              <span aria-hidden="true">{isExpanded ? '▼' : '▶'}</span>
                            </button>
                          </td>
                        )}

                        {rowSelectionConfig && (
                          <td className="px-2 py-2 w-10">
                            <Checkbox
                              aria-label={`Select row ${row.id}`}
                              checked={isSelected}
                              onCheckedChange={(v) => row.toggleSelected(!!v)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                        )}

                        {row.getVisibleCells().map((cell) => {
                          const cellCol = cell.column
                          const align =
                            (cellCol.columnDef.meta as { align?: string } | undefined)
                              ?.align ?? 'left'
                          const isPinned = cellCol.getIsPinned()

                          return (
                            <td
                              key={cell.id}
                              className={cn(
                                'px-3 py-2',
                                align === 'center' && 'text-center',
                                align === 'right' && 'text-right',
                                // Pinned body cell: opaque bg + shadow separator
                                isPinned && 'bg-background',
                                isPinned === 'left' &&
                                  'shadow-[inset_-1px_0_0_hsl(var(--border))]',
                                isPinned === 'right' &&
                                  'shadow-[inset_1px_0_0_hsl(var(--border))]',
                              )}
                              style={pinEnabled ? getPinningStyles(cellCol) : undefined}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                        })}
                      </tr>

                      {expandable && isExpanded && (
                        <tr data-slot="expanded-row" key={`${rowKey}-expanded`}>
                          <td colSpan={colSpan} className="px-4 py-3 bg-muted/20">
                            {expandable.expandedRowRender(row.original)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
                {paddingBottom > 0 && (
                  <tr aria-hidden="true" style={{ height: paddingBottom }}>
                    <td colSpan={colSpan} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* footer */}
      {footer && !isLoading && (
        <div
          data-slot="data-table-footer"
          className="border-t border-border px-3 py-2 text-sm text-muted-foreground"
        >
          {footer(currentPageRows)}
        </div>
      )}
    </div>
  )
}
