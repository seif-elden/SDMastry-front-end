import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { attemptsApi } from '@/api/attempts.api'
import EvaluationResult from '@/components/attempt/EvaluationResult'

export default function AttemptPage() {
  const navigate = useNavigate()
  const { slug = '', attemptId = '' } = useParams()
  const parsedAttemptId = Number(attemptId)

  const { data: attempt, isLoading, isError } = useQuery({
    queryKey: ['attempt', parsedAttemptId],
    queryFn: () => attemptsApi.getAttempt(parsedAttemptId),
    enabled: Number.isFinite(parsedAttemptId),
  })

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-zinc-800/70" />
  }

  if (isError || !attempt) {
    return (
      <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        <p>Unable to load attempt details.</p>
        <button
          type="button"
          className="mt-4 rounded-lg border border-red-400/40 px-4 py-2 text-sm hover:bg-red-500/10"
          onClick={() => navigate(`/topics/${slug}`)}
        >
          Back to topic
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
        onClick={() => navigate(`/topics/${slug}`)}
      >
        Back to topic
      </button>
      <EvaluationResult attempt={attempt} topicSlug={slug} />
    </section>
  )
}
