import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { attemptsApi } from '@/api/attempts.api'
import EvaluationResult from '@/components/attempt/EvaluationResult'
import type { TopicAttemptSummary } from '@/types'

interface AttemptHistoryProps {
  topicSlug: string
  attempts: TopicAttemptSummary[]
}

export default function AttemptHistory({ topicSlug, attempts }: AttemptHistoryProps) {
  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(null)

  const { data: expandedAttempt, isLoading } = useQuery({
    queryKey: ['attempt', expandedAttemptId],
    queryFn: () => attemptsApi.getAttempt(expandedAttemptId as number),
    enabled: expandedAttemptId !== null,
  })

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-100">Attempt History</h3>
      {attempts.map((attempt) => (
        <article key={attempt.id} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-x-3 text-sm text-zinc-300">
              <span>Score: {attempt.score}/100</span>
              <span>{attempt.passed ? 'Passed' : 'Failed'}</span>
              <span>{new Date(attempt.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/topics/${topicSlug}/attempts/${attempt.id}/chat`}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-indigo-400"
              >
                View Chat
              </Link>
              <button
                type="button"
                onClick={() => setExpandedAttemptId((current) => (current === attempt.id ? null : attempt.id))}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-indigo-400"
              >
                {expandedAttemptId === attempt.id ? 'Hide Evaluation' : 'View Evaluation'}
              </button>
            </div>
          </div>

          {expandedAttemptId === attempt.id ? (
            <div className="mt-4">
              {isLoading || !expandedAttempt ? (
                <div className="h-32 animate-pulse rounded-lg bg-zinc-800/70" />
              ) : (
                <EvaluationResult attempt={expandedAttempt} topicSlug={topicSlug} />
              )}
            </div>
          ) : null}
        </article>
      ))}
    </section>
  )
}
