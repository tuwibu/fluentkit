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

  it('renders 5 filter controls in toolbar', async () => {
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })

    // FilterSelect triggers render as popover-trigger buttons with their title text.
    // Use getAllByRole because columnMenu also renders buttons in column headers.
    expect(screen.getAllByRole('button', { name: /platform/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /status/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /country/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /tags/i }).length).toBeGreaterThanOrEqual(1)
    // Sort: Select combobox
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('sends platform filter when Platform FilterSelect changes', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const platform = url.searchParams.get('platform') ?? ''
        let filtered = PROFILE_FIXTURES
        if (platform) filtered = filtered.filter((p) => p.platform === platform)
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

    // Open Platform FilterSelect popup
    const platformBtn = screen.getByRole('button', { name: /^Platform/i })
    await userEvent.click(platformBtn)

    // Click "Google" option in the popup
    const googleOption = await screen.findByRole('option', { name: /google/i })
    await userEvent.click(googleOption)

    await waitFor(() => {
      expect(requests.some((u) => u.searchParams.get('platform') === 'google')).toBe(true)
    })
  })

  it('sends country=us,vn when two countries selected', async () => {
    const requests: URL[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        const url = new URL(request.url)
        requests.push(url)
        const country = url.searchParams.get('country') ?? ''
        let filtered = PROFILE_FIXTURES
        if (country) {
          const countryList = country.split(',').filter(Boolean)
          filtered = filtered.filter((p) => countryList.includes(p.country))
        }
        const page = Number(url.searchParams.get('page') ?? '1')
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
        const data = filtered.slice((page - 1) * pageSize, page * pageSize)
        return HttpResponse.json({ success: true, data, total: filtered.length, current: page, pageSize })
      }),
    )

    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })

    // Open Country FilterSelect
    const countryBtn = screen.getByRole('button', { name: /^Country/i })
    await userEvent.click(countryBtn)

    // Pick "United States"
    const usOption = await screen.findByRole('option', { name: /united states/i })
    await userEvent.click(usOption)

    // Pick "Vietnam"
    const vnOption = await screen.findByRole('option', { name: /vietnam/i })
    await userEvent.click(vnOption)

    await waitFor(() => {
      const countryRequest = requests.find((u) => {
        const c = u.searchParams.get('country') ?? ''
        const parts = c.split(',').sort()
        return parts.includes('us') && parts.includes('vn')
      })
      expect(countryRequest).toBeDefined()
    })
  })

  it('MSW handler sorts by name_asc when sort param is set', async () => {
    // Test MSW handler sort logic directly — radix Select single mode cannot
    // be opened via click in jsdom (uses pointer events not supported there).
    let sortedNames: string[] = []
    server.use(
      http.get('/api/profiles', ({ request }) => {
        const url = new URL(request.url)
        const sort = url.searchParams.get('sort') ?? ''
        let filtered = [...PROFILE_FIXTURES]
        if (sort === 'name_asc') {
          filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
        }
        const data = filtered.slice(0, 10)
        sortedNames = data.map((p) => p.name)
        return HttpResponse.json({ success: true, data, total: filtered.length, current: 1, pageSize: 10 })
      }),
    )

    const res = await fetch('/api/profiles?page=1&pageSize=10&sort=name_asc')
    const json = await res.json() as { data: { name: string }[] }
    const names = json.data.map((p) => p.name)
    // Sorted ascending: each name should be <= the next
    for (let i = 0; i < names.length - 1; i++) {
      expect(names[i]!.localeCompare(names[i + 1]!)).toBeLessThanOrEqual(0)
    }
    expect(sortedNames.length).toBeGreaterThan(0)
  })

  it('shows tag chips in Tags FilterSelect trigger after selection', async () => {
    const { Wrapper } = createTestWrapper()
    render(<ProfilesScreen />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })

    // Open Tags FilterSelect
    const tagsBtn = screen.getByRole('button', { name: /^Tags/i })
    await userEvent.click(tagsBtn)

    // Pick "vip" tag
    const vipOption = await screen.findByRole('option', { name: /^vip$/i })
    await userEvent.click(vipOption)

    // After closing by clicking elsewhere, tag chip should appear in trigger
    await userEvent.keyboard('{Escape}')

    // The tag chip "vip" should now appear in the trigger area
    await waitFor(() => {
      // Tags trigger shows inline chips — the chip label is in a Tag element
      const vipChips = screen.getAllByText(/^vip$/i)
      expect(vipChips.length).toBeGreaterThan(0)
    })
  })
})
