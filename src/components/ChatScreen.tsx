import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'

interface ChatScreenProps {
  messages: ChatMessage[]
}

export function ChatScreen({ messages }: ChatScreenProps) {
  return (
    <section className="space-y-4 pb-28 pt-5">
      {messages.map((message) => {
        const isUser = message.role === 'user'
        return (
          <motion.article
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[1.7rem] border px-4 py-3 shadow-[0_8px_26px_rgba(112,86,109,0.11)] ${
              isUser
                ? 'ml-auto max-w-[68%] border-[#EAC5D2] bg-[#F7D5DF] text-[#5B4652]'
                : 'mr-auto max-w-[88%] border-[#D9CAE9] bg-[#ECE2F8] text-[#4A3C57]'
            }`}
          >
            <div className="prose prose-sm prose-p:my-1 prose-headings:my-2 prose-code:rounded prose-code:bg-white/60 prose-code:px-1 prose-code:py-0.5 max-w-none text-inherit">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
            {message.isMock ? <p className="mt-2 text-[11px] opacity-70">Local mock response only</p> : null}
          </motion.article>
        )
      })}
    </section>
  )
}
