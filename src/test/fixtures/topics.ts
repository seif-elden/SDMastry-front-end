import type { ChatMessage, TopicAttempt, TopicDetail, TopicWithProgress } from '@/types'

export const topicFixtures: TopicWithProgress[] = [
  {
    id: 1,
    slug: 'http-caching-basics',
    title: 'HTTP Caching Basics',
    description: 'Understand cache headers and freshness strategies.',
    category: 'Caching',
    level: 'beginner',
    section: 'core',
    best_score: 85,
    attempts_count: 2,
    passed: true,
    passed_at: '2026-04-03T09:00:00Z',
  },
  {
    id: 2,
    slug: 'database-indexing',
    title: 'Database Indexing',
    description: 'Learn how indexes impact query plans and performance.',
    category: 'Databases',
    level: 'intermediate',
    section: 'core',
    best_score: 64,
    attempts_count: 1,
    passed: false,
    passed_at: null,
  },
  {
    id: 3,
    slug: 'global-load-balancing',
    title: 'Global Load Balancing',
    description: 'Design traffic routing for resilient distributed systems.',
    category: 'Load Balancers',
    level: 'advanced',
    section: 'advanced',
    best_score: null,
    attempts_count: 0,
    passed: false,
    passed_at: null,
  },
]

export const topicDetailFixture: TopicDetail = {
  ...topicFixtures[0],
  key_points: ['Cache-Control controls client behavior', 'ETag supports conditional requests'],
  hook_question: 'Why can stale content still improve user experience in high-latency systems?',
  attempts: [
    {
      id: 99,
      score: 85,
      passed: true,
      created_at: '2026-04-02T10:00:00Z',
    },
  ],
}

export const topicDetailNoAttemptsFixture: TopicDetail = {
  ...topicFixtures[2],
  key_points: ['Health checks detect unhealthy targets', 'Routing policy affects latency and fault tolerance'],
  hook_question: 'How would you route traffic across three regions with different failure rates?',
  attempts: [],
}

export const attemptFixture: TopicAttempt = {
  id: 99,
  topic_id: 1,
  user_id: 1,
  topic_slug: 'http-caching-basics',
  answer: 'An answer about caching and validation headers.',
  score: 85,
  passed: true,
  status: 'complete',
  feedback: 'Great structure and examples.',
  evaluation: {
    strengths: ['Clear explanation of cache revalidation', 'Good trade-off analysis'],
    weaknesses: ['Could explain stale-while-revalidate deeper'],
    concepts_to_study: ['Cache invalidation', 'CDN cache hierarchy'],
    model_answer: 'A strong caching strategy blends max-age, validation tokens, and invalidation policies.',
    sources: ['Designing Data-Intensive Applications', 'High Performance Browser Networking'],
    next_topic: {
      slug: 'database-indexing',
      title: 'Database Indexing',
    },
  },
  created_at: '2026-04-02T10:00:00Z',
  updated_at: '2026-04-02T10:01:00Z',
}

export const attemptsHistoryFixture = [
  {
    id: 99,
    score: 85,
    passed: true,
    created_at: '2026-04-02T10:00:00Z',
  },
  {
    id: 100,
    score: 58,
    passed: false,
    created_at: '2026-04-01T09:30:00Z',
  },
]

export const attemptFixtureTwo: TopicAttempt = {
  ...attemptFixture,
  id: 100,
  score: 64,
  passed: false,
  created_at: '2026-04-01T09:30:00Z',
  updated_at: '2026-04-01T09:31:00Z',
}

export const chatMessagesFixture: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Model answer seed message',
    created_at: '2026-04-02T10:05:00Z',
  },
  {
    id: 2,
    role: 'user',
    content: 'Can you explain cache revalidation?',
    created_at: '2026-04-02T10:06:00Z',
  },
  {
    id: 3,
    role: 'assistant',
    content: 'Sure. Use ETag and If-None-Match to avoid sending full payloads.',
    created_at: '2026-04-02T10:06:10Z',
  },
]
