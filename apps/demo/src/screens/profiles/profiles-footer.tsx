import { Pagination } from '@tuwibu/fluentkit'

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
  return (
    <div className="border-t border-border px-3 py-1.5 shrink-0">
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        showTotal
      />
    </div>
  )
}
