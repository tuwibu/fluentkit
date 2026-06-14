import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  StatCardSkeleton,
} from '@tuwibu/fluentkit'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useDashboard } from './use-dashboard'
import type { StatCardTone } from '@tuwibu/fluentkit'

function trendToTone(trend: number): StatCardTone {
  return trend >= 0 ? 'success' : 'error'
}

export function DashboardScreen() {
  const { statsQuery, revenueQuery, breakdownQuery } = useDashboard()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {statsQuery.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load dashboard stats.
        </div>
      )}
      {breakdownQuery.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load breakdown data.
        </div>
      )}
      {revenueQuery.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load revenue data.
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        {statsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} variant="kpi" />
            ))
          : (statsQuery.data ?? []).map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                variant="kpi"
                tone={trendToTone(stat.trend)}
                delta={{
                  value: Math.abs(stat.trend),
                  dir: stat.trend >= 0 ? 'up' : 'down',
                }}
                hint={stat.unit ? stat.unit : undefined}
              />
            ))}
      </div>

      {/* Breakdown compact row */}
      <div className="flex flex-wrap gap-2 mb-8">
        {breakdownQuery.isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} variant="compact" />
            ))
          : (breakdownQuery.data ?? []).map((item) => (
              <StatCard
                key={item.key}
                label={item.label}
                value={item.value}
                variant="compact"
                tone={item.tone}
              />
            ))}
      </div>

      {/* Revenue line chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Target</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {revenueQuery.isLoading ? (
            <div className="h-full w-full animate-pulse rounded-md bg-foreground/10" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueQuery.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
