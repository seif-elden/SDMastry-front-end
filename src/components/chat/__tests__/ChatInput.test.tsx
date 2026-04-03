import { fireEvent, screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import ChatInput from '@/components/chat/ChatInput'

describe('ChatInput', () => {
  it('sends on Enter', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isSending={false} />)

    const input = screen.getByPlaceholderText('Ask a question about this topic...')
    fireEvent.change(input, { target: { value: 'Hello assistant' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('Hello assistant')
  })

  it('adds newline on Shift+Enter', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isSending={false} />)

    const input = screen.getByPlaceholderText('Ask a question about this topic...')
    fireEvent.change(input, { target: { value: 'Line 1' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true })

    expect(onSend).not.toHaveBeenCalled()
  })

  it('is disabled while loading', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} isSending />)

    expect(screen.getByPlaceholderText('Ask a question about this topic...')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })
})
