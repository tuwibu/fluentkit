/**
 * data-table.tsx — PUBLIC facade
 * Accepts DataTableProps<T> (antd-shape, phase 4 contract).
 * Delegates to internal/ layers; ZERO TanStack types in this file's public surface.
 */
import type { DataTableProps, PaginationConfig } from './data-table.types'
import { useTableEngine } from './internal/use-table-engine'
import { TableView, PaginationBar } from './internal/table-view'

function isPaginationConfig(p: DataTableProps<unknown>['pagination']): p is PaginationConfig {
  return !!p && typeof p === 'object'
}

export function DataTable<T extends object>(props: DataTableProps<T>) {
  const { table, currentPageRows, resizeEnabled } = useTableEngine(props)
  const pag = isPaginationConfig(props.pagination) ? props.pagination : null
  const bordered = props.bordered !== false

  const inner = (
    <>
      <TableView
        table={table}
        props={props}
        currentPageRows={currentPageRows}
        resizeEnabled={resizeEnabled}
      />
      {pag && (
        <PaginationBar
          current={pag.current}
          pageSize={pag.pageSize}
          total={pag.total}
          onChange={pag.onChange}
        />
      )}
    </>
  )

  if (bordered) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col overflow-hidden rounded-lg backdrop-blur-xl bg-[var(--win11-card-bg)] border border-[var(--win11-card-border)]">
          {inner}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      {inner}
    </div>
  )
}
