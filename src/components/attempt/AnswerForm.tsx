import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { attemptsApi } from '@/api/attempts.api'
import { ANSWER_MAX_CHARS, ANSWER_MIN_CHARS } from '@/config/constants'
import type { SubmitAttemptResponse } from '@/types'

interface AnswerFormProps {
  topicSlug: string
  hookQuestion: string
  onSubmitted: (response: SubmitAttemptResponse) => void
}

export default function AnswerForm({ topicSlug, hookQuestion, onSubmitted }: AnswerFormProps) {
  const [answer, setAnswer] = useState('')
  const answerLength = answer.trim().length

  const submitMutation = useMutation({
    mutationFn: () => attemptsApi.submitAttempt(topicSlug, answer.trim()),
    onSuccess: (response) => {
      onSubmitted(response)
    },
  })

  const canSubmit = answerLength >= ANSWER_MIN_CHARS && !submitMutation.isPending

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">Hook Question</p>
        <p className="mt-2 text-sm text-indigo-100">{hookQuestion}</p>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-zinc-200" htmlFor="answer-textarea">
          Your answer
        </label>
        <textarea
          id="answer-textarea"
          rows={10}
          value={answer}
          maxLength={ANSWER_MAX_CHARS}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Explain your reasoning, trade-offs, examples, and alternatives."
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
        />
        <p className={`absolute bottom-3 right-3 text-xs ${answerLength < ANSWER_MIN_CHARS ? 'text-red-400' : 'text-zinc-400'}`}>
          {answerLength}/{ANSWER_MAX_CHARS}
        </p>
      </div>

      <p className="text-xs text-zinc-400">
        Tip: Aim for depth - explain trade-offs, give examples, discuss alternatives.
      </p>

      {submitMutation.error ? (
        <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">Unable to submit answer. Please try again.</p>
      ) : null}

      <button
        type="button"
        onClick={() => submitMutation.mutate()}
        disabled={!canSubmit}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitMutation.isPending ? 'Submitting...' : 'Submit Answer'}
      </button>
    </section>
  )
}
