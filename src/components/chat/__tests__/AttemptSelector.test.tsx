import { fireEvent, screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import AttemptSelector from '@/components/chat/AttemptSelector'
import { attemptFixture, attemptFixtureTwo } from '@/test/fixtures/topics'

describe('AttemptSelector', () => {
  it('shows attempts with scores and switches selection', () => {
    const onSelectAttempt = vi.fn()

    render(
      <AttemptSelector
        attempts={[attemptFixtureTwo, attemptFixture]}
        selectedAttemptId={attemptFixtureTwo.id}
        onSelectAttempt={onSelectAttempt}
      />,
    )

    expect(screen.getByRole('button', { name: 'Attempt 1 - 64pts' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attempt 2 - 85pts ✓' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Attempt 2 - 85pts ✓' }))

    expect(onSelectAttempt).toHaveBeenCalledWith(99)
  })
})
