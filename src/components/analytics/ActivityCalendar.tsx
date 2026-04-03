import { ACTIVITY_CALENDAR_DAYS } from '@/config/constants'

export interface ActivityDay {
  date: string
  activity_count: number
}

interface ActivityCalendarProps {
  days: ActivityDay[]
}

function getIntensityClass(activityCount: number) {
  if (activityCount <= 0) {
    return 'bg-zinc-800'
  }

  if (activityCount === 1) {
    return 'bg-emerald-500/50'
  }

  return 'bg-emerald-500'
}

function chunkByWeek(days: ActivityDay[]) {
  const weeks: ActivityDay[][] = []

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7))
  }

  return weeks
}

export default function ActivityCalendar({ days }: ActivityCalendarProps) {
  const normalizedDays = Array.from({ length: ACTIVITY_CALENDAR_DAYS }).map((_, index) => {
    return days[index] ?? { date: '', activity_count: 0 }
  })

  const weeks = chunkByWeek(normalizedDays)

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Activity Calendar</h2>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${day.date || 'empty'}-${dayIndex}`}
                  className={`h-3 w-3 rounded-sm ${getIntensityClass(day.activity_count)}`}
                  title={`${day.activity_count} attempts on ${day.date || 'unknown date'}`}
                  data-testid="activity-cell"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
