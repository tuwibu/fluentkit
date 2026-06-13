import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry on ApiError (business-logic failure)
        if (error instanceof ApiError) return false
        return failureCount < 2
      },
      staleTime: 30_000,
    },
  },
})
