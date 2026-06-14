export interface PaginationProps {
  /** Current page (1-indexed). */
  page: number
  /** Number of rows per page. */
  pageSize: number
  /** Total number of rows. */
  total: number
  /** Called when page or pageSize changes. */
  onPageChange: (page: number, pageSize: number) => void
  /** Available page size choices. Default: [10, 20, 50, 100]. */
  pageSizeOptions?: number[]
  /** Show "Showing X–Y of N" label on the left. Default: true. */
  showTotal?: boolean
  /** Additional CSS class on the root container. */
  className?: string
}
