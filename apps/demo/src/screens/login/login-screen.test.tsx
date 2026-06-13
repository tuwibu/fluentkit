import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { LoginScreen } from './login-screen'
import { createTestWrapper } from '@/test/test-wrapper'

describe('LoginScreen', () => {
  it('shows validation errors on empty submit', async () => {
    const { Wrapper } = createTestWrapper()
    render(<LoginScreen />, { wrapper: Wrapper })

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const { Wrapper } = createTestWrapper()
    render(<LoginScreen />, { wrapper: Wrapper })

    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'notanemail')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument()
    })
  })

  it('calls auth API and shows success on valid login', async () => {
    const requestBodies: unknown[] = []
    server.use(
      http.post('/api/auth/login', async ({ request }) => {
        const body = await request.json()
        requestBodies.push(body)
        return HttpResponse.json({
          success: true,
          data: { token: 'tok-123', user: { id: 'u-1', name: 'Demo User', email: 'demo@example.com' } },
        })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<LoginScreen />, { wrapper: Wrapper })

    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'demo@example.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Demo User/i)).toBeInTheDocument()
    })

    expect(requestBodies).toHaveLength(1)
    expect((requestBodies[0] as { email: string }).email).toBe('demo@example.com')
  })

  it('shows API error when login fails', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<LoginScreen />, { wrapper: Wrapper })

    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'error@example.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
