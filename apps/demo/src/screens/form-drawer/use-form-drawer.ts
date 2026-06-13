import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, apiPatch, apiDelete } from '@/lib/api-client'
import type { UserRecord } from '@/mocks/fixtures/users.fixtures'

export type DrawerMode = 'create' | 'edit' | null

export function useFormDrawer() {
  const qc = useQueryClient()
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null)
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: Partial<UserRecord>) => apiPost<UserRecord>('/api/users', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDrawerMode(null) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRecord> }) =>
      apiPatch<UserRecord>(`/api/users/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDrawerMode(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete<null>(`/api/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDeleteTarget(null) },
  })

  function openCreate() {
    setEditTarget(null)
    setDrawerMode('create')
  }

  function openEdit(record: UserRecord) {
    setEditTarget(record)
    setDrawerMode('edit')
  }

  function closeDrawer() {
    setDrawerMode(null)
    setEditTarget(null)
  }

  return {
    drawerMode,
    editTarget,
    deleteTarget,
    setDeleteTarget,
    openCreate,
    openEdit,
    closeDrawer,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
