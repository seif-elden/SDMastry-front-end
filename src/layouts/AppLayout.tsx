import { useQuery } from '@tanstack/react-query'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { settingsApi } from '@/api/settings.api'
import { getAgentLabel } from '@/config/agents'
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner'

const navigationItems = [
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Badges', to: '/badges' },
  { label: 'Settings', to: '/settings' },
]

export default function AppLayout() {
  const { data } = useQuery({
    queryKey: ['agent-settings'],
    queryFn: settingsApi.getAgentSettings,
  })

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
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <main className="p-4 md:p-8">
        <EmailVerificationBanner />
        <Outlet />
      </main>
    </div>
  )
}
