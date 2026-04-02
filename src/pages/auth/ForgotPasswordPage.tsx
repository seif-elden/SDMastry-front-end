import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import AuthLayout from '@/layouts/AuthLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => {
      setIsSubmitted(true)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <AuthLayout title="Reset password" subtitle="We will send you a secure reset link.">
      {isSubmitted ? (
        <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <p className="font-semibold">Check your email</p>
          <p>We sent a password reset link to {email}.</p>
          <Link className="font-medium text-indigo-400 hover:text-indigo-300" to="/login">
            Back to login
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-zinc-200" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-zinc-400">
            <Link className="text-indigo-400 hover:text-indigo-300" to="/login">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
