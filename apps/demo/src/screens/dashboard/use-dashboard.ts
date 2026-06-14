import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api-client'
import type { StatCard, RevenuePoint, BreakdownItem } from '@/mocks/fixtures/dashboard.fixtures'

export function useDashboard() {
  const statsQuery = useQuery<StatCard[]>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiGet<StatCard[]>('/api/dashboard/stats'),
  })

  const revenueQuery = useQuery<RevenuePoint[]>({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => apiGet<RevenuePoint[]>('/api/dashboard/revenue'),
  })

  const breakdownQuery = useQuery<BreakdownItem[]>({
    queryKey: ['dashboard', 'breakdown'],
    queryFn: () => apiGet<BreakdownItem[]>('/api/dashboard/breakdown'),
  })

  return { statsQuery, revenueQuery, breakdownQuery }
}
