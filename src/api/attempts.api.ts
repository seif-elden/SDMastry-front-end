import client from '@/api/client'
import type {
  AttemptStatusResponse,
  SubmitAttemptResponse,
  TopicAttempt,
} from '@/types'

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
    const data = await client.get<unknown, TopicAttempt[]>(`/topics/${topicSlug}/attempts`)
    return data
  },
}
