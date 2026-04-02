import { screen } from '@testing-library/react'
import EvaluationPending from '@/components/attempt/EvaluationPending'
import { renderWithProviders } from '@/test/renderWithProviders'
import { attemptsApi } from '@/api/attempts.api'

vi.mock('@/api/attempts.api', () => ({
  attemptsApi: {
    getAttemptStatus: vi.fn(),
  },
}))

describe('EvaluationPending', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading and polls until complete', async () => {
    const onComplete = vi.fn()

    vi.mocked(attemptsApi.getAttemptStatus)
      .mockResolvedValueOnce({ attempt_id: 12, status: 'processing', score: null, passed: null })
      .mockResolvedValueOnce({ attempt_id: 12, status: 'complete', score: 86, passed: true })

    renderWithProviders(<EvaluationPending attemptId={12} onComplete={onComplete} onTryAgain={vi.fn()} />)

    expect(screen.getByText('Evaluating your answer')).toBeInTheDocument()
    expect(screen.getByText('Analyzing your answer...')).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(2000)
    await Promise.resolve()
    await Promise.resolve()

    expect(onComplete).toHaveBeenCalledWith({
      attempt_id: 12,
      status: 'complete',
      score: 86,
      passed: true,
    })
  })
})
