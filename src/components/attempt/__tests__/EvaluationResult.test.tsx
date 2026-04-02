import { fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import EvaluationResult from '@/components/attempt/EvaluationResult'
import { attemptFixture } from '@/test/fixtures/topics'

describe('EvaluationResult', () => {
  it('shows score, strengths, and weaknesses', () => {
    render(
      <MemoryRouter>
        <EvaluationResult attempt={attemptFixture} topicSlug="http-caching-basics" />
      </MemoryRouter>,
    )

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('Key Strengths')).toBeInTheDocument()
    expect(screen.getByText('Key Weaknesses')).toBeInTheDocument()
    expect(screen.getByText('Passed ✓')).toBeInTheDocument()
  })

  it('toggles model answer section', () => {
    render(
      <MemoryRouter>
        <EvaluationResult attempt={attemptFixture} topicSlug="http-caching-basics" />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Model Answer' }))
    expect(screen.getByText(attemptFixture.evaluation?.model_answer ?? '')).toBeInTheDocument()
    expect(screen.getByText(/Sources:/)).toBeInTheDocument()
  })
})
