import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import MessageList from '@/components/chat/MessageList'
import { chatMessagesFixture } from '@/test/fixtures/topics'

describe('MessageList', () => {
  it('renders user and assistant messages and styles first assistant as notes', () => {
    render(<MessageList messages={chatMessagesFixture} topicTitle="HTTP Caching Basics" />)

    expect(screen.getAllByText('🤖 Assistant').length).toBeGreaterThan(0)
    expect(screen.getByText('📚 Notes')).toBeInTheDocument()
    expect(screen.getByText('Can you explain cache revalidation?')).toBeInTheDocument()
    expect(screen.getByText('Sure. Use ETag and If-None-Match to avoid sending full payloads.')).toBeInTheDocument()
  })
})
