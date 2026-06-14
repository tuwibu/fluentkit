import type { Meta, StoryObj } from '@storybook/react'
import { StatCard, StatCardSkeleton } from './stat-card'

const meta: Meta<typeof StatCard> = {
  title: 'Composites/StatCard',
  component: StatCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof StatCard>

export const KpiSuccess: Story = {
  args: {
    label: 'Total Users',
    value: 1284,
    tone: 'success',
    variant: 'kpi',
    delta: { value: 12, dir: 'up' },
    hint: 'vs last month',
  },
}

export const KpiWarning: Story = {
  args: {
    label: 'Orders',
    value: 342,
    tone: 'warning',
    variant: 'kpi',
    delta: { value: 3, dir: 'down' },
    hint: 'vs last month',
  },
}

export const KpiError: Story = {
  args: {
    label: 'Churn Rate',
    value: 8,
    tone: 'error',
    variant: 'kpi',
    delta: { value: 2, dir: 'up' },
    hint: '%',
  },
}

export const KpiGrid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatCard label="Total Users" value={1284} tone="success" variant="kpi" delta={{ value: 12, dir: 'up' }} hint="vs last month" />
      <StatCard label="Revenue" value={48250} tone="info" variant="kpi" delta={{ value: 8, dir: 'up' }} hint="vs last month" />
      <StatCard label="Orders" value={342} tone="warning" variant="kpi" delta={{ value: 3, dir: 'down' }} hint="vs last month" />
      <StatCard label="Conversion" value={4} tone="error" variant="kpi" delta={{ value: 1, dir: 'down' }} hint="%" />
    </div>
  ),
}

export const CompactRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatCard label="Live" value={940} tone="success" variant="compact" hint="profiles" />
      <StatCard label="Stale" value={112} tone="warning" variant="compact" hint="profiles" />
      <StatCard label="Dead" value={45} tone="error" variant="compact" />
      <StatCard label="Suspended" value={28} tone="accent" variant="compact" />
      <StatCard label="Pending" value={159} tone="info" variant="compact" />
    </div>
  ),
}

export const SkeletonKpi: StoryObj<typeof StatCardSkeleton> = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatCardSkeleton variant="kpi" />
      <StatCardSkeleton variant="kpi" />
      <StatCardSkeleton variant="kpi" />
    </div>
  ),
}

export const SkeletonCompact: StoryObj<typeof StatCardSkeleton> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <StatCardSkeleton key={i} variant="compact" />
      ))}
    </div>
  ),
}
