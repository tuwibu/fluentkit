/**
 * column-resize-handle.tsx — PRIVATE
 * Drag handle rendered at a header cell's right edge when the column is
 * resizable. Mirrors the multiprofile-v2 reference: a thin absolute strip with
 * a col-resize cursor; double-click resets the column to its default size.
 * Not exported from the barrel.
 */
import type { Header } from '@tanstack/react-table'
import { cn } from '../../../lib/cn'

interface ColumnResizeHandleProps<T> {
  header: Header<T, unknown>
}

export function ColumnResizeHandle<T>({ header }: ColumnResizeHandleProps<T>) {
  const isResizing = header.column.getIsResizing()

  return (
    <div
      data-slot="column-resize-handle"
      data-resizing={isResizing || undefined}
      // Pointer-only affordance (no keyboard interaction) → hide from AT.
      aria-hidden="true"
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      onDoubleClick={() => header.column.resetSize()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute top-0 right-0 z-[3] h-full w-[6px] cursor-col-resize select-none touch-none',
        'bg-transparent transition-colors hover:bg-primary/40',
        isResizing && 'bg-primary',
      )}
    />
  )
}
