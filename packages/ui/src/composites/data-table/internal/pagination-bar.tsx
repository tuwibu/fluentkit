/**
 * pagination-bar.tsx — PRIVATE
 * Renders a simple numbered pagination nav for DataTable.
 */
import { cn } from '../../../lib/cn'

interface PaginationBarProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
}

export function PaginationBar({ current, pageSize, total, onChange }: PaginationBarProps) {
  const pageCount = Math.ceil(total / pageSize)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div
      data-slot="pagination"
      className="flex items-center gap-1 px-3 py-2 border-t border-border justify-end"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        type="button"
        className="px-2 py-1 text-sm rounded hover:bg-muted disabled:opacity-40"
        disabled={current <= 1}
        onClick={() => onChange(current - 1, pageSize)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={String(page)}
          aria-current={page === current ? 'page' : undefined}
          className={cn(
            'px-3 py-1 text-sm rounded',
            page === current
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted',
          )}
          onClick={() => onChange(page, pageSize)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="px-2 py-1 text-sm rounded hover:bg-muted disabled:opacity-40"
        disabled={current >= pageCount}
        onClick={() => onChange(current + 1, pageSize)}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  )
}
