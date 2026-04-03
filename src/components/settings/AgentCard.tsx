import type { AgentOption } from '@/config/agents'

interface AgentCardProps {
  option: AgentOption
  isSelected: boolean
  hasRequiredKey: boolean
  onSelect: (agentId: AgentOption['id']) => void
}

export default function AgentCard({ option, isSelected, hasRequiredKey, onSelect }: AgentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`relative rounded-xl border p-4 text-left transition ${
        isSelected
          ? 'border-indigo-400 bg-indigo-500/10'
          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
      }`}
    >
      {isSelected ? (
        <span className="absolute right-3 top-3 rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">✓</span>
      ) : null}

      <p className="text-xl" aria-hidden="true">
        {option.icon}
      </p>
      <h3 className="mt-2 text-base font-semibold text-zinc-100">{option.name}</h3>
      <p className="text-sm text-zinc-400">{option.model}</p>
      <p className="mt-2 text-xs text-zinc-300">{option.requiresKey ? 'Requires API key' : 'Free (no key needed)'}</p>

      {option.requiresKey && !hasRequiredKey ? (
        <p className="mt-2 rounded-lg bg-amber-500/10 px-2 py-1 text-xs text-amber-200">Add your API key below</p>
      ) : null}
    </button>
  )
}
