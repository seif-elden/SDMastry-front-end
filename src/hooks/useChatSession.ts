import { useQuery } from '@tanstack/react-query'
import { chatApi } from '@/api/chat.api'

export function useChatSession(attemptId: number | null) {
  return useQuery({
    queryKey: ['chat-session', attemptId],
    queryFn: () => chatApi.getChatSession(attemptId as number),
    enabled: attemptId !== null,
  })
}
