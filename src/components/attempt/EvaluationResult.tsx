import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TopicAttempt } from '@/types'

interface EvaluationResultProps {
  attempt: TopicAttempt
  topicSlug: string
}

export default function EvaluationResult({ attempt, topicSlug }: EvaluationResultProps) {
  const navigate = useNavigate()
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  const score = attempt.score ?? 0
  const scoreTone = useMemo(() => {
    if (score >= 80) {
      return {
        ring: 'ring-emerald-400/40',
        text: 'text-emerald-300',
        subtitle: 'Passed ✓',
      }
    }

    if (score >= 60) {
      return {
        ring: 'ring-amber-400/40',
        text: 'text-amber-300',
        subtitle: 'Not yet - keep going',
      }
    }

    return {
      ring: 'ring-red-400/40',
      text: 'text-red-300',
      subtitle: 'Not yet - keep going',
    }
  }, [score])

  const evaluation = attempt.evaluation
  const strengths = Array.isArray(evaluation?.strengths)
    ? evaluation.strengths
    : Array.isArray(evaluation?.key_strengths)
      ? evaluation.key_strengths
      : []
  const weaknesses = Array.isArray(evaluation?.weaknesses)
    ? evaluation.weaknesses
    : Array.isArray(evaluation?.key_weaknesses)
      ? evaluation.key_weaknesses
      : []
  const concepts = evaluation?.concepts_to_study ?? []
  const modelAnswer = evaluation?.model_answer ?? 'No model answer available yet.'
  const sources = evaluation?.sources ?? []

  return (
    <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full ring-4 ${scoreTone.ring}`}>
          <span className={`text-2xl font-bold ${scoreTone.text}`}>{score}</span>
        </div>
        <p className="text-sm text-zinc-300">Score / 100</p>
        <p className={`text-sm font-semibold ${scoreTone.text}`}>{scoreTone.subtitle}</p>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <h3 className="text-sm font-semibold text-emerald-200">Key Strengths</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-100/90">
          {strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <h3 className="text-sm font-semibold text-amber-200">Key Weaknesses</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100/90">
          {weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
        <h3 className="text-sm font-semibold text-zinc-100">Concepts to Study</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {concepts.map((concept) => (
            <span key={concept} className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
        <button
          type="button"
          onClick={() => setShowModelAnswer((value) => !value)}
          className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          {showModelAnswer ? 'Hide Model Answer' : 'Show Model Answer'}
        </button>

        {showModelAnswer ? (
          <div className="mt-3 space-y-3">
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">{modelAnswer}</p>
            {sources.length > 0 ? <p className="text-xs text-zinc-400">Sources: {sources.join(' · ')}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate(`/topics/${topicSlug}/attempts/${attempt.id}/chat?prefill=${encodeURIComponent('Ask me to explain where my answer was weak.')}`)}
          className="rounded-xl border border-zinc-700 bg-zinc-950/80 p-4 text-left text-sm text-zinc-200 hover:border-indigo-400"
        >
          💬 Ask me to explain...
        </button>
        <button
          type="button"
          onClick={() => {
            if (evaluation?.next_topic?.slug) {
              navigate(`/topics/${evaluation.next_topic.slug}`)
            }
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950/80 p-4 text-left text-sm text-zinc-200 hover:border-indigo-400"
        >
          ➡️ Next topic: {evaluation?.next_topic?.title ?? 'Keep practicing this topic'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/topics/${topicSlug}/attempts/${attempt.id}/chat`)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Start Chat About This Topic
      </button>
    </section>
  )
}
