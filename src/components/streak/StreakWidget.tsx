import { STREAK_WIDGET_DAYS } from '@/config/constants'

interface StreakDay {
  date: string
  active: boolean
}

interface StreakWidgetProps {
  currentStreak: number
  last7Days: StreakDay[]
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function StreakWidget({ currentStreak, last7Days }: StreakWidgetProps) {
  const normalizedDays = Array.from({ length: STREAK_WIDGET_DAYS }).map((_, index) => {
    return last7Days[index] ?? { date: '', active: false }
  })

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
      <p className="text-sm font-semibold text-zinc-100">🔥 {currentStreak} day streak</p>
      <div className="mt-2 flex items-center gap-1 text-sm text-zinc-300" aria-label="Last 7 days activity">
        {normalizedDays.map((day, index) => (
          <span
            key={`${day.date || 'empty'}-${index}`}
            title={day.date ? formatShortDate(day.date) : 'No data'}
            className={day.active ? 'text-emerald-400' : 'text-zinc-500'}
            data-testid="streak-day-dot"
          >
            {day.active ? '●' : '○'}
          </span>
        ))}
      </div>
    </section>
  )
}
