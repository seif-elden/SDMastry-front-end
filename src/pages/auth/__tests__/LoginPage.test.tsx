import { fireEvent, screen, waitFor } from '@testing-library/react'
import LoginPage from '@/pages/auth/LoginPage'
import useAuthStore from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { authApi } from '@/api/auth.api'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  }
})

vi.mock('@/api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    useAuthStore.getState().clearAuth()
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows API error on wrong password', async () => {
    const loginSpy = vi.mocked(authApi.login)
    loginSpy.mockRejectedValue({ message: 'Invalid credentials', errors: {} })

    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('stores auth and redirects on success', async () => {
    const loginSpy = vi.mocked(authApi.login)
    loginSpy.mockResolvedValue({
      user: {
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 4,
      },
      token: 'token-login',
    })

    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/roadmap', { replace: true })
    })

    expect(useAuthStore.getState().token).toBe('token-login')
  })
})
