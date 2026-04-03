import type { AgentSettingsResponse, ProviderKeyStatus } from '@/types'

export interface AgentOption {
  id: AgentSettingsResponse['selected_agent']
  provider: AgentSettingsResponse['selected_agent']
  name: string
  model: string
  icon: string
  requiresKey: boolean
}

export const AGENT_OPTIONS: AgentOption[] = [
  {
    id: 'ollama',
    provider: 'ollama',
    name: 'Ollama',
    model: 'Llama 3.1',
    icon: '🔥',
    requiresKey: false,
  },
  {
    id: 'openai',
    provider: 'openai',
    name: 'OpenAI',
    model: 'GPT-4o',
    icon: '⚡',
    requiresKey: true,
  },
  {
    id: 'gemini',
    provider: 'gemini',
    name: 'Gemini',
    model: 'Gemini 2.0',
    icon: '✨',
    requiresKey: true,
  },
  {
    id: 'grok',
    provider: 'grok',
    name: 'xAI',
    model: 'Grok 2',
    icon: '🚀',
    requiresKey: true,
  },
]

export const PAID_PROVIDERS: Array<ProviderKeyStatus['provider']> = ['openai', 'gemini', 'grok']

export function getAgentLabel(agent: AgentSettingsResponse['selected_agent'] | null | undefined): string {
  const found = AGENT_OPTIONS.find((option) => option.id === agent)

  if (!found) {
    return '🤖 Agent'
  }

  return `${found.icon} ${found.name}`
}
