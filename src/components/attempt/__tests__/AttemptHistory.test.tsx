import { fireEvent, screen, waitFor } from '@testing-library/react'
import AttemptHistory from '@/components/attempt/AttemptHistory'
import { renderWithProviders } from '@/test/renderWithProviders'
import { attemptsApi } from '@/api/attempts.api'
import { attemptFixture, attemptsHistoryFixture } from '@/test/fixtures/topics'

vi.mock('@/api/attempts.api', () => ({
  attemptsApi: {
    getAttempt: vi.fn(),
  },
}))

describe('AttemptHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists attempts and expands selected evaluation', async () => {
    vi.mocked(attemptsApi.getAttempt).mockResolvedValue(attemptFixture)

    renderWithProviders(<AttemptHistory topicSlug="http-caching-basics" attempts={attemptsHistoryFixture} />)

    expect(screen.getByText('Score: 85/100')).toBeInTheDocument()
    expect(screen.getByText('Score: 58/100')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'View Evaluation' })[0])

    await waitFor(() => {
      expect(screen.getByText('Key Strengths')).toBeInTheDocument()
    })
  })
})
