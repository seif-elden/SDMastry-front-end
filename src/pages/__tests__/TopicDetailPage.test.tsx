import { screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import TopicDetailPage from '@/pages/TopicDetailPage'
import useAuthStore from '@/store/useAuthStore'
import { topicsApi } from '@/api/topics.api'
import { topicDetailFixture, topicDetailNoAttemptsFixture } from '@/test/fixtures/topics'

vi.mock('@/api/topics.api', () => ({
  topicsApi: {
    getTopic: vi.fn(),
  },
}))

function renderTopicRoute() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const router = createMemoryRouter(
    [
      {
        path: '/topics/:slug',
        element: <TopicDetailPage />,
      },
    ],
    {
      initialEntries: ['/topics/http-caching-basics'],
    },
  )

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
    queryClient,
  }
}

import { render } from '@testing-library/react'

describe('TopicDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows hook question', async () => {
    vi.mocked(topicsApi.getTopic).mockResolvedValue(topicDetailFixture)
    useAuthStore.getState().setAuth(
      {
        id: 1,
        name: 'Verified User',
        email: 'verified@example.com',
        email_verified_at: '2026-03-01T00:00:00Z',
        selected_agent: null,
        current_streak: 2,
      },
      'token',
    )

    renderTopicRoute()

    expect(await screen.findByText('Hook Question')).toBeInTheDocument()
    expect(screen.getByText(topicDetailFixture.hook_question)).toBeInTheDocument()
  })

  it('shows past attempts list', async () => {
    vi.mocked(topicsApi.getTopic).mockResolvedValue(topicDetailFixture)
    useAuthStore.getState().setAuth(
      {
        id: 2,
        name: 'Attempted User',
        email: 'attempted@example.com',
        email_verified_at: '2026-03-01T00:00:00Z',
        selected_agent: null,
        current_streak: 5,
      },
      'token',
    )

    renderTopicRoute()

    expect(await screen.findByText('Attempt History')).toBeInTheDocument()
    expect(screen.getByText('Score: 85/100')).toBeInTheDocument()
    expect(screen.getByText('Show Details')).toBeInTheDocument()
  })

  it('blocks actions for unverified users', async () => {
    vi.mocked(topicsApi.getTopic).mockResolvedValue(topicDetailNoAttemptsFixture)
    useAuthStore.getState().setAuth(
      {
        id: 3,
        name: 'Unverified User',
        email: 'unverified@example.com',
        email_verified_at: null,
        selected_agent: null,
        current_streak: 0,
      },
      'token',
    )

    renderTopicRoute()

    await waitFor(() => {
      expect(screen.getByText('Verify your email to unlock attempts.')).toBeInTheDocument()
    })
  })
})
