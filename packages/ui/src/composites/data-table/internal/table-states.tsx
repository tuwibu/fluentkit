/**
 * table-states.tsx — PRIVATE
 * Skeleton loading rows and empty-state row for DataTable.
 */
import type { Table } from '@tanstack/react-table'
import { Skeleton } from '../../../primitives/skeleton'
import type { DataTableProps } from '../data-table.types'

interface LoadingRowsProps<T> {
  table: Table<T>
  skeletonCount: number
  hasExpandable: boolean
  hasRowSelection: boolean
}

export function LoadingRows<T>({
  table,
  skeletonCount,
  hasExpandable,
  hasRowSelection,
}: LoadingRowsProps<T>) {
  return (
    <>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <tr key={i} data-slot="skeleton-row">
          {hasExpandable && <td className="px-2 py-2" />}
          {hasRowSelection && <td className="px-2 py-2" />}
          {table.getVisibleFlatColumns().map((col) => (
            <td key={col.id} className="px-3 py-2">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

interface EmptyRowProps {
  colSpan: number
  emptyText: DataTableProps<unknown>['emptyText']
}

export function EmptyRow({ colSpan, emptyText }: EmptyRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        data-slot="data-table-empty"
        className="py-12 text-center text-muted-foreground"
      >
        {emptyText ?? 'No data'}
      </td>
    </tr>
  )
}
