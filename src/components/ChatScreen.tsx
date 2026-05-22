import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'

interface ChatScreenProps {
  messages: ChatMessage[]
}

export function ChatScreen({ messages }: ChatScreenProps) {
  return (
    <section className="space-y-3 pb-28 pt-4">
      {messages.map((message) => {
        const isUser = message.role === 'user'
        return (
          <motion.article
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
              isUser
                ? 'ml-auto bg-[#FFD6E0] text-[#4A2C3D]'
                : 'mr-auto bg-[#F0E6FA] text-[#3A2A4A]'
            }`}
          >
            <div className="prose prose-sm prose-p:my-1 prose-headings:my-2 prose-code:rounded prose-code:bg-white/60 prose-code:px-1 prose-code:py-0.5 max-w-none text-inherit">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
            {message.isMock ? (
              <p className="mt-2 text-[11px] opacity-70">Local mock response only</p>
            ) : null}
          </motion.article>
        )
      })}
    </section>
  )
}
