import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import AuthLayout from '@/layouts/AuthLayout'
import useAuthStore from '@/store/useAuthStore'
import type { ApiError } from '@/types'

interface LoginState {
  email: string
  password: string
}

interface LoginLocationState {
  toast?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState<LoginState>({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const state = (location.state as LoginLocationState | null) ?? null

  const mutation = useMutation({
    mutationFn: () => authApi.login(form.email, form.password),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate('/roadmap', { replace: true })
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    mutation.mutate()
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your roadmap.">
      {state?.toast ? <p className="mb-4 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">{state.toast}</p> : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-zinc-200" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </label>

        {errorMessage ? <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">{errorMessage}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="mt-5 flex justify-between text-sm">
        <Link className="text-indigo-400 hover:text-indigo-300" to="/register">
          Create account
        </Link>
        <Link className="text-zinc-400 hover:text-zinc-200" to="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  )
}
