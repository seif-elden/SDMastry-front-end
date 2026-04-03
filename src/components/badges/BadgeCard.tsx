import type { UserBadgeStatus } from '@/types'

interface BadgeCardProps {
  badge: UserBadgeStatus
}

function formatEarnedDate(date: string | null) {
  if (!date) {
    return null
  }

  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const earnedDate = formatEarnedDate(badge.earned_at)

  return (
    <article
      className={`relative rounded-xl border p-4 transition ${
        badge.earned
          ? 'border-emerald-500/40 bg-emerald-500/10 text-zinc-100'
          : 'border-zinc-700 bg-zinc-900/50 text-zinc-300 grayscale'
      }`}
      title={!badge.earned && badge.hint ? badge.hint : undefined}
      data-testid="badge-card"
    >
      {!badge.earned ? (
        <span className="absolute right-3 top-3 rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">🔒</span>
      ) : null}

      <div className="text-3xl" aria-hidden="true">
        {badge.icon}
      </div>
      <h3 className="mt-3 text-base font-semibold">{badge.name}</h3>
      <p className="mt-1 text-sm text-zinc-300">{badge.description}</p>

      {badge.earned && earnedDate ? (
        <p className="mt-3 text-xs font-medium text-emerald-300">Earned {earnedDate}</p>
      ) : null}
    </article>
  )
}
