import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import StreakWidget from '@/components/streak/StreakWidget'

describe('StreakWidget', () => {
  it('shows streak value and last 7 day indicators', () => {
    render(
      <StreakWidget
        currentStreak={5}
        last7Days={[
          { date: '2026-03-28', active: true },
          { date: '2026-03-29', active: false },
          { date: '2026-03-30', active: true },
          { date: '2026-03-31', active: true },
          { date: '2026-04-01', active: false },
          { date: '2026-04-02', active: true },
          { date: '2026-04-03', active: false },
        ]}
      />,
    )

    expect(screen.getByText('🔥 5 day streak')).toBeInTheDocument()

    const dots = screen.getAllByTestId('streak-day-dot')
    expect(dots).toHaveLength(7)
    expect(dots[0]).toHaveTextContent('●')
    expect(dots[1]).toHaveTextContent('○')
  })
})
