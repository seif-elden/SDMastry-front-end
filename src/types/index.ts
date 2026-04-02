export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  selected_agent: string | null
  current_streak: number
}

export interface Topic {
  id: number
  slug: string
  title: string
  description: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  group: 'core' | 'advanced'
}

export interface TopicWithProgress extends Topic {
  best_score: number | null
  attempts_count: number
  passed: boolean
  passed_at: string | null
}

export interface TopicAttemptSummary {
  id: number
  score: number
  passed: boolean
  created_at: string
}

export interface TopicDetail extends TopicWithProgress {
  key_points: string[]
  hook_question: string
  attempts: TopicAttemptSummary[]
}

export interface TopicAttempt {
  id: number
  topic_id: number
  user_id: number
  answer: string
  score: number
  feedback: string
  created_at: string
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ChatSession {
  id: number
  topic_id: number
  user_id: number
  title: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface Badge {
  id: number
  slug: string
  name: string
  description: string
  icon: string
}

export interface UserBadge {
  id: number
  user_id: number
  badge: Badge
  awarded_at: string
}

export interface Progress {
  total_topics: number
  completed_topics: number
  completion_percentage: number
}

export interface AnalyticsData {
  progress: Progress
  attempts_count: number
  average_score: number
  streak: number
  topic_breakdown: Array<{
    topic_slug: string
    score: number
    attempts: number
  }>
}

export interface FieldErrors {
  [key: string]: string[]
}

export interface ApiError {
  message: string
  errors?: FieldErrors
}
