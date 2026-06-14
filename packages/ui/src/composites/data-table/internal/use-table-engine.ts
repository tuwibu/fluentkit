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
  type ColumnPinningState,
  type VisibilityState,
  type ColumnSizingState,
  type ColumnSizingInfoState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import type { DataTableProps } from '../data-table.types'
import { resolveColumnMenuConfig } from '../data-table.types'
import { adaptColumns } from './column-adapter'

interface TableEngineResult<T> {
  table: Table<T>
  /** Current page rows (for footer renderer). */
  currentPageRows: T[]
  /** True when at least one column opted into resize — activates fixed layout + handles. */
  resizeEnabled: boolean
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
    columnMenu,
  } = props

  const menuConfig = resolveColumnMenuConfig(columnMenu)
  const menuEnabled = menuConfig !== null

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

  // ── column pinning (opt-in) ──────────────────────────────────────────────
  // Initialise from facade `fixed` prop so existing usage is honoured.
  const initialPinning = useMemo<ColumnPinningState>(() => {
    if (!menuEnabled) return {}
    const left: string[] = []
    const right: string[] = []
    for (const col of columns) {
      if (col.fixed === 'left') left.push(col.key)
      else if (col.fixed === 'right') right.push(col.key)
    }
    return { left, right }
  }, [columns, menuEnabled])

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialPinning)

  // ── column resize (opt-in per column via `resize: true`) ─────────────────
  const resizeEnabled = useMemo(() => columns.some((c) => c.resize), [columns])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    columnSizingStart: [],
  })

  // ── column order (opt-in) ────────────────────────────────────────────────
  // Seeded once from the facade column keys. Two constraints when `reorder` is
  // enabled: (1) the `columns` prop must be stable after mount — adding/removing
  // columns at runtime won't be reflected here, so a new column would be hidden
  // by TanStack until remount; (2) select/expand are rendered as raw <th>/<td>
  // outside the TanStack column pipeline, so they are intentionally NOT in the
  // order. If they are ever migrated to TanStack columns, seed their ids here.
  const initialOrder = useMemo<string[]>(
    () => (menuEnabled ? columns.map((c) => c.key) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only on mount
    [],
  )
  const [columnOrder, setColumnOrder] = useState<string[]>(initialOrder)

  // ── column visibility (opt-in) ───────────────────────────────────────────
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

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
  const tanstackColumns = useMemo(
    () => adaptColumns<T>(columns, menuConfig),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- menuConfig is derived from columnMenu prop
    [columns, columnMenu],
  )

  // ── pagination state ─────────────────────────────────────────────────────
  // When pagination=false/undefined: show all rows (no paginator, no manual pages).
  // When pagination config object: server-driven (manualPagination=true).
  const isServerPagination = pagination !== undefined && pagination !== false

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
      ...(menuEnabled && { columnPinning, columnOrder, columnVisibility }),
      ...(resizeEnabled && { columnSizing, columnSizingInfo }),
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

    // Column menu features (opt-in)
    ...(menuEnabled && {
      onColumnPinningChange: setColumnPinning,
      onColumnOrderChange: setColumnOrder,
      onColumnVisibilityChange: setColumnVisibility,
    }),

    // Column resize (opt-in) — live width updates while dragging.
    ...(resizeEnabled && {
      columnResizeMode: 'onChange' as const,
      enableColumnResizing: true,
      onColumnSizingChange: setColumnSizing,
      onColumnSizingInfoChange: setColumnSizingInfo,
    }),

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  const currentPageRows = table.getRowModel().rows.map((r) => r.original)

  return { table, currentPageRows, resizeEnabled }
}
