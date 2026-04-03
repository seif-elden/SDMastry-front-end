import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { attemptsApi } from '@/api/attempts.api'
import AttemptSelector from '@/components/chat/AttemptSelector'
import ChatInput from '@/components/chat/ChatInput'
import MessageList from '@/components/chat/MessageList'
import { useChatSession } from '@/hooks/useChatSession'
import { useSendMessage } from '@/hooks/useSendMessage'
import { topicsApi } from '@/api/topics.api'

export default function ChatPage() {
  const navigate = useNavigate()
  const { slug = '', attemptId = '' } = useParams()
  const initialAttemptId = Number(attemptId)
  const [selectedAttemptId, setSelectedAttemptId] = useState<number>(initialAttemptId)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem(`chat-context-banner-${slug}`) === 'dismissed'
  })

  const { data: topic } = useQuery({
    queryKey: ['topic', slug],
    queryFn: () => topicsApi.getTopic(slug),
    enabled: Boolean(slug),
  })

  const { data: attempts = [] } = useQuery({
    queryKey: ['topic-attempts', slug],
    queryFn: () => attemptsApi.getTopicAttempts(slug),
    enabled: Boolean(slug),
  })

  const { data: chatSession, isLoading } = useChatSession(Number.isFinite(selectedAttemptId) ? selectedAttemptId : null)
  const sendMessageMutation = useSendMessage(Number.isFinite(selectedAttemptId) ? selectedAttemptId : null, {
    onError: () => {
      setErrorToast('Could not send message. Please try again.')
    },
  })

  const topicTitle = topic?.title ?? slug

  const selectedAttempt = useMemo(
    () => attempts.find((item) => item.id === selectedAttemptId),
    [attempts, selectedAttemptId],
  )

  if (!Number.isFinite(initialAttemptId)) {
    return (
      <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        <p>Invalid attempt id.</p>
      </section>
    )
  }

  return (
    <section className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80">
      <header className="border-b border-zinc-800 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-zinc-100">{topicTitle}</h1>
          <Link
            to={`/topics/${slug}/attempts/${selectedAttemptId}`}
            className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
          >
            ← Back to Results
          </Link>
        </div>
      </header>

      {!isBannerDismissed ? (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
          <p>🎯 You're chatting about: {topicTitle}. I'm here to help you understand this topic.</p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(`chat-context-banner-${slug}`, 'dismissed')
              setIsBannerDismissed(true)
            }}
            className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:border-zinc-500"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="border-b border-zinc-800 px-4 py-3">
        <AttemptSelector
          attempts={attempts}
          selectedAttemptId={selectedAttemptId}
          onSelectAttempt={(nextAttemptId) => {
            setSelectedAttemptId(nextAttemptId)
            navigate(`/topics/${slug}/attempts/${nextAttemptId}/chat`, { replace: true })
          }}
        />
      </div>

      {errorToast ? (
        <div className="mx-4 mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{errorToast}</div>
      ) : null}

      <main className="min-h-0 flex-1 px-4 py-3">
        {isLoading ? (
          <div className="h-full animate-pulse rounded-xl bg-zinc-800/70" />
        ) : (
          <MessageList messages={chatSession?.messages ?? []} topicTitle={topicTitle} />
        )}
      </main>

      <ChatInput
        isSending={sendMessageMutation.isPending}
        onSend={async (message) => {
          setErrorToast(null)
          await sendMessageMutation.mutateAsync(message)
        }}
      />

      {selectedAttempt ? (
        <footer className="border-t border-zinc-800 px-4 py-2 text-xs text-zinc-400">
          Current Attempt: {selectedAttempt.id} ({selectedAttempt.score ?? '--'} pts)
        </footer>
      ) : null}
    </section>
  )
}
