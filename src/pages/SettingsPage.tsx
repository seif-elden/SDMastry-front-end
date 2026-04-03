import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { settingsApi } from '@/api/settings.api'
import AgentCard from '@/components/settings/AgentCard'
import { AGENT_OPTIONS, PAID_PROVIDERS } from '@/config/agents'
import useAuthStore from '@/store/useAuthStore'
import type { AgentSettingsResponse, ProviderKeyStatus } from '@/types'

function getProviderLabel(provider: ProviderKeyStatus['provider']) {
  if (provider === 'openai') {
    return 'OpenAI API Key'
  }

  if (provider === 'gemini') {
    return 'Gemini API Key'
  }

  return 'Grok API Key'
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [toast, setToast] = useState<string | null>(null)
  const [inputs, setInputs] = useState<Record<ProviderKeyStatus['provider'], string>>({
    openai: '',
    gemini: '',
    grok: '',
  })

  const { data } = useQuery({
    queryKey: ['agent-settings'],
    queryFn: settingsApi.getAgentSettings,
  })

  const keyStatusMap = useMemo(() => {
    const entries = (data?.api_keys ?? []).map((item) => [item.provider, item])
    return Object.fromEntries(entries) as Record<ProviderKeyStatus['provider'], ProviderKeyStatus>
  }, [data])

  const selectedAgentMutation = useMutation({
    mutationFn: settingsApi.updateSelectedAgent,
    onMutate: async (nextAgent) => {
      await queryClient.cancelQueries({ queryKey: ['agent-settings'] })
      const previous = queryClient.getQueryData<AgentSettingsResponse>(['agent-settings'])

      if (previous) {
        queryClient.setQueryData<AgentSettingsResponse>(['agent-settings'], {
          ...previous,
          selected_agent: nextAgent,
        })
      }

      return { previous }
    },
    onError: (_error, _nextAgent, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['agent-settings'], context.previous)
      }
      setToast('Could not update selected agent.')
    },
  })

  const saveKeyMutation = useMutation({
    mutationFn: ({ provider, apiKey }: { provider: ProviderKeyStatus['provider']; apiKey: string }) =>
      settingsApi.updateApiKey(provider, apiKey),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<AgentSettingsResponse | undefined>(['agent-settings'], (current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          api_keys: current.api_keys.map((item) =>
            item.provider === variables.provider
              ? {
                  ...item,
                  is_set: true,
                  last4: variables.apiKey.slice(-4),
                }
              : item,
          ),
        }
      })

      setInputs((prev) => ({ ...prev, [variables.provider]: '' }))
      setToast('API key saved successfully.')
    },
  })

  const deleteKeyMutation = useMutation({
    mutationFn: (provider: ProviderKeyStatus['provider']) => settingsApi.deleteApiKey(provider),
    onSuccess: (_data, provider) => {
      queryClient.setQueryData<AgentSettingsResponse | undefined>(['agent-settings'], (current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          api_keys: current.api_keys.map((item) =>
            item.provider === provider
              ? {
                  ...item,
                  is_set: false,
                  last4: null,
                }
              : item,
          ),
        }
      })
      setToast('API key removed.')
    },
  })

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h1 className="text-2xl font-semibold text-zinc-50">Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your AI agent and provider keys.</p>
      </header>

      {toast ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{toast}</p> : null}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Agent Selection</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {AGENT_OPTIONS.map((option) => {
            const providerState = keyStatusMap[option.provider as ProviderKeyStatus['provider']]
            const hasKey = option.requiresKey ? Boolean(providerState?.is_set) : true

            return (
              <AgentCard
                key={option.id}
                option={option}
                isSelected={data?.selected_agent === option.id}
                hasRequiredKey={hasKey}
                onSelect={(agentId) => {
                  void selectedAgentMutation.mutate(agentId)
                }}
              />
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">API Keys</h2>
        <div className="mt-4 space-y-4">
          {PAID_PROVIDERS.map((provider) => {
            const providerState = keyStatusMap[provider]
            const isSet = Boolean(providerState?.is_set)
            const last4 = providerState?.last4 ?? '••••'

            return (
              <article key={provider} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-100">{getProviderLabel(provider)}</p>
                  <p className={`text-xs ${isSet ? 'text-emerald-300' : 'text-zinc-400'}`}>
                    {isSet ? '✓ Key saved' : 'No key saved'}
                  </p>
                </div>

                {isSet ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-zinc-300">••••••••••••{last4}</p>
                    <button
                      type="button"
                      className="rounded-md border border-red-400/40 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/10"
                      onClick={() => {
                        const confirmed = window.confirm('Remove this API key?')

                        if (!confirmed) {
                          return
                        }

                        void deleteKeyMutation.mutate(provider)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={inputs[provider]}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          [provider]: event.target.value,
                        }))
                      }
                      className="w-full flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={inputs[provider].trim().length === 0}
                      onClick={() => {
                        void saveKeyMutation.mutate({
                          provider,
                          apiKey: inputs[provider].trim(),
                        })
                      }}
                    >
                      Save Key
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Profile</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>
            <p className="mt-1 text-sm text-zinc-200">{user?.name ?? 'Unknown user'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Email</p>
            <p className="mt-1 text-sm text-zinc-200">{user?.email ?? 'Unknown email'}</p>
          </div>
        </div>
        <Link className="mt-4 inline-block text-sm font-medium text-indigo-300 hover:text-indigo-200" to="/forgot-password">
          Change Password
        </Link>
      </section>
    </section>
  )
}
