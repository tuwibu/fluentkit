import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { DashboardScreen } from './dashboard-screen'
import { createTestWrapper } from '@/test/test-wrapper'

describe('DashboardScreen', () => {
  it('renders stat cards after loading', async () => {
    const { Wrapper } = createTestWrapper()
    render(<DashboardScreen />, { wrapper: Wrapper })

    // Loading skeletons present initially
    expect(screen.getByText('Dashboard')).toBeInTheDocument()

    // Wait for stat data
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
  })

  it('shows error alert when stats endpoint fails', async () => {
    server.use(
      http.get('/api/dashboard/stats', () =>
        HttpResponse.json({ success: false, message: 'Stats unavailable' }, { status: 500 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<DashboardScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
