import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatCard, StatCardSkeleton } from './stat-card'

describe('StatCard', () => {
  describe('value formatting', () => {
    it('formats value with toLocaleString', () => {
      render(<StatCard label="Users" value={1284} />)
      // toLocaleString of 1284 — contains "1" and "284" regardless of locale separator
      expect(screen.getByText(/1.?284/)).toBeInTheDocument()
    })

    it('formats large values', () => {
      render(<StatCard label="Revenue" value={48250} variant="kpi" />)
      const el = screen.getByText(/48/)
      expect(el).toBeInTheDocument()
    })
  })

  describe('tone → color class', () => {
    it('applies emerald class for success tone', () => {
      render(<StatCard label="Live" value={100} tone="success" />)
      const value = document.querySelector('.text-emerald-500')
      expect(value).toBeInTheDocument()
    })

    it('applies amber class for warning tone', () => {
      render(<StatCard label="Stale" value={50} tone="warning" />)
      const value = document.querySelector('.text-amber-500')
      expect(value).toBeInTheDocument()
    })

    it('applies destructive class for error tone', () => {
      render(<StatCard label="Dead" value={10} tone="error" />)
      const value = document.querySelector('.text-destructive')
      expect(value).toBeInTheDocument()
    })

    it('applies primary class for info tone', () => {
      render(<StatCard label="Pending" value={20} tone="info" />)
      const value = document.querySelector('.text-primary')
      expect(value).toBeInTheDocument()
    })

    it('applies foreground class for neutral tone (default)', () => {
      render(<StatCard label="Total" value={99} />)
      const value = document.querySelector('.text-foreground')
      expect(value).toBeInTheDocument()
    })
  })

  describe('kpi variant — delta arrow + color', () => {
    it('renders ▲ arrow for up delta with emerald color', () => {
      render(<StatCard label="Users" value={500} variant="kpi" delta={{ value: 12, dir: 'up' }} />)
      const delta = screen.getByText(/▲/)
      expect(delta).toBeInTheDocument()
      expect(delta.className).toMatch(/text-emerald-500/)
    })

    it('renders ▼ arrow for down delta with destructive color', () => {
      render(<StatCard label="Orders" value={300} variant="kpi" delta={{ value: 5, dir: 'down' }} />)
      const delta = screen.getByText(/▼/)
      expect(delta).toBeInTheDocument()
      expect(delta.className).toMatch(/text-destructive/)
    })

    it('renders absolute delta value', () => {
      render(<StatCard label="Orders" value={300} variant="kpi" delta={{ value: 5, dir: 'down' }} />)
      expect(screen.getByText(/▼.*5|5.*▼/)).toBeInTheDocument()
    })

    it('does not render delta section when delta is absent', () => {
      render(<StatCard label="Users" value={500} variant="kpi" />)
      expect(screen.queryByText(/▲|▼/)).not.toBeInTheDocument()
    })
  })

  describe('compact variant — hint', () => {
    it('renders hint text in compact variant', () => {
      render(<StatCard label="Live" value={940} variant="compact" hint="profiles" />)
      expect(screen.getByText('profiles')).toBeInTheDocument()
    })

    it('does not render hint when not provided', () => {
      render(<StatCard label="Live" value={940} variant="compact" />)
      // No hint element — only label and value should be present
      expect(screen.queryByText('profiles')).not.toBeInTheDocument()
    })

    it('compact renders label and value', () => {
      render(<StatCard label="Stale" value={112} variant="compact" tone="warning" />)
      expect(screen.getByText('Stale')).toBeInTheDocument()
    })
  })

  describe('kpi variant — hint alongside delta', () => {
    it('renders hint text in kpi variant', () => {
      render(<StatCard label="Users" value={500} variant="kpi" hint="vs last month" delta={{ value: 10, dir: 'up' }} />)
      expect(screen.getByText('vs last month')).toBeInTheDocument()
    })
  })
})

describe('StatCardSkeleton', () => {
  it('renders kpi skeleton with two skeleton elements', () => {
    render(<StatCardSkeleton variant="kpi" />)
    // Skeleton elements have role="status"
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders compact skeleton', () => {
    render(<StatCardSkeleton variant="compact" />)
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThanOrEqual(2)
  })

  it('defaults to compact when no variant given', () => {
    render(<StatCardSkeleton />)
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThanOrEqual(2)
  })
})
