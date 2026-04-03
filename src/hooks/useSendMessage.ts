import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '@/api/chat.api'
import type { ApiError, ChatMessage, ChatSessionResponse } from '@/types'

interface UseSendMessageOptions {
  onError?: (error: ApiError) => void
}

export function useSendMessage(attemptId: number | null, options?: UseSendMessageOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: string) => {
      if (attemptId === null) {
        throw new Error('No attempt selected')
      }

      return chatApi.sendMessage(attemptId, message)
    },
    onMutate: async (message) => {
      if (attemptId === null) {
        return { previousSession: undefined as ChatSessionResponse | undefined }
      }

      await queryClient.cancelQueries({ queryKey: ['chat-session', attemptId] })

      const previousSession = queryClient.getQueryData<ChatSessionResponse>(['chat-session', attemptId])
      const optimisticUserMessage: ChatMessage = {
        id: -Date.now(),
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      }
      const typingMessage: ChatMessage = {
        id: -(Date.now() + 1),
        role: 'assistant',
        content: '__typing__',
        created_at: new Date().toISOString(),
      }

      const baseSession: ChatSessionResponse = previousSession ?? {
        session_id: attemptId,
        messages: [],
      }

      queryClient.setQueryData<ChatSessionResponse>(['chat-session', attemptId], {
        ...baseSession,
        messages: [...baseSession.messages, optimisticUserMessage, typingMessage],
      })

      return { previousSession, typingMessageId: typingMessage.id }
    },
    onSuccess: (data, _message, context) => {
      if (attemptId === null) {
        return
      }

      queryClient.setQueryData<ChatSessionResponse>(['chat-session', attemptId], (existing) => {
        if (!existing) {
          return {
            session_id: attemptId,
            messages: [data.message],
          }
        }

        return {
          ...existing,
          messages: existing.messages
            .filter((msg) => msg.id !== context?.typingMessageId)
            .concat(data.message),
        }
      })
    },
    onError: (error, _message, context) => {
      if (attemptId !== null && context?.previousSession) {
        queryClient.setQueryData(['chat-session', attemptId], context.previousSession)
      }

      options?.onError?.(error as ApiError)
    },
  })
}
