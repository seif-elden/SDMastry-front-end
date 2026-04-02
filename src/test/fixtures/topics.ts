import type { TopicDetail, TopicWithProgress } from '@/types'

export const topicFixtures: TopicWithProgress[] = [
  {
    id: 1,
    slug: 'http-caching-basics',
    title: 'HTTP Caching Basics',
    description: 'Understand cache headers and freshness strategies.',
    category: 'Caching',
    level: 'beginner',
    group: 'core',
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
    group: 'core',
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
    group: 'advanced',
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
