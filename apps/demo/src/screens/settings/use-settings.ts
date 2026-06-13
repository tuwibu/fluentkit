import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPatch } from '@/lib/api-client'

export interface AppSettings {
  notifications: boolean
  theme: string
  language: string
  twoFactor: boolean
  emailDigest: string
}

export function useSettings() {
  const qc = useQueryClient()

  const query = useQuery<AppSettings>({
    queryKey: ['settings'],
    queryFn: () => apiGet<AppSettings>('/api/settings'),
  })

  const saveMutation = useMutation({
    mutationFn: (data: Partial<AppSettings>) => apiPatch<AppSettings>('/api/settings', data),
    onSuccess: (data) => qc.setQueryData(['settings'], data),
  })

  return { query, saveMutation }
}
