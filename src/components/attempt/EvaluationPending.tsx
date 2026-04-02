import { useEffect, useState } from 'react'
import { attemptsApi } from '@/api/attempts.api'
import {
  ATTEMPT_STATUS_MESSAGE_CYCLE_MS,
  ATTEMPT_STATUS_MESSAGES,
  ATTEMPT_STATUS_POLL_INTERVAL_MS,
} from '@/config/constants'
import type { AttemptStatusResponse } from '@/types'

interface EvaluationPendingProps {
  attemptId: number
  onComplete: (status: AttemptStatusResponse) => void
  onTryAgain: () => void
}

export default function EvaluationPending({ attemptId, onComplete, onTryAgain }: EvaluationPendingProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [isFailed, setIsFailed] = useState(false)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % ATTEMPT_STATUS_MESSAGES.length)
    }, ATTEMPT_STATUS_MESSAGE_CYCLE_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let isActive = true

    const pollStatus = async () => {
      try {
        const status = await attemptsApi.getAttemptStatus(attemptId)

        if (!isActive) {
          return
        }

        if (status.status === 'complete') {
          onComplete(status)
          return
        }

        if (status.status === 'failed') {
          setIsFailed(true)
        }
      } catch {
        if (isActive) {
          setIsFailed(true)
        }
      }
    }

    void pollStatus()
    const intervalId = window.setInterval(() => {
      void pollStatus()
    }, ATTEMPT_STATUS_POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [attemptId, onComplete])

  if (isFailed) {
    return (
      <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
        <p className="text-sm text-red-200">Evaluation failed. Please try again.</p>
        <button
          type="button"
          onClick={onTryAgain}
          className="mt-3 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700"
        >
          Try again
        </button>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-2xl text-indigo-200">
        <span className="animate-spin">⚙</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-100">Evaluating your answer</h3>
      <p className="mt-2 text-sm text-zinc-300">{ATTEMPT_STATUS_MESSAGES[messageIndex]}</p>
    </section>
  )
}
