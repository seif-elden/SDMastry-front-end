import { fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import EvaluationResult from '@/components/attempt/EvaluationResult'
import { attemptFixture } from '@/test/fixtures/topics'
import type { TopicAttempt } from '@/types'

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

  it('toggles notes section', () => {
    render(
      <MemoryRouter>
        <EvaluationResult attempt={attemptFixture} topicSlug="http-caching-basics" />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Notes' }))
    expect(screen.getByText(attemptFixture.evaluation?.notes ?? '')).toBeInTheDocument()
    expect(screen.getByText(/Sources:/)).toBeInTheDocument()
  })

  it('renders strengths and weaknesses from snake_case evaluation keys', () => {
    const snakeCaseAttempt: TopicAttempt = {
      ...attemptFixture,
      evaluation: {
        key_strengths: ['Clear explanation of cache validators'],
        key_weaknesses: ['Missing discussion of cache invalidation strategy'],
        concepts_to_study: ['Cache invalidation'],
        notes: 'Notes content.',
        sources: ['source-a'],
      },
    }

    render(
      <MemoryRouter>
        <EvaluationResult attempt={snakeCaseAttempt} topicSlug="http-caching-basics" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Clear explanation of cache validators')).toBeInTheDocument()
    expect(screen.getByText('Missing discussion of cache invalidation strategy')).toBeInTheDocument()
  })
})
