import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGetList } from '@/lib/api-client'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'

export interface UsersListResponse {
  success: boolean
  data: UserRecord[]
  total: number
  current: number
  pageSize: number
}

interface Filters {
  search: string
  role: string
}

export function useUsers() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Filters>({ search: '', role: '' })
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.role ? { role: filters.role } : {}),
  })

  const query = useQuery<UsersListResponse>({
    queryKey: ['users', page, pageSize, filters],
    queryFn: () => apiGetList<UsersListResponse>(`/api/users?${params}`),
  })

  function handlePageChange(newPage: number, newSize: number) {
    setPage(newPage)
    setPageSize(newSize)
  }

  function handleFilterChange(next: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...next }))
    setPage(1)
  }

  return {
    query,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    setSelectedRowKeys,
    handlePageChange,
    handleFilterChange,
  }
}
