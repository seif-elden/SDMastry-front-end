import { fireEvent, screen, waitFor } from '@testing-library/react'
import AttemptHistory from '@/components/attempt/AttemptHistory'
import { renderWithProviders } from '@/test/renderWithProviders'
import { attemptsApi } from '@/api/attempts.api'
import { chatApi } from '@/api/chat.api'
import { attemptFixture, attemptsHistoryFixture } from '@/test/fixtures/topics'

vi.mock('@/api/attempts.api', () => ({
  attemptsApi: {
    getAttempt: vi.fn(),
  },
}))

vi.mock('@/api/chat.api', () => ({
  chatApi: {
    getChatSession: vi.fn(),
  },
}))

describe('AttemptHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists attempts and expands selected evaluation', async () => {
    vi.mocked(attemptsApi.getAttempt).mockResolvedValue(attemptFixture)
    vi.mocked(chatApi.getChatSession).mockResolvedValue({
      session_id: 1,
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: 'Great work. Let us review your answer depth.',
          created_at: '2026-04-02T10:02:00Z',
        },
      ],
    })

    renderWithProviders(<AttemptHistory topicSlug="http-caching-basics" attempts={attemptsHistoryFixture} />)

    expect(screen.getByText('Score: 85/100')).toBeInTheDocument()
    expect(screen.getByText('Score: 58/100')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Show Details' })[0])

    await waitFor(() => {
      expect(screen.getByText('Key Strengths')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Your Submitted Answer')).toBeInTheDocument()
      expect(screen.getByText('An answer about caching and validation headers.')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Chat History')).toBeInTheDocument()
      expect(screen.getByText('Great work. Let us review your answer depth.')).toBeInTheDocument()
    })
  })
})
