import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import ActivityCalendar from '@/components/analytics/ActivityCalendar'

describe('ActivityCalendar', () => {
  it('renders 365 cells and applies intensity classes', () => {
    const days = Array.from({ length: 365 }).map((_, index) => ({
      date: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`,
      activity_count: index % 3,
    }))

    render(<ActivityCalendar days={days} />)

    const cells = screen.getAllByTestId('activity-cell')
    expect(cells).toHaveLength(365)

    expect(cells[0]).toHaveClass('bg-zinc-800')
    expect(cells[1]).toHaveClass('bg-emerald-500/50')
    expect(cells[2]).toHaveClass('bg-emerald-500')
  })
})
