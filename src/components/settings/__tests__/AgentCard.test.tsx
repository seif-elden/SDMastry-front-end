import { fireEvent, render, screen } from '@testing-library/react'
import AgentCard from '@/components/settings/AgentCard'
import type { AgentOption } from '@/config/agents'

const openAiOption: AgentOption = {
  id: 'openai',
  provider: 'openai',
  name: 'OpenAI',
  model: 'GPT-4o',
  icon: '⚡',
  requiresKey: true,
}

describe('AgentCard', () => {
  it('shows selected state', () => {
    const onSelect = vi.fn()

    render(<AgentCard option={openAiOption} isSelected hasRequiredKey onSelect={onSelect} />)

    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('shows key-required warning when key is missing', () => {
    const onSelect = vi.fn()

    render(<AgentCard option={openAiOption} isSelected={false} hasRequiredKey={false} onSelect={onSelect} />)

    expect(screen.getByText('Add your API key below')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /OpenAI/i }))
    expect(onSelect).toHaveBeenCalledWith('openai')
  })
})
