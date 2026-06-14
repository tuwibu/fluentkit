import type { ReactNode } from 'react'

/**
 * Column menu feature flags.
 * Each key maps to one section of the column header dropdown.
 */
export interface ColumnMenuConfig {
  /** Sort asc / desc / clear via dropdown. Default when `columnMenu=true`. */
  sort?: boolean
  /** Pin column left / right / unpin. Default when `columnMenu=true`. */
  pin?: boolean
  /** Move column left / right via dropdown. Default when `columnMenu=true`. */
  reorder?: boolean
  /** Hide this column / toggle any column visibility. Default when `columnMenu=true`. */
  hide?: boolean
}

/**
 * Column definition for DataTable.
 * Generic over the row data type T.
 *
 * Intentionally mirrors antd Table ColumnType subset.
 * Internal implementation (TanStack Table) must NOT leak here.
 */
export interface ColumnDef<T> {
  /** Unique column key — used as React key and for internal tracking. */
  key: string
  /** Column header content. */
  title: ReactNode
  /** Maps to a field in the row record. Omit for computed/action columns. */
  dataIndex?: keyof T
  /** Column width in px or CSS string (e.g. '10%'). */
  width?: number | string
  /** Horizontal alignment of cell content. Default: 'left'. */
  align?: 'left' | 'center' | 'right'
  /** Pin column to left or right edge. */
  fixed?: 'left' | 'right'
  /**
   * Enable sorting.
   * - `true` → server-side sort signal (no local compare).
   * - `(a, b) => number` → local compare function.
   */
  sorter?: boolean | ((a: T, b: T) => number)
  /** Truncate overflow text with ellipsis. */
  ellipsis?: boolean
  /**
   * Custom cell renderer.
   * @param value   - The value at `dataIndex` (or undefined if no dataIndex).
   * @param record  - The full row record.
   * @param index   - Row index in the current page.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- value type is intentionally unknown at column level
  render?: (value: any, record: T, index: number) => ReactNode
  /**
   * Allow this column to be pinned via the column menu.
   * Only relevant when `columnMenu.pin` is enabled.
   * Default: `true`.
   */
  enablePinning?: boolean
  /**
   * Allow this column to be hidden via the column menu.
   * Only relevant when `columnMenu.hide` is enabled.
   * Default: `true`.
   */
  enableHiding?: boolean
}

/** Server-driven pagination descriptor. */
export interface PaginationConfig {
  /** Current page number (1-based). */
  current: number
  /** Number of rows per page. */
  pageSize: number
  /** Total number of records across all pages. */
  total: number
  /** Called when the user navigates to a new page or changes page size. */
  onChange: (page: number, pageSize: number) => void
}

/** Expandable rows config — renders an expanded row beneath a data row. */
export interface ExpandableConfig<T> {
  /** Renders the expanded content for a given record. */
  expandedRowRender: (record: T) => ReactNode
  /** Controls whether a given row can be expanded. Default: all rows expandable. */
  rowExpandable?: (record: T) => boolean
}

/** Row selection config — checkbox-based multi-select. */
export interface RowSelectionConfig<T> {
  /** Keys of currently selected rows (must match `rowKey` values). */
  selectedRowKeys: string[]
  /** Called when selection changes. */
  onChange: (keys: string[], rows: T[]) => void
}

/** Scroll constraints for the table container. */
export interface ScrollConfig {
  /** Horizontal scroll boundary. Set to enable horizontal scrolling. */
  x?: number | string
  /** Vertical scroll boundary. Set to enable vertical scrolling with sticky header. */
  y?: number | string
}

/**
 * Props for the DataTable composite component.
 * Generic over T — the shape of a single row record.
 *
 * API mirrors antd Table props subset. The backing implementation
 * (TanStack Table) is an internal detail and must NOT appear here.
 */
export interface DataTableProps<T> {
  /**
   * Determines the unique key for each row.
   * - `keyof T` → uses that field's value (must be string or number).
   * - `(record: T) => string` → custom key function.
   */
  rowKey: keyof T | ((record: T) => string)
  /** Column definitions. */
  columns: ColumnDef<T>[]
  /** Array of row records to display. */
  dataSource: T[]
  /**
   * Loading state.
   * - `true` → show default skeleton/spinner.
   * - `{ skeletonRows }` → skeleton with custom row count.
   * - `false` / omit → not loading.
   */
  loading?: boolean | { skeletonRows?: number }
  /**
   * Pagination config.
   * - Object → renders pagination bar.
   * - `false` → hide pagination entirely (show all rows).
   */
  pagination?: PaginationConfig | false
  /** Expandable row configuration. */
  expandable?: ExpandableConfig<T>
  /** Row selection configuration. */
  rowSelection?: RowSelectionConfig<T>
  /** Scroll constraints. */
  scroll?: ScrollConfig
  /**
   * Footer renderer — receives the current page rows.
   * Rendered below the table body.
   */
  footer?: (currentPageData: T[]) => ReactNode
  /**
   * Row-level event handlers.
   * @returns An object of event handlers attached to the `<tr>` element.
   */
  onRow?: (record: T) => { onClick?: (e: MouseEvent) => void }
  /** Content to display when `dataSource` is empty. */
  emptyText?: ReactNode
  /**
   * Render card wrapper around the table.
   * Default: `true`. Pass `false` to render a flat table without card border
   * so it can be embedded inside an outer card container.
   */
  bordered?: boolean
  /**
   * Column header dropdown menu (OPT-IN).
   *
   * - `true` → enable all features: sort, pin, reorder, hide.
   * - `ColumnMenuConfig` → enable only selected features.
   * - `false` / omit → no menu; click-to-sort via `sorter` still works (backward-compat).
   */
  columnMenu?: boolean | ColumnMenuConfig
}

/** Resolved (normalised) column menu config — all fields are booleans. */
export interface ResolvedColumnMenuConfig {
  sort: boolean
  pin: boolean
  reorder: boolean
  hide: boolean
}

/** Returns a fully-resolved config from the `columnMenu` prop. */
export function resolveColumnMenuConfig(
  columnMenu: DataTableProps<unknown>['columnMenu'],
): ResolvedColumnMenuConfig | null {
  if (!columnMenu) return null
  if (columnMenu === true) return { sort: true, pin: true, reorder: true, hide: true }
  return {
    sort: columnMenu.sort ?? false,
    pin: columnMenu.pin ?? false,
    reorder: columnMenu.reorder ?? false,
    hide: columnMenu.hide ?? false,
  }
}
