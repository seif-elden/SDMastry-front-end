import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { topicsApi } from '@/api/topics.api'
import useAuthStore from '@/store/useAuthStore'

export default function TopicDetailPage() {
  const navigate = useNavigate()
  const { slug = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const isVerified = Boolean(user?.email_verified_at)
  const [showAnswerForm, setShowAnswerForm] = useState(false)

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
          {topic.attempts.length === 0 ? (
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              onClick={() => setShowAnswerForm(true)}
              disabled={!isVerified}
            >
              Take the Challenge
            </button>
          ) : (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-100">Past Attempts</h3>
              {topic.attempts.map((attempt) => (
                <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm">
                  <div className="space-x-3 text-zinc-300">
                    <span>Score: {attempt.score}/100</span>
                    <span>{attempt.passed ? 'Passed' : 'Needs improvement'}</span>
                    <span>{new Date(attempt.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link className="text-indigo-300 hover:text-indigo-200" to={`/topics/${slug}?attempt=${attempt.id}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}

          {isVerified ? (
            <button
              type="button"
              className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-indigo-400 hover:text-indigo-200"
              onClick={() => setShowAnswerForm(true)}
            >
              Start New Attempt
            </button>
          ) : null}

          {showAnswerForm && isVerified ? (
            <form className="mt-4 space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
              <label className="block text-sm text-zinc-200" htmlFor="answer">
                Your answer
                <textarea
                  id="answer"
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Explain your approach here..."
                />
              </label>
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                Submit answer
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </section>
  )
}
