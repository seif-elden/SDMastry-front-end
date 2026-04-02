import { screen } from '@testing-library/react'
import RoadmapPage from '@/pages/RoadmapPage'
import useAuthStore from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/renderWithProviders'
import { topicFixtures } from '@/test/fixtures/topics'
import { useTopics } from '@/hooks/useTopics'

vi.mock('@/hooks/useTopics', () => ({
  useTopics: vi.fn(),
}))

describe('RoadmapPage', () => {
  beforeEach(() => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        name: 'Roadmap User',
        email: 'roadmap@example.com',
        email_verified_at: '2026-04-01T00:00:00Z',
        selected_agent: null,
        current_streak: 7,
      },
      'token',
    )
    vi.clearAllMocks()
  })

  it('renders sections, counts, and topic cards', () => {
    vi.mocked(useTopics).mockReturnValue({
      data: topicFixtures,
      isLoading: false,
    } as ReturnType<typeof useTopics>)

    renderWithProviders(<RoadmapPage />)

    expect(screen.getByText('Your Learning Roadmap')).toBeInTheDocument()
    expect(screen.getByText('Core Topics (26)')).toBeInTheDocument()
    expect(screen.getByText('Advanced Topics (27)')).toBeInTheDocument()
    expect(screen.getByText('1/53 topics mastered')).toBeInTheDocument()

    expect(screen.getByText('HTTP Caching Basics')).toBeInTheDocument()
    expect(screen.getByText('Database Indexing')).toBeInTheDocument()
    expect(screen.getByText('Global Load Balancing')).toBeInTheDocument()
  })
})
