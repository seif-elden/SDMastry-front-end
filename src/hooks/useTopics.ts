import { useQuery } from '@tanstack/react-query'
import { topicsApi } from '@/api/topics.api'
import { TOPICS_QUERY_STALE_TIME_MS } from '@/config/constants'

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getTopics,
    staleTime: TOPICS_QUERY_STALE_TIME_MS,
  })
}
