import { http, HttpResponse } from 'msw'

interface LoginBody {
  email: string
  password: string
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginBody
    if (body.email === 'error@example.com') {
      return HttpResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      )
    }
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: { id: 'u-1', name: 'Demo User', email: body.email },
      },
    })
  }),
]
