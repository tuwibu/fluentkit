import { http, HttpResponse } from 'msw'
import { STAT_FIXTURES, REVENUE_FIXTURES } from '../fixtures/dashboard.fixtures'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({ success: true, data: STAT_FIXTURES })
  }),

  http.get('/api/dashboard/revenue', () => {
    return HttpResponse.json({ success: true, data: REVENUE_FIXTURES })
  }),
]
