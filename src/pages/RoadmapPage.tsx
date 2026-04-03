import ProgressSummary from '@/components/progress/ProgressSummary'
import TopicCard from '@/components/topics/TopicCard'
import {
  ROADMAP_ADVANCED_TOPICS_TOTAL,
  ROADMAP_CORE_TOPICS_TOTAL,
  ROADMAP_TOTAL_TOPICS,
} from '@/config/constants'
import { useTopics } from '@/hooks/useTopics'
import useAuthStore from '@/store/useAuthStore'

function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-2xl bg-zinc-800/70" />
      <div className="h-6 w-48 animate-pulse rounded bg-zinc-800/70" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-52 animate-pulse rounded-xl bg-zinc-800/70" />
        ))}
      </div>
    </div>
  )
}

export default function RoadmapPage() {
  const { data: topics = [], isLoading } = useTopics()
  const user = useAuthStore((state) => state.user)
  const isVerified = Boolean(user?.email_verified_at)

  const coreTopics = topics.filter((topic) => topic.section === 'core')
  const advancedTopics = topics.filter((topic) => topic.section === 'advanced')

  const coreMastered = coreTopics.filter((topic) => topic.passed).length
  const advancedMastered = advancedTopics.filter((topic) => topic.passed).length
  const overallMastered = coreMastered + advancedMastered

  if (isLoading) {
    return <RoadmapSkeleton />
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100 md:text-3xl">Your Learning Roadmap</h1>
        <span className="inline-flex w-fit items-center rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-1.5 text-sm text-indigo-200">
          {overallMastered}/{ROADMAP_TOTAL_TOPICS} topics mastered
        </span>
      </header>

      <ProgressSummary
        overallMastered={overallMastered}
        coreMastered={coreMastered}
        advancedMastered={advancedMastered}
        streakDays={user?.current_streak ?? 0}
      />

      <div className="relative space-y-7">
        {!isVerified ? (
          <div className="sticky top-4 z-10 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Verify your email to start learning
          </div>
        ) : null}

        <section className={!isVerified ? 'pointer-events-none opacity-60' : undefined}>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">Core Topics ({ROADMAP_CORE_TOPICS_TOTAL})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coreTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} isVerified={isVerified} />
            ))}
          </div>
        </section>

        <section className={!isVerified ? 'pointer-events-none opacity-60' : undefined}>
          <h2 className="mb-4 text-lg font-semibold text-zinc-200">Advanced Topics ({ROADMAP_ADVANCED_TOPICS_TOTAL})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {advancedTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} isVerified={isVerified} />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
