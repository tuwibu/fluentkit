import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { USER_FIXTURES } from '@/mocks/fixtures/users.fixtures'
import { UsersScreen } from './users-screen'
import { createTestWrapper } from '@/test/test-wrapper'

describe('UsersScreen', () => {
  it('renders table rows after data loads', async () => {
    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })
    expect(screen.getByText('User 2')).toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ success: false, message: 'DB error' }, { status: 500 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('fires request with page=1 param on initial load', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/users', ({ request }) => {
        requests.push(new URL(request.url))
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const data = USER_FIXTURES.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({ success: true, data, total: USER_FIXTURES.length, current: page, pageSize })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Page 1 request confirmed
    expect(requests.some((u) => u.searchParams.get('page') === '1')).toBe(true)
  })

  it('fires request with page=2 when next page button is clicked', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/users', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const data = USER_FIXTURES.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({
          success: true,
          data,
          total: USER_FIXTURES.length,
          current: page,
          pageSize,
        })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    // Wait for page 1 to load
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Click next page button
    const nextBtn = screen.getByRole('button', { name: /next page/i })
    await userEvent.click(nextBtn)

    // Assert MSW received a request with page=2
    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('page') === '2')).toBe(true)
    })
  })

  it('updates selection count when a row checkbox is clicked', async () => {
    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    // First checkbox is header select-all; second is row 1
    const rowCheckbox = checkboxes[1]
    if (rowCheckbox) {
      await userEvent.click(rowCheckbox)
      await waitFor(() => {
        expect(screen.getByText(/row\(s\) selected/i)).toBeInTheDocument()
      })
    }
  })
})
