import { useNavigate } from 'react-router-dom'
import { getCategoryColors } from '@/config/categoryColors'
import type { TopicWithProgress } from '@/types'

interface TopicCardProps {
  topic: TopicWithProgress
  isVerified: boolean
}

function getLevelLabel(level: TopicWithProgress['level']) {
  if (level === 'beginner') {
    return 'Beginner'
  }

  if (level === 'intermediate') {
    return 'Intermediate'
  }

  return 'Advanced'
}

export default function TopicCard({ topic, isVerified }: TopicCardProps) {
  const navigate = useNavigate()
  const categoryColors = getCategoryColors(topic.category)

  const isAttempted = topic.attempts_count > 0
  const isPassed = topic.passed

  const stateClassName = isPassed
    ? 'border-emerald-500/40 bg-emerald-500/5'
    : isAttempted
      ? 'border-amber-500/40 bg-amber-500/5'
      : 'border-zinc-700 bg-zinc-900/70'

  const handleClick = () => {
    if (!isVerified) {
      return
    }

    navigate(`/topics/${topic.slug}`)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleClick()
        }
      }}
      title={!isVerified ? 'Verify email first' : undefined}
      className={`relative rounded-xl border p-4 transition ${stateClassName} ${
        isVerified ? 'cursor-pointer hover:border-indigo-400/60 hover:bg-zinc-900' : 'cursor-not-allowed opacity-60'
      }`}
    >
      {!isVerified ? (
        <span className="absolute right-3 top-3 rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">LOCKED</span>
      ) : null}

      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${categoryColors.chipClassName}`}>{topic.category}</span>
        <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300">{getLevelLabel(topic.level)}</span>
      </div>

      <h3 className="text-lg font-semibold text-zinc-100">{topic.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{topic.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
        {isPassed ? <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">Passed</span> : null}
        {isAttempted && topic.best_score !== null ? (
          <span className={`rounded-full px-2 py-1 ${isPassed ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'}`}>
            Highest: {topic.best_score}/100
          </span>
        ) : null}
        <span className="rounded-full bg-zinc-800 px-2 py-1">{topic.attempts_count} attempts</span>
      </div>

      <div className="mt-4">
        {isVerified ? (
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            onClick={(event) => {
              event.stopPropagation()
              handleClick()
            }}
          >
            {isPassed ? 'Review' : isAttempted ? 'Retry' : 'Start Topic'}
          </button>
        ) : null}
      </div>
    </article>
  )
}
