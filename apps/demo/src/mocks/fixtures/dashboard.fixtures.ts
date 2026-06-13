export interface StatCard {
  id: string
  label: string
  value: number
  unit?: string
  trend: number
}

export interface RevenuePoint {
  month: string
  revenue: number
  target: number
}

export const STAT_FIXTURES: StatCard[] = [
  { id: 'users', label: 'Total Users', value: 1284, trend: 12 },
  { id: 'revenue', label: 'Monthly Revenue', value: 48250, unit: '$', trend: 8 },
  { id: 'orders', label: 'Orders', value: 342, trend: -3 },
  { id: 'conversion', label: 'Conversion', value: 4.7, unit: '%', trend: 1 },
]

export const REVENUE_FIXTURES: RevenuePoint[] = [
  { month: 'Jan', revenue: 32000, target: 35000 },
  { month: 'Feb', revenue: 38000, target: 35000 },
  { month: 'Mar', revenue: 41000, target: 40000 },
  { month: 'Apr', revenue: 37000, target: 40000 },
  { month: 'May', revenue: 44000, target: 42000 },
  { month: 'Jun', revenue: 48250, target: 45000 },
]
