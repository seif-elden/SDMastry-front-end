export interface CategoryColorScheme {
  chipClassName: string
}

const CATEGORY_COLOR_MAP: Record<string, CategoryColorScheme> = {
  Caching: { chipClassName: 'bg-indigo-500/20 text-indigo-200 ring-indigo-400/30' },
  Databases: { chipClassName: 'bg-blue-500/20 text-blue-200 ring-blue-400/30' },
  'Load Balancers': { chipClassName: 'bg-orange-500/20 text-orange-200 ring-orange-400/30' },
  APIs: { chipClassName: 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30' },
  Testing: { chipClassName: 'bg-fuchsia-500/20 text-fuchsia-200 ring-fuchsia-400/30' },
  Security: { chipClassName: 'bg-rose-500/20 text-rose-200 ring-rose-400/30' },
  Architecture: { chipClassName: 'bg-cyan-500/20 text-cyan-200 ring-cyan-400/30' },
}

const DEFAULT_CATEGORY_COLORS: CategoryColorScheme = {
  chipClassName: 'bg-zinc-700/40 text-zinc-200 ring-zinc-500/40',
}

export function getCategoryColors(category: string): CategoryColorScheme {
  return CATEGORY_COLOR_MAP[category] ?? DEFAULT_CATEGORY_COLORS
}
