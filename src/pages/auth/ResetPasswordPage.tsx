import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import AuthLayout from '@/layouts/AuthLayout'
import type { ApiError } from '@/types'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const canSubmit = useMemo(
    () => Boolean(token && email && password && passwordConfirmation),
    [token, email, password, passwordConfirmation],
  )

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword(token, email, password, passwordConfirmation),
    onSuccess: () => {
      navigate('/login', {
        replace: true,
        state: { toast: 'Password reset successful. You can now sign in.' },
      })
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      setErrorMessage('Missing reset token or email.')
      return
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setErrorMessage(null)
    mutation.mutate()
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it strong and memorable.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-zinc-200" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={email}
            readOnly
          />
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="password">
          New password
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm text-zinc-200" htmlFor="password_confirmation">
          Confirm new password
          <input
            id="password_confirmation"
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
          />
        </label>

        {errorMessage ? <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">{errorMessage}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Updating...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-400">
        <Link className="text-indigo-400 hover:text-indigo-300" to="/login">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  )
}
