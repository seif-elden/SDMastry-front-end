import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { analyticsApi } from '@/api/analytics.api'
import ActivityCalendar from '@/components/analytics/ActivityCalendar'
import StreakWidget from '@/components/streak/StreakWidget'
import { ANALYTICS_PASS_THRESHOLD, ANALYTICS_QUERY_STALE_TIME_MS } from '@/config/constants'

const lineColors = ['#818cf8', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa']

function getCategoryBarColor(completionPercentage: number) {
  if (completionPercentage >= 100) {
    return '#22c55e'
  }

  if (completionPercentage >= 50) {
    return '#f59e0b'
  }

  return '#ef4444'
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function toNumber(value: string | number | readonly (string | number)[] | undefined) {
  if (Array.isArray(value)) {
    return toNumber(value[0])
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  return 0
}

export default function AnalyticsPage() {
  const [topicFilter, setTopicFilter] = useState<string>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getAnalytics,
    staleTime: ANALYTICS_QUERY_STALE_TIME_MS,
  })

  const timelineTopics = useMemo(() => {
    if (!data?.score_timeline.length) {
      return []
    }

    const counts = data.score_timeline.reduce<Record<string, { title: string; count: number }>>((acc, point) => {
      const existing = acc[point.topic_slug]

      if (existing) {
        existing.count += 1
        return acc
      }

      acc[point.topic_slug] = {
        title: point.topic_title,
        count: 1,
      }
      return acc
    }, {})

    return Object.entries(counts)
      .filter(([, value]) => value.count >= 2)
      .map(([slug, value]) => ({ slug, title: value.title }))
  }, [data?.score_timeline])

  const visibleTimelineSlugs = useMemo(() => {
    if (topicFilter === 'all') {
      return timelineTopics.map((topic) => topic.slug)
    }

    return [topicFilter]
  }, [timelineTopics, topicFilter])

  const timelineChartData = useMemo(() => {
    if (!data?.score_timeline.length || visibleTimelineSlugs.length === 0) {
      return []
    }

    const groupedByDate = new Map<string, Record<string, number | string>>()

    data.score_timeline
      .filter((point) => visibleTimelineSlugs.includes(point.topic_slug))
      .forEach((point) => {
        const dateKey = point.attempted_at.slice(0, 10)
        const existing = groupedByDate.get(dateKey) ?? { date: formatShortDate(point.attempted_at), rawDate: dateKey }
        existing[point.topic_slug] = point.score
        groupedByDate.set(dateKey, existing)
      })

    return Array.from(groupedByDate.values()).sort((a, b) => {
      return String(a.rawDate).localeCompare(String(b.rawDate))
    })
  }, [data?.score_timeline, visibleTimelineSlugs])

  const weakAreas = useMemo(() => {
    return [...(data?.weak_areas ?? [])].sort((a, b) => a.best_score - b.best_score).slice(0, 5)
  }, [data?.weak_areas])

  const timeSpent = useMemo(() => {
    return [...(data?.time_spent ?? [])].sort((a, b) => b.average_minutes - a.average_minutes).slice(0, 10)
  }, [data?.time_spent])

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-zinc-800/60" />
  }

  if (isError || !data || !data.overview) {
    return (
      <section className="rounded-xl border border-red-600/40 bg-red-500/10 p-6 text-red-100">
        Failed to load analytics.
      </section>
    )
  }

  const topicsMasteredProgress = Math.min((data.overview.topics_mastered / data.overview.total_topics) * 100, 100)

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100 md:text-3xl">Analytics Dashboard</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-sm text-zinc-400">Topics Mastered</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">
            {data.overview.topics_mastered}/{data.overview.total_topics}
          </p>
          <progress
            className="mt-3 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-value]:bg-indigo-500"
            value={topicsMasteredProgress}
            max={100}
            aria-label="Topics mastered progress"
          />
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-sm text-zinc-400">Current Streak</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">🔥 {data.overview.current_streak} days</p>
          <div className="mt-3">
            <StreakWidget currentStreak={data.streak.current} last7Days={data.streak.last_7_days} />
          </div>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-sm text-zinc-400">Longest Streak</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">⚡ {data.overview.longest_streak} days</p>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-sm text-zinc-400">Avg Score</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{Math.round(data.overview.average_score)}/100</p>
        </article>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <h2 className="text-lg font-semibold text-zinc-100">Category Heatmap</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.category_heatmap} layout="vertical" margin={{ left: 24, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a1a1aa' }} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: '#d4d4d8' }}
                width={120}
                tickFormatter={(_, index) => {
                  const item = data.category_heatmap[index]
                  return item ? `${item.category} (${item.completed_topics}/${item.total_topics})` : ''
                }}
              />
              <Tooltip formatter={(value) => `${toNumber(value)}%`} />
              <Bar dataKey="completion_percentage" radius={[0, 8, 8, 0]}>
                {data.category_heatmap.map((item) => (
                  <Cell key={item.category} fill={getCategoryBarColor(item.completion_percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Score Timeline</h2>
          <label className="text-sm text-zinc-300">
            Topic
            <select
              aria-label="Topic selector"
              className="ml-2 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
            >
              <option value="all">All eligible topics</option>
              {timelineTopics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {timelineTopics.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">No topics with at least two attempts yet.</p>
        ) : (
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fill: '#a1a1aa' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#a1a1aa' }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={ANALYTICS_PASS_THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" label="Pass 80" />
                {timelineTopics
                  .filter((topic) => visibleTimelineSlugs.includes(topic.slug))
                  .map((topic, index) => (
                    <Line
                      key={topic.slug}
                      type="monotone"
                      dataKey={topic.slug}
                      name={topic.title}
                      stroke={lineColors[index % lineColors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <ActivityCalendar days={data.activity_calendar} />

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <h2 className="text-lg font-semibold text-zinc-100">Weak Areas</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="pb-2">Topic</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Best Score</th>
                <th className="pb-2">Attempts</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {weakAreas.map((topic) => (
                <tr key={topic.topic_slug} className="border-t border-zinc-800">
                  <td className="py-2">
                    <Link to={`/topics/${topic.topic_slug}`} className="text-indigo-300 hover:text-indigo-200">
                      {topic.topic_title}
                    </Link>
                  </td>
                  <td className="py-2">{topic.category}</td>
                  <td className="py-2">{topic.best_score}</td>
                  <td className="py-2">{topic.attempts_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <h2 className="text-lg font-semibold text-zinc-100">Time Spent</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSpent} layout="vertical" margin={{ left: 24, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" tick={{ fill: '#a1a1aa' }} />
              <YAxis type="category" dataKey="topic_title" tick={{ fill: '#d4d4d8' }} width={160} />
              <Tooltip formatter={(value) => `${toNumber(value).toFixed(1)} min`} />
              <Bar dataKey="average_minutes" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </section>
  )
}
