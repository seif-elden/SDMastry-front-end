import client from '@/api/client'
import type { AgentSettingsResponse, ProviderKeyStatus } from '@/types'

export const settingsApi = {
  getAgentSettings: async (): Promise<AgentSettingsResponse> => {
    const data = await client.get<unknown, AgentSettingsResponse>('/settings/agent')
    return data
  },

  updateSelectedAgent: async (agent: AgentSettingsResponse['selected_agent']): Promise<void> => {
    await client.put('/settings/agent', { selected_agent: agent })
  },

  updateApiKey: async (provider: ProviderKeyStatus['provider'], api_key: string): Promise<void> => {
    await client.put(`/settings/api-keys/${provider}`, { api_key })
  },

  deleteApiKey: async (provider: ProviderKeyStatus['provider']): Promise<void> => {
    await client.delete(`/settings/api-keys/${provider}`)
  },
}
