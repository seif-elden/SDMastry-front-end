import { fireEvent, screen, waitFor } from '@testing-library/react'
import AnswerForm from '@/components/attempt/AnswerForm'
import { renderWithProviders } from '@/test/renderWithProviders'
import { attemptsApi } from '@/api/attempts.api'

vi.mock('@/api/attempts.api', () => ({
  attemptsApi: {
    submitAttempt: vi.fn(),
  },
}))

describe('AnswerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables submit below 50 chars and shows char counter', () => {
    renderWithProviders(<AnswerForm topicSlug="http-caching-basics" hookQuestion="Why cache?" onSubmitted={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Submit Answer' })
    expect(button).toBeDisabled()
    expect(screen.getByText('0/5000')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: 'short answer text' } })
    expect(button).toBeDisabled()
    expect(screen.getByText('17/5000')).toBeInTheDocument()
  })

  it('submits and calls API when valid', async () => {
    const onSubmitted = vi.fn()
    vi.mocked(attemptsApi.submitAttempt).mockResolvedValue({ attempt_id: 77, status: 'pending' })

    renderWithProviders(<AnswerForm topicSlug="http-caching-basics" hookQuestion="Why cache?" onSubmitted={onSubmitted} />)

    fireEvent.change(screen.getByLabelText('Your answer'), {
      target: { value: 'A'.repeat(60) },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }))

    await waitFor(() => {
      expect(attemptsApi.submitAttempt).toHaveBeenCalledWith('http-caching-basics', 'A'.repeat(60))
    })

    expect(onSubmitted).toHaveBeenCalledWith({ attempt_id: 77, status: 'pending' })
  })
})
