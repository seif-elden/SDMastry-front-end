import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics.api'
import BadgeCard from '@/components/badges/BadgeCard'
import type { BadgeGroup } from '@/types'

const badgeGroups: Array<{ key: BadgeGroup; label: string }> = [
  { key: 'progress', label: 'Progress' },
  { key: 'scores', label: 'Scores' },
  { key: 'streaks', label: 'Streaks' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'speed', label: 'Speed' },
]

export default function BadgesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['badges'],
    queryFn: analyticsApi.getBadges,
  })

  const badges = data?.badges ?? []

  const earnedCount = useMemo(() => {
    return badges.filter((badge) => badge.earned).length
  }, [badges])

  const groupedBadges = useMemo(() => {
    return badgeGroups.map((group) => ({
      ...group,
      badges: badges.filter((badge) => badge.group === group.key),
    }))
  }, [badges])

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-zinc-800/60" />
  }

  if (isError) {
    return <section className="rounded-xl border border-red-600/40 bg-red-500/10 p-6 text-red-100">Failed to load badges.</section>
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100 md:text-3xl">Your Badges - {earnedCount}/{badges.length} earned</h1>
      </header>

      {groupedBadges.map((group) => (
        <section key={group.key} className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">{group.label}</h2>
          {group.badges.length === 0 ? (
            <p className="text-sm text-zinc-500">No badges in this group yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </section>
      ))}
    </section>
  )
}
