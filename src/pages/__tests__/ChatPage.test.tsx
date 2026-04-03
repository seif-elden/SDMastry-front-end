import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import ChatPage from '@/pages/ChatPage'
import { chatApi } from '@/api/chat.api'
import { attemptsApi } from '@/api/attempts.api'
import { topicsApi } from '@/api/topics.api'
import type { SendMessageResponse } from '@/types'
import {
  attemptFixture,
  attemptFixtureTwo,
  chatMessagesFixture,
  topicDetailFixture,
} from '@/test/fixtures/topics'

vi.mock('@/api/chat.api', () => ({
  chatApi: {
    getChatSession: vi.fn(),
    sendMessage: vi.fn(),
  },
}))

vi.mock('@/api/attempts.api', () => ({
  attemptsApi: {
    getTopicAttempts: vi.fn(),
  },
}))

vi.mock('@/api/topics.api', () => ({
  topicsApi: {
    getTopic: vi.fn(),
  },
}))

function renderChatRoute() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const router = createMemoryRouter(
    [
      {
        path: '/topics/:slug/attempts/:attemptId/chat',
        element: <ChatPage />,
      },
    ],
    {
      initialEntries: ['/topics/http-caching-basics/attempts/99/chat'],
    },
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    vi.mocked(topicsApi.getTopic).mockResolvedValue(topicDetailFixture)
    vi.mocked(attemptsApi.getTopicAttempts).mockResolvedValue([attemptFixtureTwo, attemptFixture])
    vi.mocked(chatApi.getChatSession).mockResolvedValue({
      session_id: 99,
      messages: chatMessagesFixture,
    })
  })

  it('renders messages, context banner, and attempt selector', async () => {
    renderChatRoute()

    expect(await screen.findByText('HTTP Caching Basics')).toBeInTheDocument()
    expect(screen.getByText(/You're chatting about:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attempt 1 - 64pts' })).toBeInTheDocument()
    expect(screen.getByText('Can you explain cache revalidation?')).toBeInTheDocument()
  })

  it('shows optimistic user message before API resolves', async () => {
    let resolveResponse: ((value: SendMessageResponse) => void) | undefined

    vi.mocked(chatApi.sendMessage).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve
        }),
    )

    renderChatRoute()

    await screen.findByText('HTTP Caching Basics')

    const input = screen.getByPlaceholderText('Ask a question about this topic...')
    fireEvent.change(input, { target: { value: 'What is stale-while-revalidate?' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(screen.getByText('What is stale-while-revalidate?')).toBeInTheDocument()

    await waitFor(() => {
      expect(chatApi.sendMessage).toHaveBeenCalledWith(99, 'What is stale-while-revalidate?')
      expect(resolveResponse).toBeDefined()
    })

    resolveResponse?.({
      message: {
        id: 123,
        role: 'assistant',
        content: 'It serves stale content while revalidating in the background.',
        created_at: new Date().toISOString(),
      },
    })

    await waitFor(() => {
      expect(screen.getByText('It serves stale content while revalidating in the background.')).toBeInTheDocument()
    })
  })
})
