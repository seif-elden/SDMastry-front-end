import axios, { AxiosError } from 'axios'
import { DEFAULT_API_BASE_URL } from '@/config/constants'
import useAuthStore from '@/store/useAuthStore'
import type { ApiError } from '@/types'

interface ErrorResponseBody {
  message?: string
  errors?: Record<string, string[]>
}

interface SuccessEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

client.interceptors.response.use(
  (response) => {
    const payload = response.data as SuccessEnvelope<unknown>
    return payload?.data ?? response.data
  },
  (error: AxiosError<ErrorResponseBody>) => {
    const status = error.response?.status

    if (status === 401) {
      useAuthStore.getState().clearAuth()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    const rejectedError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? 'Request failed',
      errors: error.response?.data?.errors,
    }

    return Promise.reject(rejectedError)
  },
)

export default client
