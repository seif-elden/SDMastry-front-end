import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { attemptsApi } from '@/api/attempts.api'
import { chatApi } from '@/api/chat.api'
import EvaluationResult from '@/components/attempt/EvaluationResult'
import type { TopicAttemptSummary } from '@/types'

interface AttemptHistoryProps {
  topicSlug: string
  attempts: TopicAttemptSummary[]
  expandedAttemptId?: number | null
  onExpandedAttemptIdChange?: (attemptId: number | null) => void
}

export default function AttemptHistory({
  topicSlug,
  attempts,
  expandedAttemptId: controlledExpandedAttemptId,
  onExpandedAttemptIdChange,
}: AttemptHistoryProps) {
  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(null)

  useEffect(() => {
    if (controlledExpandedAttemptId === undefined) {
      return
    }

    setExpandedAttemptId(controlledExpandedAttemptId)
  }, [controlledExpandedAttemptId])

  const { data: expandedAttempt, isLoading } = useQuery({
    queryKey: ['attempt', expandedAttemptId],
    queryFn: () => attemptsApi.getAttempt(expandedAttemptId as number),
    enabled: expandedAttemptId !== null,
  })

  const { data: expandedChatSession, isLoading: isChatLoading } = useQuery({
    queryKey: ['attempt-chat', expandedAttemptId],
    queryFn: () => chatApi.getChatSession(expandedAttemptId as number),
    enabled: expandedAttemptId !== null,
  })

  const resolveAttemptId = (attempt: TopicAttemptSummary): number | null => {
    if (typeof attempt.id === 'number') {
      return attempt.id
    }

    if (typeof attempt.attempt_id === 'number') {
      return attempt.attempt_id
    }

    return null
  }

  const getAttemptOutcome = (attempt: TopicAttemptSummary): string => {
    if (typeof attempt.passed === 'boolean') {
      return attempt.passed ? 'Passed' : 'Failed'
    }

    if (attempt.status === 'complete') {
      return 'Completed'
    }

    if (attempt.status === 'failed') {
      return 'Failed'
    }

    if (attempt.status === 'pending' || attempt.status === 'processing') {
      return 'In Progress'
    }

    return 'Unknown'
  }

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-100">Attempt History</h3>
      {attempts.map((attempt) => {
        const attemptId = resolveAttemptId(attempt)

        return (
        <article key={attemptId ?? attempt.created_at} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-x-3 text-sm text-zinc-300">
              <span>Score: {attempt.score ?? '--'}/100</span>
              <span>{getAttemptOutcome(attempt)}</span>
              <span>{new Date(attempt.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              {attemptId !== null ? (
                <Link
                  to={`/topics/${topicSlug}/attempts/${attemptId}/chat`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-indigo-400"
                >
                  Open Full Chat
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (attemptId === null) {
                    return
                  }

                  setExpandedAttemptId((current) => {
                    const next = current === attemptId ? null : attemptId
                    onExpandedAttemptIdChange?.(next)
                    return next
                  })
                }}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-indigo-400"
              >
                {expandedAttemptId === attemptId ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          </div>

          {expandedAttemptId === attemptId ? (
            <div className="mt-4 space-y-4">
              {isLoading || !expandedAttempt ? (
                <div className="h-32 animate-pulse rounded-lg bg-zinc-800/70" />
              ) : (
                <>
                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <h4 className="text-sm font-semibold text-zinc-100">Your Submitted Answer</h4>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                      {expandedAttempt.answer?.trim() ? expandedAttempt.answer : 'No submitted answer recorded for this attempt.'}
                    </p>
                  </section>

                  <EvaluationResult attempt={expandedAttempt} topicSlug={topicSlug} />
                </>
              )}

              <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <h4 className="text-sm font-semibold text-zinc-100">Chat History</h4>

                {isChatLoading ? <div className="mt-3 h-24 animate-pulse rounded-lg bg-zinc-800/70" /> : null}

                {!isChatLoading && (expandedChatSession?.messages?.length ?? 0) === 0 ? (
                  <p className="mt-3 text-sm text-zinc-400">No chat messages for this attempt yet.</p>
                ) : null}

                {!isChatLoading && (expandedChatSession?.messages?.length ?? 0) > 0 ? (
                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {expandedChatSession?.messages.map((message) => {
                      const isUser = message.role === 'user'

                      return (
                        <article key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                              isUser ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-100'
                            }`}
                          >
                            <p className={`mb-1 text-xs ${isUser ? 'text-indigo-200' : 'text-zinc-400'}`}>
                              {isUser ? 'You' : 'Assistant'}
                            </p>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}
        </article>
      )})}
    </section>
  )
}
