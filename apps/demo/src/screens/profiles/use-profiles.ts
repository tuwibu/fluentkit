import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGetList } from '@/lib/api-client'
import type { ProfileRecord } from '@/mocks/fixtures/profiles.fixtures'

export interface ProfilesListResponse {
  data: ProfileRecord[]
  total: number
  current: number
  pageSize: number
}

export interface ProfileFilters {
  search: string
  status: string
  platform: string
  group: string
}

export function useProfiles() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<ProfileFilters>({
    search: '',
    status: '',
    platform: '',
    group: '',
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.platform ? { platform: filters.platform } : {}),
    ...(filters.group ? { group: filters.group } : {}),
  })

  const query = useQuery<ProfilesListResponse>({
    queryKey: ['profiles', page, pageSize, filters],
    queryFn: () => apiGetList<ProfilesListResponse>(`/api/profiles?${params}`),
  })

  function handlePageChange(newPage: number, newSize: number) {
    setPage(newPage)
    if (newSize !== pageSize) {
      setPageSize(newSize)
      setPage(1)
    }
  }

  function handleFilterChange(next: Partial<ProfileFilters>) {
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
