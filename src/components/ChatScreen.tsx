import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'

interface ChatScreenProps {
  messages: ChatMessage[]
  onScroll: (scrollTop: number) => void
}

export function ChatScreen({ messages, onScroll }: ChatScreenProps) {
  return (
    <section
      onScroll={(event) => onScroll(event.currentTarget.scrollTop)}
      className="flex-1 overflow-y-auto px-1 pb-[calc(132px+env(safe-area-inset-bottom))] pt-3"
    >
      {messages.length === 0 ? (
        <div className="glass-panel-soft mt-4 rounded-[28px] p-6 text-center text-[#6f6075]">
          <p className="text-base font-medium">Begin a thread.</p>
          <p className="mt-1 text-sm text-[#8f8297]">Τεχνίκιον is ready when you are.</p>
        </div>
      ) : null}

      <div className="space-y-4 pb-6">
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <motion.article
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[28px] border px-4 py-3 shadow-[0_8px_26px_rgba(112,86,109,0.11)] ${
                isUser
                  ? 'ml-auto max-w-[85%] border-[#EAC5D2] bg-[rgba(244,199,214,0.72)] text-[#5B4652]'
                  : 'mr-auto max-w-[85%] border-[#D9CAE9] bg-[rgba(230,221,245,0.78)] text-[#4A3C57]'
              }`}
            >
              <div className="prose prose-sm prose-p:my-1 prose-headings:my-2 prose-code:rounded prose-code:bg-white/60 prose-code:px-1 prose-code:py-0.5 max-w-none break-words text-inherit">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
              {message.isMock ? <p className="mt-2 text-[11px] opacity-70">Local mock response only</p> : null}
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
