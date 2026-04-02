import client from '@/api/client'
import type { TopicDetail, TopicWithProgress } from '@/types'

export const topicsApi = {
  getTopics: async (): Promise<TopicWithProgress[]> => {
    const data = await client.get<unknown, TopicWithProgress[]>('/topics')
    return data
  },

  getTopic: async (slug: string): Promise<TopicDetail> => {
    const data = await client.get<unknown, TopicDetail>(`/topics/${slug}`)
    return data
  },
}
