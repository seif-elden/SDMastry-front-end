import client from '@/api/client'
import type { TopicDetail, TopicWithProgress } from '@/types'

interface TopicProgressPayload {
  best_score?: number | null
  attempts_count?: number | null
  passed?: boolean | null
  passed_at?: string | null
}

interface TopicPayload {
  id: number
  slug: string
  title: string
  description?: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  section: 'core' | 'advanced'
  best_score?: number | null
  attempts_count?: number | null
  passed?: boolean | null
  passed_at?: string | null
  progress?: TopicProgressPayload | null
}

function normalizeTopicWithProgress(topic: TopicPayload): TopicWithProgress {
  const progress = topic.progress ?? null

  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    description: topic.description ?? '',
    category: topic.category,
    level: topic.level,
    section: topic.section,
    best_score: progress?.best_score ?? topic.best_score ?? null,
    attempts_count: progress?.attempts_count ?? topic.attempts_count ?? 0,
    passed: progress?.passed ?? topic.passed ?? false,
    passed_at: progress?.passed_at ?? topic.passed_at ?? null,
  }
}

export const topicsApi = {
  getTopics: async (): Promise<TopicWithProgress[]> => {
    const data = await client.get<unknown, unknown>('/topics')

    if (!Array.isArray(data)) {
      return []
    }

    return data.map((topic) => normalizeTopicWithProgress(topic as TopicPayload))
  },

  getTopic: async (slug: string): Promise<TopicDetail> => {
    const data = await client.get<unknown, TopicDetail>(`/topics/${slug}`)
    return data
  },
}
