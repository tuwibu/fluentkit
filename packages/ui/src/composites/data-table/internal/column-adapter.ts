/**
 * column-adapter.ts — PRIVATE
 * Maps ColumnDef<T> (antd-shape, phase 4 contract) → TanStack ColumnDef<T>.
 * Nothing from this file is exported from the barrel.
 */
import {
  type ColumnDef as TanstackColumnDef,
  type SortingFn,
  type CellContext,
} from '@tanstack/react-table'
import type { ColumnDef as FacadeColumnDef } from '../data-table.types'

/**
 * Converts one facade ColumnDef<T> to the TanStack equivalent.
 *
 * Key mapping decisions:
 * - When `dataIndex` present: use `accessorKey` (TanStack derives `id` from it).
 *   We also set `id: col.key` to ensure stable identity matching phase-4 key contract.
 * - When no `dataIndex`: use `accessorFn: () => undefined` (action/computed column).
 * - `render` → TanStack `cell`; omitted when no render (TanStack uses default string cell).
 * - `sorter: true` → enableSorting=true, no sortingFn (server-side signal or alphanumeric).
 * - `sorter: fn` → enableSorting=true + custom sortingFn.
 */
export function adaptColumn<T>(col: FacadeColumnDef<T>): TanstackColumnDef<T> {
  const hasSorter = col.sorter !== undefined && col.sorter !== false
  const isLocalSorter = typeof col.sorter === 'function'

  const sortingFn: SortingFn<T> | undefined = isLocalSorter
    ? (rowA, rowB, _colId) =>
        (col.sorter as (a: T, b: T) => number)(rowA.original, rowB.original)
    : undefined

  // Build cell renderer only when custom render exists.
  // When omitted TanStack renders getValue() via its default cell.
  const cellRenderer = col.render
    ? (ctx: CellContext<T, unknown>) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- value type intentionally unknown per contract
        col.render!(ctx.getValue() as any, ctx.row.original, ctx.row.index)
    : undefined

  const base: TanstackColumnDef<T> = {
    id: col.key,
    header: () => col.title,
    enableSorting: hasSorter,
    ...(sortingFn ? { sortingFn } : {}),
    ...(cellRenderer ? { cell: cellRenderer } : {}),
    ...(col.width != null && typeof col.width === 'number' ? { size: col.width } : {}),
    meta: {
      align: col.align ?? 'left',
      fixed: col.fixed,
      ellipsis: col.ellipsis,
    },
  }

  if (col.dataIndex != null) {
    // TanStack accessorKey must be a string key of T.
    // We cast because ColumnDef<T>.dataIndex is keyof T (string | number | symbol).
    return {
      ...base,
      accessorKey: col.dataIndex as string,
    }
  }

  // No dataIndex: computed/action column — accessor returns undefined, render handles display.
  return {
    ...base,
    accessorFn: (_row: T) => undefined,
  }
}

/**
 * Converts an array of facade ColumnDefs to TanStack ColumnDefs.
 */
export function adaptColumns<T>(cols: FacadeColumnDef<T>[]): TanstackColumnDef<T>[] {
  return cols.map(adaptColumn)
}
