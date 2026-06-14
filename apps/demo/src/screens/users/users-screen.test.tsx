import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { USER_FIXTURES } from '@/mocks/fixtures/users.fixtures'
import { UsersScreen } from './users-screen'
import { createTestWrapper } from '@/test/test-wrapper'

function mockUsersHandler() {
  return http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const role = url.searchParams.get('role') ?? ''
    const filtered = role ? USER_FIXTURES.filter((u) => u.role === role) : USER_FIXTURES
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)
    return HttpResponse.json({
      success: true,
      data,
      total: filtered.length,
      current: page,
      pageSize,
    })
  })
}

describe('UsersScreen', () => {
  it('renders table rows after data loads', async () => {
    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })
    expect(screen.getByText('User 2')).toBeInTheDocument()
  })

  it('shows error alert when API fails', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    const nextBtn = screen.getByRole('button', { name: /next page/i })
    await userEvent.click(nextBtn)

    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('page') === '2')).toBe(true)
    })
  })

  it('shows BulkBar "selected" text when a row checkbox is clicked', async () => {
    server.use(mockUsersHandler())
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
        // BulkBar shows a count chip + "selected" text
        expect(screen.getByRole('toolbar', { name: /bulk actions/i })).toBeInTheDocument()
        expect(screen.getByText('selected')).toBeInTheDocument()
      })
    }
  })

  it('row delete button opens confirm modal and calls DELETE on confirm', async () => {
    let deleteCalledFor: string | null = null
    server.use(
      mockUsersHandler(),
      http.delete('/api/users/:id', ({ params }) => {
        deleteCalledFor = params['id'] as string
        return HttpResponse.json({ success: true, data: null })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Click the delete icon on the first row
    const deleteBtn = screen.getAllByRole('button', { name: /delete user 1/i })[0]
    await userEvent.click(deleteBtn!)

    // Confirm modal should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/delete user\?/i)).toBeInTheDocument()
    })

    // Click the destructive Delete button inside modal
    const confirmBtn = screen.getByRole('button', { name: /^delete$/i })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      expect(deleteCalledFor).toBe('user-1')
    })
  })

  it('BulkBar delete opens confirm modal and calls DELETE for all selected on confirm', async () => {
    const deletedIds: string[] = []
    server.use(
      mockUsersHandler(),
      http.delete('/api/users/:id', ({ params }) => {
        deletedIds.push(params['id'] as string)
        return HttpResponse.json({ success: true, data: null })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Select first row checkbox
    const checkboxes = screen.getAllByRole('checkbox')
    const rowCheckbox = checkboxes[1]
    await userEvent.click(rowCheckbox!)

    await waitFor(() => {
      expect(screen.getByRole('toolbar', { name: /bulk actions/i })).toBeInTheDocument()
    })

    // Click BulkBar Delete
    const bulkDeleteBtn = screen.getByRole('button', { name: /^delete$/i })
    await userEvent.click(bulkDeleteBtn)

    // Confirm modal should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Confirm
    const confirmBtn = screen.getAllByRole('button', { name: /^delete$/i }).find(
      (b) => b.closest('[role="dialog"]'),
    )
    await userEvent.click(confirmBtn!)

    await waitFor(() => {
      expect(deletedIds).toContain('user-1')
    })
  })

  it('fires request with role param when role filter changes', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/users', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const role = url.searchParams.get('role') ?? ''
        const filtered = role ? USER_FIXTURES.filter((u) => u.role === role) : USER_FIXTURES
        const data = filtered.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({
          success: true,
          data,
          total: filtered.length,
          current: page,
          pageSize,
        })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<UsersScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Open FilterSelect for Role and pick "Admin"
    const roleFilter = screen.getByRole('button', { name: /role/i })
    await userEvent.click(roleFilter)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /admin/i })).toBeInTheDocument()
    })
    await userEvent.click(screen.getByRole('option', { name: /admin/i }))

    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('role') === 'admin')).toBe(true)
    })
  })
})
