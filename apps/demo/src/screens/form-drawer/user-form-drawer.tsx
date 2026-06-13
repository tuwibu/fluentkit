import { useEffect, useState } from 'react'
import { DetailDrawer, FormField, Input, Select, Button } from '@fluent-kit/ui'
import type { SelectOption } from '@fluent-kit/ui'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'

const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

const DEPT_OPTIONS: SelectOption[] = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Design', value: 'Design' },
  { label: 'Product', value: 'Product' },
  { label: 'Marketing', value: 'Marketing' },
]

interface UserFormDrawerProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: UserRecord | null
  loading: boolean
  error: string | null
  onClose: () => void
  onSubmit: (data: Partial<UserRecord>) => void
}

interface FormState {
  name: string
  email: string
  role: string
  department: string
}

const EMPTY: FormState = { name: '', email: '', role: 'viewer', department: 'Engineering' }

export function UserFormDrawer({
  open,
  mode,
  initial,
  loading,
  error,
  onClose,
  onSubmit,
}: UserFormDrawerProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})

  useEffect(() => {
    if (open) {
      setForm(initial ? { name: initial.name, email: initial.email, role: initial.role, department: initial.department } : EMPTY)
      setTouched({})
    }
  }, [open, initial])

  function field<K extends keyof FormState>(key: K) {
    return {
      value: form[key],
      onChange: (v: string) => setForm((p) => ({ ...p, [key]: v })),
      onBlur: () => setTouched((p) => ({ ...p, [key]: true })),
      error: touched[key] && !form[key] ? 'Required' : undefined,
    }
  }

  function handleSubmit() {
    setTouched({ name: true, email: true, role: true, department: true })
    if (!form.name || !form.email || !form.role) return
    onSubmit({
      name: form.name,
      email: form.email,
      role: form.role as UserRecord['role'],
      department: form.department,
    })
  }

  return (
    <DetailDrawer
      open={open}
      onOpenChange={(v) => { if (!v) onClose() }}
      title={mode === 'create' ? 'Create User' : 'Edit User'}
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <FormField label="Name" required htmlFor="uf-name" error={field('name').error}>
          <Input
            value={form.name}
            onChange={(e) => { field('name').onChange(e.target.value); field('name').onBlur() }}
            placeholder="Full name"
            status={field('name').error ? 'error' : undefined}
          />
        </FormField>
        <FormField label="Email" required htmlFor="uf-email" error={field('email').error}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => { field('email').onChange(e.target.value); field('email').onBlur() }}
            placeholder="user@example.com"
            status={field('email').error ? 'error' : undefined}
          />
        </FormField>
        <FormField label="Role" required htmlFor="uf-role">
          <Select
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={(v) => setForm((p) => ({ ...p, role: v as string }))}
          />
        </FormField>
        <FormField label="Department" htmlFor="uf-dept">
          <Select
            options={DEPT_OPTIONS}
            value={form.department}
            onChange={(v) => setForm((p) => ({ ...p, department: v as string }))}
          />
        </FormField>
      </div>
    </DetailDrawer>
  )
}
