import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import BadgeCard from '@/components/badges/BadgeCard'
import type { UserBadgeStatus } from '@/types'

const baseBadge: UserBadgeStatus = {
  id: 1,
  slug: 'streak-7',
  name: 'Week Warrior',
  description: 'Maintain a 7-day streak.',
  icon: '🔥',
  group: 'streaks',
  earned: true,
  earned_at: '2026-04-01T10:00:00Z',
  hint: 'Keep showing up daily.',
}

describe('BadgeCard', () => {
  it('shows earned state and earned date', () => {
    render(<BadgeCard badge={baseBadge} />)

    expect(screen.getByText('Week Warrior')).toBeInTheDocument()
    expect(screen.getByText(/Earned/i)).toBeInTheDocument()
  })

  it('shows unearned grayscale state and lock overlay', () => {
    render(<BadgeCard badge={{ ...baseBadge, earned: false, earned_at: null }} />)

    const card = screen.getByTestId('badge-card')
    expect(card).toHaveClass('grayscale')
    expect(screen.getByText('🔒')).toBeInTheDocument()
  })
})
