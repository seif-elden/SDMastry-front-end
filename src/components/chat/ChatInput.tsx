import { useRef, useState } from 'react'
import { CHAT_COUNTER_VISIBLE_AT, CHAT_MESSAGE_MAX_CHARS } from '@/config/constants'

interface ChatInputProps {
  onSend: (message: string) => Promise<void> | void
  isSending: boolean
}

export default function ChatInput({ onSend, isSending }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    const maxHeight = 24 * 3 + 24
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }

  const sendMessage = async () => {
    const message = value.trim()

    if (!message || isSending) {
      return
    }

    await onSend(message)
    setValue('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/95 p-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          maxLength={CHAT_MESSAGE_MAX_CHARS}
          rows={1}
          onChange={(event) => {
            setValue(event.target.value)
            adjustHeight()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void sendMessage()
            }
          }}
          disabled={isSending}
          placeholder="Ask a question about this topic..."
          className="max-h-28 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 pr-24 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none disabled:opacity-70"
        />

        {value.length >= CHAT_COUNTER_VISIBLE_AT ? (
          <p className="absolute bottom-2 right-16 text-xs text-zinc-400">{value.length}/{CHAT_MESSAGE_MAX_CHARS}</p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void sendMessage()
          }}
          disabled={isSending || value.trim().length === 0}
          className="absolute bottom-2 right-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  )
}
