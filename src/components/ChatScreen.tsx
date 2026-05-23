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
    <section onScroll={(event) => onScroll(event.currentTarget.scrollTop)} className="chat-scroll">
      {messages.length === 0 ? (
        <div className="glass-card glass-readable mt-3 rounded-[24px] p-5 text-center text-[#6f6075]">
          <p className="text-base font-medium">Begin a thread.</p>
          <p className="mt-1 text-sm text-[#8f8297]">Τεχνίκιον is ready when you are.</p>
        </div>
      ) : null}

      <div className="space-y-3 pb-6 pt-2">
        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <motion.article
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
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
