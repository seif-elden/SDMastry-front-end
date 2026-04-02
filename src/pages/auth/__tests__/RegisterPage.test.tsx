import { fireEvent, screen, waitFor } from '@testing-library/react'
import RegisterPage from '@/pages/auth/RegisterPage'
import useAuthStore from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { authApi } from '@/api/auth.api'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/api/auth.api', () => ({
  authApi: {
    register: vi.fn(),
  },
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    useAuthStore.getState().clearAuth()
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    renderWithProviders(<RegisterPage />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
  })

  it('shows inline validation errors', async () => {
    renderWithProviders(<RegisterPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your password.')).toBeInTheDocument()
  })

  it('stores auth and redirects on success', async () => {
    const registerSpy = vi.mocked(authApi.register)
    registerSpy.mockResolvedValue({
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 0,
      },
      token: 'token-123',
    })

    renderWithProviders(<RegisterPage />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/roadmap', { replace: true })
    })

    expect(useAuthStore.getState().token).toBe('token-123')
  })
})
