/**
 * table-view.tsx — PRIVATE
 * Renders <table> from a TanStack Table instance.
 * Handles: virtual rows, sticky header, expandable rows, row selection checkboxes.
 * Ported & decoupled from multiprofile-v2 data-grid-table (no store/services/wails).
 */
import { Fragment, useRef } from 'react'
import { flexRender, type Table, type Row } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Checkbox } from '../../../primitives/checkbox'
import { cn } from '../../../lib/cn'
import type { DataTableProps } from '../data-table.types'
import { LoadingRows, EmptyRow } from './table-states'
import { PaginationBar } from './pagination-bar'

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
  } = props

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
  const paddingBottom = hasVirtualItems
    ? totalVirtualSize - ((virtualItems.at(-1) as { end: number }).end)
    : 0

  const rowsToRender: Row<T>[] =
    hasVirtualItems ? virtualItems.map((vi) => rows[vi.index]) : rows

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
                  const canSort = header.column.getCanSort()
                  const sortDir = header.column.getIsSorted()
                  const align =
                    (header.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-3 py-2 font-medium text-muted-foreground whitespace-nowrap select-none',
                        canSort && 'cursor-pointer hover:text-foreground transition-colors',
                        align === 'center' && 'text-center',
                        align === 'right' && 'text-right',
                      )}
                      style={
                        header.column.columnDef.size
                          ? { width: header.column.columnDef.size }
                          : undefined
                      }
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
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
                      <span className="inline-flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span aria-hidden="true" className="text-xs opacity-50">
                            {sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'}
                          </span>
                        )}
                      </span>
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
                          const align =
                            (cell.column.columnDef.meta as { align?: string } | undefined)
                              ?.align ?? 'left'
                          return (
                            <td
                              key={cell.id}
                              className={cn(
                                'px-3 py-2',
                                align === 'center' && 'text-center',
                                align === 'right' && 'text-right',
                              )}
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
