import client from '@/api/client'
import type {
  AttemptStatusResponse,
  SubmitAttemptResponse,
  TopicAttempt,
} from '@/types'

interface TopicAttemptsEnvelope {
  attempts?: TopicAttempt[] | { data?: TopicAttempt[] }
}

function normalizeTopicAttempts(payload: unknown): TopicAttempt[] {
  if (Array.isArray(payload)) {
    return payload as TopicAttempt[]
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const envelope = payload as TopicAttemptsEnvelope
  const attempts = envelope.attempts

  if (Array.isArray(attempts)) {
    return attempts
  }

  if (attempts && typeof attempts === 'object' && Array.isArray(attempts.data)) {
    return attempts.data
  }

  return []
}

export const attemptsApi = {
  submitAttempt: async (topicSlug: string, answer: string): Promise<SubmitAttemptResponse> => {
    const data = await client.post<unknown, SubmitAttemptResponse>(`/topics/${topicSlug}/attempts`, {
      answer,
    })
    return data
  },

  getAttemptStatus: async (attemptId: number): Promise<AttemptStatusResponse> => {
    const data = await client.get<unknown, AttemptStatusResponse>(`/attempts/${attemptId}/status`)
    return data
  },

  getAttempt: async (attemptId: number): Promise<TopicAttempt> => {
    const data = await client.get<unknown, TopicAttempt>(`/attempts/${attemptId}`)
    return data
  },

  getTopicAttempts: async (topicSlug: string): Promise<TopicAttempt[]> => {
    const data = await client.get<unknown, unknown>(`/topics/${topicSlug}/attempts`)
    return normalizeTopicAttempts(data)
  },
}
