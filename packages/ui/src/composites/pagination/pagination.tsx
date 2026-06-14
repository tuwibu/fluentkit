import { cn } from '../../lib/cn'
import { SelectComposite } from '../select/select-composite'
import type { PaginationProps } from './pagination.types'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

/** Build page number array with ellipsis strings for large page counts. */
function buildPageItems(page: number, pageCount: number): Array<number | '…'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const items: Array<number | '…'> = [1]

  const rangeStart = Math.max(2, page - 1)
  const rangeEnd = Math.min(pageCount - 1, page + 1)

  if (rangeStart > 2) items.push('…')
  for (let p = rangeStart; p <= rangeEnd; p++) items.push(p)
  if (rangeEnd < pageCount - 1) items.push('…')

  items.push(pageCount)
  return items
}

const PAGE_BTN_BASE =
  'inline-flex items-center justify-center w-7 h-7 rounded-[4px] text-sm ' +
  'transition-[background,color] duration-[120ms] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showTotal = true,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pageItems = buildPageItems(page, pageCount)

  const sizeOptions = pageSizeOptions.map((n) => ({
    label: String(n),
    value: String(n),
  }))

  return (
    <div
      data-slot="pagination"
      className={cn('flex items-center justify-between gap-2 px-3 py-2', className)}
    >
      {/* Left: showing range */}
      <span className="text-caption text-muted-foreground whitespace-nowrap text-sm">
        {showTotal ? `Showing ${start}–${end} of ${total}` : null}
      </span>

      {/* Center: page navigation */}
      <nav role="navigation" aria-label="Pagination" className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1, pageSize)}
          className={cn(PAGE_BTN_BASE, 'hover:bg-[var(--win11-control-hover)]')}
        >
          ‹
        </button>

        {pageItems.map((item, idx) =>
          item === '…' ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center w-7 h-7 text-sm text-muted-foreground select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item, pageSize)}
              className={cn(
                PAGE_BTN_BASE,
                item === page
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-[var(--win11-control-hover)]',
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1, pageSize)}
          className={cn(PAGE_BTN_BASE, 'hover:bg-[var(--win11-control-hover)]')}
        >
          ›
        </button>
      </nav>

      {/* Right: rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-caption text-muted-foreground whitespace-nowrap text-sm">
          Rows per page
        </span>
        <div className="w-20">
          <SelectComposite
            options={sizeOptions}
            value={String(pageSize)}
            onChange={(v) => onPageChange(1, Number(v))}
          />
        </div>
      </div>
    </div>
  )
}
