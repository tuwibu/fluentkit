import { http, HttpResponse } from 'msw'
import { PROFILE_FIXTURES } from '../fixtures/profiles.fixtures'
import type { ProfileRecord } from '../fixtures/profiles.fixtures'

export const profilesHandlers = [
  http.get('/api/profiles', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search') ?? ''
    const status = url.searchParams.get('status') ?? ''
    const platform = url.searchParams.get('platform') ?? ''
    const group = url.searchParams.get('group') ?? ''
    const country = url.searchParams.get('country') ?? ''
    const tags = url.searchParams.get('tags') ?? ''
    const sort = url.searchParams.get('sort') ?? ''
    const deleted = url.searchParams.get('deleted') === 'true'

    // Trash view: `deleted=true` shows only deleted profiles; default hides them.
    let filtered = PROFILE_FIXTURES.filter((p) => p.deleted === deleted)

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
    if (country) {
      const countryList = country.split(',').filter(Boolean)
      filtered = filtered.filter((p) => countryList.includes(p.country))
    }
    if (tags) {
      const tagList = tags.split(',').filter(Boolean)
      filtered = filtered.filter((p) => tagList.some((t) => p.tags.includes(t)))
    }

    if (sort) {
      filtered = applySort(filtered, sort)
    }

    const total = filtered.length
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ success: true, data, total, current: page, pageSize })
  }),
]

function applySort(list: ProfileRecord[], sort: string): ProfileRecord[] {
  const sorted = [...list]
  switch (sort) {
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'created_desc':
      // Use id as proxy for creation order (higher id = newer)
      return sorted.sort((a, b) => b.id.localeCompare(a.id))
    case 'created_asc':
      return sorted.sort((a, b) => a.id.localeCompare(b.id))
    case 'status': {
      const order: Record<string, number> = { live: 0, pending: 1, login_failed: 2, die: 3 }
      return sorted.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99))
    }
    default:
      return sorted
  }
}
