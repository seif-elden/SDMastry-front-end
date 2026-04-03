import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { analyticsApi } from '../api/analytics.api'
import { settingsApi } from '@/api/settings.api'
import StreakWidget from '../components/streak/StreakWidget'
import { ANALYTICS_QUERY_STALE_TIME_MS, BADGES_LAST_CHECK_STORAGE_KEY } from '@/config/constants'
import { getAgentLabel } from '@/config/agents'
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner'
import useAuthStore from '@/store/useAuthStore'

const navigationItems = [
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Badges', to: '/badges' },
  { label: 'Settings', to: '/settings' },
]

export default function AppLayout() {
  const location = useLocation()
  const setUser = useAuthStore((state) => state.setUser)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const [lastBadgeCheckTime, setLastBadgeCheckTime] = useState<string>(() => {
    return window.localStorage.getItem(BADGES_LAST_CHECK_STORAGE_KEY) ?? new Date(0).toISOString()
  })

  // Keep user profile fresh on load (including email verification state).
  useEffect(() => {
    if (!token) return
    authApi.me().then(setUser).catch(() => {})
  }, [token, setUser])

  const { data } = useQuery({
    queryKey: ['agent-settings'],
    queryFn: settingsApi.getAgentSettings,
  })

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getAnalytics,
    staleTime: ANALYTICS_QUERY_STALE_TIME_MS,
  })

  const { data: badgesData } = useQuery({
    queryKey: ['badges'],
    queryFn: analyticsApi.getBadges,
  })

  useEffect(() => {
    if (location.pathname !== '/badges') {
      return
    }

    const nowIso = new Date().toISOString()
    window.localStorage.setItem(BADGES_LAST_CHECK_STORAGE_KEY, nowIso)
    setLastBadgeCheckTime(nowIso)
  }, [location.pathname])

  const newBadgeCount = useMemo(() => {
    if (!badgesData?.badges?.length) {
      return 0
    }

    return badgesData.badges.filter((badge) => {
      if (!badge.earned || !badge.earned_at) {
        return false
      }

      return new Date(badge.earned_at).getTime() > new Date(lastBadgeCheckTime).getTime()
    }).length
  }, [badgesData, lastBadgeCheckTime])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-zinc-800 bg-zinc-900 md:min-h-screen md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">SDMastery</p>
          <Link
            to="/settings"
            className="mt-3 inline-flex rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:border-indigo-400"
          >
            {getAgentLabel(data?.selected_agent)}
          </Link>
          <nav className="mt-6 flex gap-2 md:flex-col">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }`
                }
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.to === '/badges' && newBadgeCount > 0 ? (
                    <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {newBadgeCount}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-6">
            <StreakWidget
              currentStreak={analyticsData?.streak.current ?? 0}
              last7Days={analyticsData?.streak.last_7_days ?? []}
            />
          </div>
        </div>
      </aside>

      <main className="p-4 md:p-8">
        <EmailVerificationBanner />
        <Outlet />
      </main>
    </div>
  )
}
