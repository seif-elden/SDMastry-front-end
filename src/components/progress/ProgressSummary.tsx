import {
  ROADMAP_ADVANCED_TOPICS_TOTAL,
  ROADMAP_CORE_TOPICS_TOTAL,
  ROADMAP_TOTAL_TOPICS,
} from '@/config/constants'

interface ProgressSummaryProps {
  overallMastered: number
  coreMastered: number
  advancedMastered: number
  streakDays: number
}

export default function ProgressSummary({
  overallMastered,
  coreMastered,
  advancedMastered,
  streakDays,
}: ProgressSummaryProps) {
  const progress = Math.min((overallMastered / ROADMAP_TOTAL_TOPICS) * 100, 100)

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray={`${progress} ${100 - progress}`}
              strokeLinecap="round"
              pathLength="100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-zinc-100">
            {overallMastered}/{ROADMAP_TOTAL_TOPICS}
          </div>
        </div>

        <div className="grid flex-1 gap-2 text-sm text-zinc-300 md:grid-cols-3">
          <p>Core: {coreMastered}/{ROADMAP_CORE_TOPICS_TOTAL}</p>
          <p>Advanced: {advancedMastered}/{ROADMAP_ADVANCED_TOPICS_TOTAL}</p>
          <p>Streak: {streakDays} days</p>
        </div>
      </div>
    </section>
  )
}
