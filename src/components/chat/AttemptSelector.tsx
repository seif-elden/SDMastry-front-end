import type { TopicAttempt } from '@/types'

interface AttemptSelectorProps {
  attempts: TopicAttempt[]
  selectedAttemptId: number
  onSelectAttempt: (attemptId: number) => void
}

export default function AttemptSelector({ attempts, selectedAttemptId, onSelectAttempt }: AttemptSelectorProps) {
  if (attempts.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {attempts.map((attempt, index) => (
        <button
          key={attempt.id}
          type="button"
          onClick={() => onSelectAttempt(attempt.id)}
          className={`rounded-lg border px-3 py-2 text-sm transition ${
            selectedAttemptId === attempt.id
              ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100'
              : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
          }`}
        >
          Attempt {index + 1} - {attempt.score ?? '--'}pts {attempt.passed ? '✓' : ''}
        </button>
      ))}
    </div>
  )
}
