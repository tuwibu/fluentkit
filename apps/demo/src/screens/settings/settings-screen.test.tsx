import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { SettingsScreen } from './settings-screen'
import { createTestWrapper } from '@/test/test-wrapper'

describe('SettingsScreen', () => {
  it('renders settings tabs', () => {
    const { Wrapper } = createTestWrapper()
    render(<SettingsScreen />, { wrapper: Wrapper })

    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
  })

  it('loads settings data and shows theme field', async () => {
    const { Wrapper } = createTestWrapper()
    render(<SettingsScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Appearance & Language')).toBeInTheDocument()
    })
  })

  it('shows error alert when settings API fails', async () => {
    server.use(
      http.get('/api/settings', () =>
        HttpResponse.json({ success: false, message: 'Unavailable' }, { status: 500 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<SettingsScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
