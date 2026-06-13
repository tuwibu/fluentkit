import { http, HttpResponse } from 'msw'
import { PROFILE_FIXTURES } from '../fixtures/profiles.fixtures'

export const profilesHandlers = [
  http.get('/api/profiles', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search') ?? ''
    const status = url.searchParams.get('status') ?? ''
    const platform = url.searchParams.get('platform') ?? ''
    const group = url.searchParams.get('group') ?? ''

    let filtered = PROFILE_FIXTURES

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.group.toLowerCase().includes(q),
      )
    }
    if (status) filtered = filtered.filter((p) => p.status === status)
    if (platform) filtered = filtered.filter((p) => p.platform === platform)
    if (group) filtered = filtered.filter((p) => p.group === group)

    const total = filtered.length
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ success: true, data, total, current: page, pageSize })
  }),
]
