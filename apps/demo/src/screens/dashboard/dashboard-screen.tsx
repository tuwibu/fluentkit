import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@fluent-kit/ui'
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

export function DashboardScreen() {
  const { statsQuery, revenueQuery } = useDashboard()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {statsQuery.isError && (
        <div role="alert" className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to load dashboard stats.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        {statsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : (statsQuery.data ?? []).map((stat) => (
              <Card key={stat.id}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {stat.unit === '$' ? `$${stat.value.toLocaleString()}` : stat.value}
                    {stat.unit && stat.unit !== '$' ? stat.unit : ''}
                  </p>
                  <p
                    className={`text-xs mt-1 ${stat.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}
                    aria-label={`Trend: ${stat.trend > 0 ? '+' : ''}${stat.trend}%`}
                  >
                    {stat.trend > 0 ? '▲' : '▼'} {Math.abs(stat.trend)}%
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Target</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {revenueQuery.isLoading ? (
            <Skeleton className="h-full w-full" />
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
