import client from '@/api/client'
import type { User } from '@/types'

interface AuthPayload {
  user: User
  token: string
}

export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Promise<AuthPayload> => {
    const data = await client.post<unknown, AuthPayload>('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
    })
    return data
  },

  login: async (email: string, password: string): Promise<AuthPayload> => {
    const data = await client.post<unknown, AuthPayload>('/auth/login', {
      email,
      password,
    })
    return data
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const data = await client.get<unknown, User>('/auth/me')
    return data
  },

  resendVerification: async (): Promise<void> => {
    await client.post('/auth/email/verification-notification')
  },

  forgotPassword: async (email: string): Promise<void> => {
    await client.post('/auth/forgot-password', { email })
  },

  resetPassword: async (
    token: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Promise<void> => {
    await client.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    })
  },
}
