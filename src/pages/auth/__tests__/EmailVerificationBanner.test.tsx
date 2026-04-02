import { fireEvent, screen, waitFor } from '@testing-library/react'
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner'
import useAuthStore from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { authApi } from '@/api/auth.api'

vi.mock('@/api/auth.api', () => ({
  authApi: {
    resendVerification: vi.fn(),
  },
}))

describe('EmailVerificationBanner', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    vi.clearAllMocks()
  })

  it('shows for unverified users', () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        name: 'Unverified',
        email: 'u@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 0,
      },
      'token',
    )

    renderWithProviders(<EmailVerificationBanner />)

    expect(screen.getByText('Please verify your email.')).toBeInTheDocument()
  })

  it('hides for verified users', () => {
    useAuthStore.getState().setAuth(
      {
        id: 2,
        name: 'Verified',
        email: 'v@example.com',
        email_verified_at: '2026-01-01T00:00:00Z',
        selected_agent: null,
        current_streak: 3,
      },
      'token',
    )

    renderWithProviders(<EmailVerificationBanner />)

    expect(screen.queryByText('Please verify your email.')).not.toBeInTheDocument()
  })

  it('disables resend button after click', async () => {
    const resendSpy = vi.mocked(authApi.resendVerification)
    resendSpy.mockResolvedValue()

    useAuthStore.getState().setAuth(
      {
        id: 3,
        name: 'Pending',
        email: 'pending@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 2,
      },
      'token',
    )

    renderWithProviders(<EmailVerificationBanner />)

    const button = screen.getByRole('button', { name: 'Resend verification email' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Resend verification email \(60s\)/ })).toBeDisabled()
    })
  })
})
