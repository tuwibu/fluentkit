import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { FormDrawerScreen } from './form-drawer-screen'
import { createTestWrapper } from '@/test/test-wrapper'

describe('FormDrawerScreen', () => {
  it('renders user rows after loading', async () => {
    const { Wrapper } = createTestWrapper()
    render(<FormDrawerScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })
  })

  it('shows error state when loading fails', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ success: false, message: 'Load error' }, { status: 500 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<FormDrawerScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows New User button', async () => {
    const { Wrapper } = createTestWrapper()
    render(<FormDrawerScreen />, { wrapper: Wrapper })

    expect(screen.getByText('+ New User')).toBeInTheDocument()
  })
})
