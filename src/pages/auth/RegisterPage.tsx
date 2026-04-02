import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import AuthLayout from '@/layouts/AuthLayout'
import useAuthStore from '@/store/useAuthStore'
import type { ApiError } from '@/types'

interface RegisterFormState {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  form?: string
}

const initialForm: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState<RegisterFormState>(initialForm)
  const [errors, setErrors] = useState<RegisterErrors>({})

  const mutation = useMutation({
    mutationFn: () => authApi.register(form.name, form.email, form.password, form.password_confirmation),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate('/roadmap', { replace: true })
    },
    onError: (error: ApiError) => {
      const firstServerError = Object.values(error.errors ?? {}).flat()[0]
      setErrors({ form: firstServerError ?? error.message })
    },
  })

  const clientErrors = useMemo(() => {
    const nextErrors: RegisterErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.'
    }

    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!form.password_confirmation) {
      nextErrors.password_confirmation = 'Please confirm your password.'
    }

    if (form.password && form.password_confirmation && form.password !== form.password_confirmation) {
      nextErrors.password_confirmation = 'Passwords do not match.'
    }

    return nextErrors
  }, [form])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setErrors({})
    mutation.mutate()
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start your software engineering mastery journey.">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <label className="block text-sm text-zinc-200" htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          {errors.name ? <span className="mt-1 block text-xs text-red-400">{errors.name}</span> : null}
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          {errors.email ? <span className="mt-1 block text-xs text-red-400">{errors.email}</span> : null}
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {errors.password ? <span className="mt-1 block text-xs text-red-400">{errors.password}</span> : null}
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="password_confirmation">
          Confirm password
          <input
            id="password_confirmation"
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={form.password_confirmation}
            onChange={(event) => setForm((current) => ({ ...current, password_confirmation: event.target.value }))}
          />
          {errors.password_confirmation ? (
            <span className="mt-1 block text-xs text-red-400">{errors.password_confirmation}</span>
          ) : null}
        </label>

        {errors.form ? <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">{errors.form}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link className="font-medium text-indigo-400 hover:text-indigo-300" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}
