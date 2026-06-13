/**
 * use-table-engine.ts — PRIVATE
 * Creates and owns the TanStack Table instance from facade DataTableProps.
 * Nothing from this file is exported from the barrel.
 */
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  type Table,
  type SortingState,
  type RowSelectionState,
  type ExpandedState,
  type PaginationState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import type { DataTableProps } from '../data-table.types'
import { adaptColumns } from './column-adapter'

interface TableEngineResult<T> {
  table: Table<T>
  /** Current page rows (for footer renderer). */
  currentPageRows: T[]
}

export function useTableEngine<T extends object>(
  props: DataTableProps<T>,
): TableEngineResult<T> {
  const {
    columns,
    dataSource,
    rowKey,
    pagination,
    rowSelection: rowSelectionConfig,
    expandable,
  } = props

  // ── sorting state (local) ────────────────────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([])

  // ── row selection: derive TanStack state from controlled selectedRowKeys ─
  const rowSelectionState = useMemo<RowSelectionState>(() => {
    if (!rowSelectionConfig) return {}
    return rowSelectionConfig.selectedRowKeys.reduce<RowSelectionState>((acc, key) => {
      acc[key] = true
      return acc
    }, {})
  }, [rowSelectionConfig])

  // ── expanded state (local) ───────────────────────────────────────────────
  const [expanded, setExpanded] = useState<ExpandedState>({})

  // ── getRowId ─────────────────────────────────────────────────────────────
  const getRowId = useMemo(
    () =>
      typeof rowKey === 'function'
        ? (row: T) => (rowKey as (r: T) => string)(row)
        : (row: T) => {
            const val = (row as Record<string, unknown>)[rowKey as string]
            return val != null ? String(val) : ''
          },
    [rowKey], // rowKey is a prop — stable string or stable fn reference
  )

  // ── adapted columns ──────────────────────────────────────────────────────
  const tanstackColumns = useMemo(() => adaptColumns<T>(columns), [columns])

  // ── pagination state ─────────────────────────────────────────────────────
  // When pagination=false/undefined: show all rows (no paginator, no manual pages).
  // When pagination config object: server-driven (manualPagination=true).
  const isServerPagination = !!(pagination && pagination !== false)

  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9999,
  })

  const controlledPagination: PaginationState = isServerPagination
    ? {
        pageIndex: (pagination as NonNullable<typeof pagination>).current - 1,
        pageSize: (pagination as NonNullable<typeof pagination>).pageSize,
      }
    : localPagination

  // ── table instance ───────────────────────────────────────────────────────
  const table = useReactTable<T>({
    data: dataSource,
    columns: tanstackColumns,
    getRowId,

    state: {
      sorting,
      rowSelection: rowSelectionState,
      expanded,
      pagination: controlledPagination,
    },

    // Row selection
    onRowSelectionChange: (updater) => {
      if (!rowSelectionConfig) return
      const next =
        typeof updater === 'function' ? updater(rowSelectionState) : updater
      const keys = Object.keys(next).filter((k) => next[k])
      const selectedRows = dataSource.filter((r) => keys.includes(getRowId(r)))
      rowSelectionConfig.onChange(keys, selectedRows)
    },
    enableRowSelection: !!rowSelectionConfig,

    // Sorting (local)
    onSortingChange: setSorting,
    manualSorting: false,

    // Expanded
    onExpandedChange: setExpanded,
    getRowCanExpand: expandable
      ? (row) =>
          expandable.rowExpandable ? expandable.rowExpandable(row.original) : true
      : () => false,

    // Pagination
    manualPagination: isServerPagination,
    pageCount: isServerPagination
      ? Math.ceil(
          (pagination as NonNullable<typeof pagination>).total /
            (pagination as NonNullable<typeof pagination>).pageSize,
        )
      : undefined,
    onPaginationChange: isServerPagination
      ? () => {
          // Server-driven: parent controls current page via props.
          // User interaction goes through PaginationBar → pagination.onChange.
        }
      : setLocalPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  const currentPageRows = table.getRowModel().rows.map((r) => r.original)

  return { table, currentPageRows }
}
