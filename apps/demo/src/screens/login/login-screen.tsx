import { useState } from 'react'
import { FormField, Input, Button, Card, CardContent, CardHeader, CardTitle } from '@fluent-kit/ui'
import { loginSchema } from './login-schema'
import type { LoginFormData } from './login-schema'
import { apiPost } from '@/lib/api-client'
import { ApiError } from '@/lib/api-client'

interface AuthResult {
  token: string
  user: { id: string; name: string; email: string }
}

const EMPTY: LoginFormData = { email: '', password: '' }

export function LoginScreen() {
  const [form, setForm] = useState<LoginFormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<AuthResult | null>(null)

  function setField<K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginFormData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const data = await apiPost<AuthResult>('/api/auth/login', result.data)
      setSuccess(data)
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-green-600 font-medium">Welcome, {success.user.name}!</p>
            <p className="text-sm text-muted-foreground mt-1">Token: {success.token}</p>
            <Button className="mt-4" variant="outline" onClick={() => { setSuccess(null); setForm(EMPTY) }}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {apiError && (
              <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {apiError}
              </div>
            )}
            <FormField label="Email" required htmlFor="l-email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="you@example.com"
                status={errors.email ? 'error' : undefined}
              />
            </FormField>
            <FormField label="Password" required htmlFor="l-password" error={errors.password}>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder="••••••••"
                status={errors.password ? 'error' : undefined}
              />
            </FormField>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
