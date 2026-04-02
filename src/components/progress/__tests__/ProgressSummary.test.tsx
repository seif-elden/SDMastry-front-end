import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import ProgressSummary from '@/components/progress/ProgressSummary'

describe('ProgressSummary', () => {
  it('renders correct numbers', () => {
    render(<ProgressSummary overallMastered={10} coreMastered={6} advancedMastered={4} streakDays={12} />)

    expect(screen.getByText('10/53')).toBeInTheDocument()
    expect(screen.getByText('Core: 6/26')).toBeInTheDocument()
    expect(screen.getByText('Advanced: 4/27')).toBeInTheDocument()
    expect(screen.getByText('Streak: 12 days')).toBeInTheDocument()
  })
})
