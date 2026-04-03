import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import TopicCard from '@/components/topics/TopicCard'
import { topicFixtures } from '@/test/fixtures/topics'

describe('TopicCard', () => {
  it('renders not-attempted state', () => {
    render(
      <MemoryRouter>
        <TopicCard topic={topicFixtures[2]} isVerified />
      </MemoryRouter>,
    )

    expect(screen.getByText('Start Topic')).toBeInTheDocument()
    expect(screen.getByText('0 attempts')).toBeInTheDocument()
    expect(screen.queryByText(/Best:/)).not.toBeInTheDocument()
  })

  it('renders passed state', () => {
    render(
      <MemoryRouter>
        <TopicCard topic={topicFixtures[0]} isVerified />
      </MemoryRouter>,
    )

    expect(screen.getByText('Passed')).toBeInTheDocument()
    expect(screen.getByText('Highest: 85/100')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('renders failed state', () => {
    render(
      <MemoryRouter>
        <TopicCard topic={topicFixtures[1]} isVerified />
      </MemoryRouter>,
    )

    expect(screen.getByText('Highest: 64/100')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
    expect(screen.queryByText('Passed')).not.toBeInTheDocument()
  })

  it('renders unverified locked state', () => {
    render(
      <MemoryRouter>
        <TopicCard topic={topicFixtures[1]} isVerified={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText('LOCKED')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
  })
})
