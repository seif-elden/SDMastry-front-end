import type { ReactNode } from 'react'
import { screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import AnalyticsPage from '@/pages/AnalyticsPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { analyticsApi } from '@/api/analytics.api'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div data-testid="recharts-responsive">{children}</div>,
  BarChart: ({ children }: { children: ReactNode }) => <div data-testid="recharts-bar-chart">{children}</div>,
  Bar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: ReactNode }) => <div data-testid="recharts-line-chart">{children}</div>,
  Line: () => <div data-testid="recharts-line" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  CartesianGrid: () => <div />,
  ReferenceLine: () => <div data-testid="pass-threshold-line" />,
  Cell: () => <div />,
}))

vi.mock('@/api/analytics.api', () => ({
  analyticsApi: {
    getAnalytics: vi.fn(),
    getBadges: vi.fn(),
  },
}))

describe('AnalyticsPage', () => {
  it('renders all sections and chart containers with mock data', async () => {
    vi.mocked(analyticsApi.getAnalytics).mockResolvedValue({
      overview: {
        topics_mastered: 12,
        total_topics: 53,
        current_streak: 6,
        longest_streak: 14,
        average_score: 82,
      },
      category_heatmap: [
        { category: 'Caching', completed_topics: 3, total_topics: 4, completion_percentage: 75 },
        { category: 'Databases', completed_topics: 2, total_topics: 5, completion_percentage: 40 },
      ],
      score_timeline: [
        { topic_slug: 'http-caching', topic_title: 'HTTP Caching', attempted_at: '2026-03-01T00:00:00Z', score: 65 },
        { topic_slug: 'http-caching', topic_title: 'HTTP Caching', attempted_at: '2026-03-05T00:00:00Z', score: 84 },
        { topic_slug: 'db-indexing', topic_title: 'DB Indexing', attempted_at: '2026-03-02T00:00:00Z', score: 72 },
        { topic_slug: 'db-indexing', topic_title: 'DB Indexing', attempted_at: '2026-03-06T00:00:00Z', score: 76 },
      ],
      activity_calendar: Array.from({ length: 365 }).map((_, index) => ({
        date: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`,
        activity_count: index % 3,
      })),
      weak_areas: [
        {
          topic_slug: 'db-indexing',
          topic_title: 'DB Indexing',
          category: 'Databases',
          best_score: 72,
          attempts_count: 2,
        },
      ],
      time_spent: [
        { topic_slug: 'http-caching', topic_title: 'HTTP Caching', average_minutes: 14.2 },
      ],
      streak: {
        current: 6,
        longest: 14,
        last_7_days: [
          { date: '2026-03-28', active: true },
          { date: '2026-03-29', active: false },
          { date: '2026-03-30', active: true },
          { date: '2026-03-31', active: true },
          { date: '2026-04-01', active: true },
          { date: '2026-04-02', active: true },
          { date: '2026-04-03', active: false },
        ],
      },
    })

    renderWithProviders(<AnalyticsPage />)

    expect(await screen.findByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Category Heatmap')).toBeInTheDocument()
    expect(screen.getByText('Score Timeline')).toBeInTheDocument()
    expect(screen.getByText('Activity Calendar')).toBeInTheDocument()
    expect(screen.getByText('Weak Areas')).toBeInTheDocument()
    expect(screen.getByText('Time Spent')).toBeInTheDocument()

    expect(screen.getAllByTestId('recharts-bar-chart').length).toBeGreaterThan(0)
    expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pass-threshold-line')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Topic selector'), { target: { value: 'http-caching' } })
    expect(screen.getByLabelText('Topic selector')).toHaveValue('http-caching')
  })
})
