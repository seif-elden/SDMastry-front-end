import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { CHAT_CONTEXT_GUARD_PHRASE } from '@/config/constants'
import type { ChatMessage } from '@/types'

interface MessageListProps {
  messages: ChatMessage[]
  topicTitle: string
}

export default function MessageList({ messages, topicTitle }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
        Ask me anything about {topicTitle}
      </div>
    )
  }

  const firstAssistantMessageId = messages.find((message) => message.role === 'assistant' && message.content !== '__typing__')?.id

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto pr-2">
      {messages.map((message) => {
        const isUser = message.role === 'user'
        const isTyping = message.content === '__typing__'
        const isContextGuard = !isTyping && message.role === 'assistant' && message.content.includes(CHAT_CONTEXT_GUARD_PHRASE)
        const isSeedModelAnswer = message.id === firstAssistantMessageId

        return (
          <article key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                isUser
                  ? 'bg-indigo-600 text-white'
                  : isContextGuard
                    ? 'border border-amber-400/40 bg-amber-500/15 text-amber-100'
                    : 'bg-zinc-800 text-zinc-100'
              }`}
            >
              {!isUser ? <p className="mb-1 text-xs text-zinc-400">🤖 Assistant</p> : null}
              {isSeedModelAnswer ? <p className="mb-1 text-xs font-semibold text-indigo-200">📚 Model Answer</p> : null}
              {isContextGuard ? <p className="mb-1 text-xs font-semibold text-amber-200">⚠️ Off-topic guard</p> : null}

              {isTyping ? (
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:240ms]" />
                </span>
              ) : message.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </article>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
