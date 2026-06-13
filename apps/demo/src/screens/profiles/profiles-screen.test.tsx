import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import { server } from '@/mocks/server'
import { PROFILE_FIXTURES } from '@/mocks/fixtures/profiles.fixtures'
import { ProfilesScreen } from './profiles-screen'
import { createTestWrapper } from '@/test/test-wrapper'


describe('ProfilesScreen', () => {
  it('renders profile rows after data loads', async () => {
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      // First fixture is Alice Smith
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })
    // Email should be visible in the name cell
    expect(screen.getByText('alice.smith1@gmail.com')).toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    server.use(
      http.get('/api/profiles', () =>
        HttpResponse.json({ success: false, message: 'DB error' }, { status: 500 }),
      ),
    )
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('sends page=1 on initial load', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        requests.push(new URL(request.url))
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const data = PROFILE_FIXTURES.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({
          success: true,
          data,
          total: PROFILE_FIXTURES.length,
          current: page,
          pageSize,
        })
      }),
    )
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })
    expect(requests.some((u) => u.searchParams.get('page') === '1')).toBe(true)
  })

  it('sends page=2 when next page is clicked', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const data = PROFILE_FIXTURES.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({
          success: true,
          data,
          total: PROFILE_FIXTURES.length,
          current: page,
          pageSize,
        })
      }),
    )
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })

    const nextBtn = screen.getByRole('button', { name: /next page/i })
    await userEvent.click(nextBtn)

    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('page') === '2')).toBe(true)
    })
  })

  it('sends status filter when Status select changes', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const status = url.searchParams.get('status') ?? ''
        let filtered = PROFILE_FIXTURES
        if (status) filtered = filtered.filter((p) => p.status === status)
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
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })

    // Find the Status combobox triggers — toolbar has platform, status, group (in that order)
    const comboboxes = screen.getAllByRole('combobox')
    // comboboxes[0]=platform, comboboxes[1]=status, comboboxes[2]=group, comboboxes[3]=footer page-size
    const statusTrigger = comboboxes[1]
    if (!statusTrigger) throw new Error('Status combobox not found')
    await userEvent.click(statusTrigger)

    // Select "Live" option
    const liveOption = await screen.findByRole('option', { name: /^Live$/i })
    await userEvent.click(liveOption)

    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('status') === 'live')).toBe(true)
    })
  })
})
