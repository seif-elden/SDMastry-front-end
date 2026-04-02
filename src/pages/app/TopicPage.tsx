import { useParams } from 'react-router-dom'

export default function TopicPage() {
  const { slug } = useParams()

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h1 className="text-2xl font-semibold text-zinc-50">Topic: {slug}</h1>
      <p className="mt-2 text-zinc-400">Topic detail content will be implemented in the next phase.</p>
    </section>
  )
}
