import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import SettingsPage from '@/pages/SettingsPage'
import { settingsApi } from '@/api/settings.api'
import useAuthStore from '@/store/useAuthStore'

vi.mock('@/api/settings.api', () => ({
  settingsApi: {
    getAgentSettings: vi.fn(),
    updateSelectedAgent: vi.fn(),
    updateApiKey: vi.fn(),
    deleteApiKey: vi.fn(),
  },
}))

function renderSettings() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(settingsApi.getAgentSettings).mockResolvedValue({
      selected_agent: 'ollama',
      api_keys: [
        { provider: 'openai', is_set: true, last4: '1234' },
        { provider: 'gemini', is_set: false },
        { provider: 'grok', is_set: false },
      ],
    })

    useAuthStore.getState().setAuth(
      {
        id: 1,
        name: 'Settings User',
        email: 'settings@example.com',
        email_verified_at: '2026-04-03T00:00:00Z',
        selected_agent: 'ollama',
        current_streak: 3,
      },
      'token',
    )
  })

  it('renders agent cards and selecting one calls API', async () => {
    vi.mocked(settingsApi.updateSelectedAgent).mockResolvedValue()

    renderSettings()

    const openAiCard = await screen.findByRole('button', { name: /OpenAI/i })
    fireEvent.click(openAiCard)

    await waitFor(() => {
      expect(settingsApi.updateSelectedAgent).toHaveBeenCalled()
    })

    expect(vi.mocked(settingsApi.updateSelectedAgent).mock.calls[0]?.[0]).toBe('openai')
  })

  it('shows saved key masked and unsaved key input', async () => {
    renderSettings()

    expect(await screen.findByText('✓ Key saved')).toBeInTheDocument()
    expect(screen.getByText('••••••••••••1234')).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('sk-...').length).toBeGreaterThan(0)
  })

  it('save key calls API with provider and key and key value is not rendered after save', async () => {
    vi.mocked(settingsApi.updateApiKey).mockResolvedValue()

    renderSettings()

    const geminiLabel = await screen.findByText('Gemini API Key')
    const geminiSection = geminiLabel.closest('article') as HTMLElement
    const geminiInput = within(geminiSection).getByPlaceholderText('sk-...')
    fireEvent.change(geminiInput, { target: { value: 'sk-secret-9876' } })

    const saveButton = within(geminiSection).getByRole('button', { name: 'Save Key' })
    expect(saveButton).toBeEnabled()
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(settingsApi.updateApiKey).toHaveBeenCalledWith('gemini', 'sk-secret-9876')
    })

    expect(screen.queryByText('sk-secret-9876')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('sk-secret-9876')).not.toBeInTheDocument()
  })

  it('delete key confirms then calls delete API', async () => {
    vi.mocked(settingsApi.deleteApiKey).mockResolvedValue()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderSettings()

    const removeButton = await screen.findByRole('button', { name: 'Remove' })
    fireEvent.click(removeButton)

    await waitFor(() => {
      expect(settingsApi.deleteApiKey).toHaveBeenCalledWith('openai')
    })

    confirmSpy.mockRestore()
  })
})
