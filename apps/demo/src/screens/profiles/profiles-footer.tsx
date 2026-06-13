import { Select } from '@fluent-kit/ui'

// Non-empty string values required by Radix Select.Item
const PAGE_SIZE_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
]

interface ProfilesFooterProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number, pageSize: number) => void
}

export function ProfilesFooter({
  page,
  pageSize,
  total,
  onPageChange,
}: ProfilesFooterProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pageCount = Math.ceil(total / pageSize)

  return (
    <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-sm shrink-0">
      {/* Left: Showing */}
      <span className="text-caption text-muted-foreground whitespace-nowrap">
        Showing {start}–{end} / {total}
      </span>

      {/* Center: Pagination */}
      <nav role="navigation" aria-label="Pagination" className="flex items-center gap-0.5">
        <button
          type="button"
          className="px-2 py-1 rounded text-sm hover:bg-muted disabled:opacity-40 transition-colors"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1, pageSize)}
          aria-label="Previous page"
        >
          ‹
        </button>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            aria-label={String(p)}
            aria-current={p === page ? 'page' : undefined}
            className={
              p === page
                ? 'min-w-[28px] px-2 py-1 rounded text-sm bg-primary text-primary-foreground transition-colors'
                : 'min-w-[28px] px-2 py-1 rounded text-sm hover:bg-muted transition-colors'
            }
            onClick={() => onPageChange(p, pageSize)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="px-2 py-1 rounded text-sm hover:bg-muted disabled:opacity-40 transition-colors"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1, pageSize)}
          aria-label="Next page"
        >
          ›
        </button>
      </nav>

      {/* Right: Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-caption text-muted-foreground whitespace-nowrap">Rows per page</span>
        <div className="w-28">
          <Select
            options={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(v) => onPageChange(1, Number(v))}
          />
        </div>
      </div>
    </div>
  )
}
