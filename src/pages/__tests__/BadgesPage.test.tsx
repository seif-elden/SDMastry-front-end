import { screen } from '@testing-library/react'
import BadgesPage from '@/pages/BadgesPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { analyticsApi } from '@/api/analytics.api'

vi.mock('@/api/analytics.api', () => ({
  analyticsApi: {
    getBadges: vi.fn(),
    getAnalytics: vi.fn(),
  },
}))

describe('BadgesPage', () => {
  it('shows earned count and earned/unearned badge visuals', async () => {
    vi.mocked(analyticsApi.getBadges).mockResolvedValue({
      badges: [
        {
          id: 1,
          slug: 'first-pass',
          name: 'First Pass',
          description: 'Pass your first topic.',
          icon: '🏅',
          group: 'progress',
          earned: true,
          earned_at: '2026-04-01T00:00:00Z',
          hint: 'Complete one topic.',
        },
        {
          id: 2,
          slug: 'streak-7',
          name: 'Week Warrior',
          description: 'Keep a 7-day streak.',
          icon: '🔥',
          group: 'streaks',
          earned: false,
          earned_at: null,
          hint: 'Study every day for a week.',
        },
      ],
    })

    renderWithProviders(<BadgesPage />)

    expect(await screen.findByText('Your Badges - 1/2 earned')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('Streaks')).toBeInTheDocument()

    const cards = screen.getAllByTestId('badge-card')
    expect(cards[0]).not.toHaveClass('grayscale')
    expect(cards[1]).toHaveClass('grayscale')
  })
})
