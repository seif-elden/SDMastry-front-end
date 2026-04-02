import { fireEvent, screen } from '@testing-library/react'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { authApi } from '@/api/auth.api'

vi.mock('@/api/auth.api', () => ({
  authApi: {
    forgotPassword: vi.fn(),
  },
}))

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows confirmation after submit', async () => {
    const forgotSpy = vi.mocked(authApi.forgotPassword)
    forgotSpy.mockResolvedValue()

    renderWithProviders(<ForgotPasswordPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'student@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    expect(await screen.findByText('Check your email')).toBeInTheDocument()
    expect(screen.getByText('We sent a password reset link to student@example.com.')).toBeInTheDocument()
  })
})
