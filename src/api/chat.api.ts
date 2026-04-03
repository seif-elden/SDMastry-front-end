import client from '@/api/client'
import type { ChatSessionResponse, SendMessageResponse } from '@/types'

export const chatApi = {
  getChatSession: async (attemptId: number): Promise<ChatSessionResponse> => {
    const data = await client.get<unknown, ChatSessionResponse>(`/attempts/${attemptId}/chat`)
    return data
  },

  sendMessage: async (attemptId: number, message: string): Promise<SendMessageResponse> => {
    const data = await client.post<unknown, SendMessageResponse>(`/attempts/${attemptId}/chat`, {
      message,
    })
    return data
  },
}
