/**
 * Internal API client — wraps axios and unwraps the envelope contract:
 * every backend response is `{ success, data?, message? }`.
 * `success === false` throws `ApiError`; callers handle via try/catch or TanStack Query.
 * Port of multiprofile-v2 services/api-client.ts — refresh-token/wails removed.
 */
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const axiosInstance = axios.create({ baseURL: '/' })

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public payload?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function isEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return typeof body === 'object' && body !== null && 'success' in body
}

function unwrap<T>(res: AxiosResponse<ApiEnvelope<T>>): T {
  const body = res.data
  if (isEnvelope(body)) {
    if (body.success === false) {
      const message = body.message ?? 'Request failed'
      const method = res.config?.method?.toUpperCase() ?? 'REQ'
      console.error(`[API] ${method} ${res.config?.url ?? ''} → ${message}`)
      throw new ApiError(message, body)
    }
    return body.data as T
  }
  return body as unknown as T
}

/**
 * Paginated list endpoints use spread envelope:
 * `{ success, data: [...rows], total, pageSize, current }` — pagination sits at root.
 * Returns the entire body (not just `.data`) so pagination meta is preserved.
 */
function unwrapList<T>(res: AxiosResponse<ApiEnvelope<unknown>>): T {
  const body = res.data
  if (isEnvelope(body) && body.success === false) {
    const message = body.message ?? 'Request failed'
    const method = res.config?.method?.toUpperCase() ?? 'REQ'
    console.error(`[API] ${method} ${res.config?.url ?? ''} → ${message}`)
    throw new ApiError(message, body)
  }
  return body as unknown as T
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(await axiosInstance.get<ApiEnvelope<T>>(url, config))
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await axiosInstance.post<ApiEnvelope<T>>(url, data, config))
}

export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return unwrap<T>(await axiosInstance.patch<ApiEnvelope<T>>(url, data, config))
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(await axiosInstance.delete<ApiEnvelope<T>>(url, config))
}

/** GET with spread envelope — pagination meta preserved at root. */
export async function apiGetList<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrapList<T>(await axiosInstance.get<ApiEnvelope<unknown>>(url, config))
}
