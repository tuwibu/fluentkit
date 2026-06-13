import { http, HttpResponse } from 'msw'
import { USER_FIXTURES } from '../fixtures/users.fixtures'

export const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const role = url.searchParams.get('role') ?? ''
    const search = url.searchParams.get('search') ?? ''

    let filtered = USER_FIXTURES
    if (role) filtered = filtered.filter((u) => u.role === role)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    }

    const total = filtered.length
    const data = filtered.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({ success: true, data, total, current: page, pageSize })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newUser = {
      id: `user-${Date.now()}`,
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      role: String(body.role ?? 'viewer') as 'admin' | 'editor' | 'viewer',
      status: 'active' as const,
      joinedAt: new Date().toISOString(),
      department: String(body.department ?? 'Engineering'),
    }
    return HttpResponse.json({ success: true, data: newUser }, { status: 201 })
  }),

  http.patch('/api/users/:id', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>
    const existing = USER_FIXTURES.find((u) => u.id === params['id'])
    if (!existing) {
      return HttpResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: { ...existing, ...body } })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const existing = USER_FIXTURES.find((u) => u.id === params['id'])
    if (!existing) {
      return HttpResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: null })
  }),
]
