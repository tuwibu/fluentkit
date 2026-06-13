import { http, HttpResponse } from 'msw'

const DEFAULT_SETTINGS = {
  notifications: true,
  theme: 'system',
  language: 'en',
  twoFactor: false,
  emailDigest: 'weekly',
}

export const settingsHandlers = [
  http.get('/api/settings', () => {
    return HttpResponse.json({ success: true, data: DEFAULT_SETTINGS })
  }),

  http.patch('/api/settings', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ success: true, data: { ...DEFAULT_SETTINGS, ...body } })
  }),
]
