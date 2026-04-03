import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { VERIFICATION_RESEND_COOLDOWN_SECONDS } from '@/config/constants'
import useAuthStore from '@/store/useAuthStore'

const POLL_INTERVAL_MS = 10_000

export default function EmailVerificationBanner() {
  const user = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const [cooldown, setCooldown] = useState(0)
  const [isSent, setIsSent] = useState(false)

  // Poll /auth/me to detect verification done in another tab
  useEffect(() => {
    if (!user || user.email_verified_at || !token) {
      return
    }

    const intervalId = window.setInterval(async () => {
      try {
        const freshUser = await authApi.me()
        if (freshUser.email_verified_at) {
          setAuth(freshUser, token)
        }
      } catch {
        // ignore — user will just see the banner until next poll
      }
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [user, token, setAuth])

  const resendMutation = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      setIsSent(true)
      setCooldown(VERIFICATION_RESEND_COOLDOWN_SECONDS)
    },
  })

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [cooldown])

  if (!user || user.email_verified_at) {
    return null
  }

  return (
    <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
      <p>
        Please verify your email.
        <button
          type="button"
          className="ml-2 font-semibold underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => resendMutation.mutate()}
          disabled={cooldown > 0 || resendMutation.isPending}
        >
          {cooldown > 0 ? `Resend verification email (${cooldown}s)` : 'Resend verification email'}
        </button>
      </p>
      {isSent ? <p className="mt-2 text-xs text-amber-200">Verification email sent.</p> : null}
    </div>
  )
}
