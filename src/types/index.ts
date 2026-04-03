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

export interface AttemptEvaluation {
  strengths: string[]
  weaknesses: string[]
  concepts_to_study: string[]
  model_answer: string
  sources: string[]
  next_topic?: {
    slug: string
    title: string
  } | null
}

export interface SubmitAttemptResponse {
  attempt_id: number
  status: 'pending' | 'processing' | 'complete' | 'failed'
}

export interface AttemptStatusResponse {
  attempt_id: number
  status: 'pending' | 'processing' | 'complete' | 'failed'
  score: number | null
  passed: boolean | null
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
  topic_slug: string
  answer: string
  score: number | null
  passed: boolean | null
  status: 'pending' | 'processing' | 'complete' | 'failed'
  feedback: string | null
  evaluation: AttemptEvaluation | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface ChatSessionResponse {
  session_id: number
  messages: ChatMessage[]
}

export interface SendMessageResponse {
  message: ChatMessage
}

export interface ProviderKeyStatus {
  provider: 'openai' | 'gemini' | 'grok'
  is_set: boolean
  last4?: string | null
}

export interface AgentSettingsResponse {
  selected_agent: 'ollama' | 'openai' | 'gemini' | 'grok'
  api_keys: ProviderKeyStatus[]
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

export type BadgeGroup = 'progress' | 'scores' | 'streaks' | 'engagement' | 'speed'

export interface UserBadgeStatus {
  id: number
  slug: string
  name: string
  description: string
  icon: string
  group: BadgeGroup
  earned: boolean
  earned_at: string | null
  hint?: string | null
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
  overview: {
    topics_mastered: number
    total_topics: number
    current_streak: number
    longest_streak: number
    average_score: number
  }
  category_heatmap: Array<{
    category: string
    completed_topics: number
    total_topics: number
    completion_percentage: number
  }>
  score_timeline: Array<{
    topic_slug: string
    topic_title: string
    attempted_at: string
    score: number
  }>
  activity_calendar: Array<{
    date: string
    activity_count: number
  }>
  weak_areas: Array<{
    topic_slug: string
    topic_title: string
    category: string
    best_score: number
    attempts_count: number
  }>
  time_spent: Array<{
    topic_slug: string
    topic_title: string
    average_minutes: number
  }>
  streak: {
    current: number
    longest: number
    last_7_days: Array<{
      date: string
      active: boolean
    }>
  }
}

export interface FieldErrors {
  [key: string]: string[]
}

export interface ApiError {
  message: string
  errors?: FieldErrors
}
