import useAuthStore from '@/store/useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clearAuth()
  })

  it('setAuth persists token', () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        name: 'Tester',
        email: 'tester@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 0,
      },
      'persist-token',
    )

    const persisted = localStorage.getItem('sdm-auth')

    expect(persisted).toContain('persist-token')
  })

  it('clearAuth removes token from state', () => {
    useAuthStore.getState().setAuth(
      {
        id: 2,
        name: 'User',
        email: 'user@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 1,
      },
      'clear-me',
    )

    useAuthStore.getState().clearAuth()

    expect(useAuthStore.getState().token).toBeNull()
  })
})
