import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { attemptsApi } from '@/api/attempts.api'
import AnswerForm from '@/components/attempt/AnswerForm'
import AttemptHistory from '@/components/attempt/AttemptHistory'
import EvaluationPending from '@/components/attempt/EvaluationPending'
import EvaluationResult from '@/components/attempt/EvaluationResult'
import { topicsApi } from '@/api/topics.api'
import useAuthStore from '@/store/useAuthStore'
import type { AttemptStatusResponse, TopicAttempt } from '@/types'

type AttemptViewState = 'idle' | 'form' | 'pending' | 'result'

export default function TopicDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { slug = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const isVerified = Boolean(user?.email_verified_at)
  const [viewState, setViewState] = useState<AttemptViewState>('idle')
  const [activeAttemptId, setActiveAttemptId] = useState<number | null>(null)
  const [activeAttempt, setActiveAttempt] = useState<TopicAttempt | null>(null)

  const { data: topic, isLoading, isError } = useQuery({
    queryKey: ['topic', slug],
    queryFn: () => topicsApi.getTopic(slug),
    enabled: Boolean(slug),
  })

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-zinc-800/70" />
  }

  if (isError || !topic) {
    return (
      <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        <p>Unable to load topic details.</p>
        <button type="button" className="mt-4 text-sm underline" onClick={() => navigate('/roadmap')}>
          Back to roadmap
        </button>
      </section>
    )
  }

  const handleEvaluationComplete = async (status: AttemptStatusResponse) => {
    setActiveAttemptId(status.attempt_id)
    const attempt = await queryClient.fetchQuery({
      queryKey: ['attempt', status.attempt_id],
      queryFn: () => attemptsApi.getAttempt(status.attempt_id),
    })
    setActiveAttempt(attempt)
    setViewState('result')
  }

  const hasAttempts = topic.attempts.length > 0

  return (
    <section className="space-y-6">
      <button
        type="button"
        className="inline-flex items-center text-sm font-medium text-indigo-300 hover:text-indigo-200"
        onClick={() => navigate('/roadmap')}
      >
        Back to roadmap
      </button>

      <header className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">{topic.category}</span>
          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-zinc-300">{topic.level}</span>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-50">{topic.title}</h1>
        <p className="mt-3 text-zinc-300">{topic.description}</p>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Key Points</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          {topic.key_points.map((point, index) => (
            <li key={`${index}-${point}`}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
        <h2 className="text-lg font-semibold text-indigo-100">Hook Question</h2>
        <p className="mt-3 text-indigo-100/90">{topic.hook_question}</p>
      </section>

      <section className="relative rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
        {!isVerified ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-zinc-950/80 p-4 text-center text-sm text-zinc-200">
            Verify your email to unlock attempts.
          </div>
        ) : null}

        <div className={!isVerified ? 'opacity-40' : undefined}>
          {isVerified && viewState === 'idle' && !hasAttempts ? (
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              onClick={() => setViewState('form')}
            >
              Take the Challenge
            </button>
          ) : null}

          {viewState === 'idle' && hasAttempts ? <AttemptHistory topicSlug={slug} attempts={topic.attempts} /> : null}

          {viewState === 'form' && isVerified ? (
            <div className="transform-gpu transition-all duration-300 ease-out">
              <AnswerForm
                topicSlug={slug}
                hookQuestion={topic.hook_question}
                onSubmitted={(response) => {
                  setActiveAttemptId(response.attempt_id)
                  setViewState('pending')
                }}
              />
            </div>
          ) : null}

          {viewState === 'pending' && activeAttemptId !== null ? (
            <EvaluationPending
              attemptId={activeAttemptId}
              onComplete={(status) => {
                void handleEvaluationComplete(status)
              }}
              onTryAgain={() => {
                setViewState('form')
              }}
            />
          ) : null}

          {viewState === 'result' && activeAttempt ? <EvaluationResult attempt={activeAttempt} topicSlug={slug} /> : null}

          {isVerified ? (
            <button
              type="button"
              className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-indigo-400 hover:text-indigo-200"
              onClick={() => {
                setActiveAttempt(null)
                setViewState('form')
              }}
            >
              Start New Attempt
            </button>
          ) : null}
        </div>
      </section>
    </section>
  )
}
