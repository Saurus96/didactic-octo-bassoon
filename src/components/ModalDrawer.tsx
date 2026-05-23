import { AnimatePresence, motion } from 'framer-motion'
import { BookHeart, HeartPulse, MessageCircleHeart, Settings, Trash2, UserCircle2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { SavedChat, TabId } from '../types'

interface ModalDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabId
  onChangeTab: (tab: TabId) => void
  chats: SavedChat[]
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onCreateChat: () => void
  onDeleteChat: (chatId: string) => void
}

const navRows: Array<{ id: TabId; label: string; icon: typeof BookHeart }> = [
  { id: 'memory', label: 'Memory', icon: BookHeart },
  { id: 'journal', label: 'Journal', icon: MessageCircleHeart },
  { id: 'diagnostics', label: 'Diagnostics', icon: HeartPulse },
]

export function ModalDrawer({ isOpen, onClose, activeTab, onChangeTab, chats, activeChatId, onSelectChat, onCreateChat, onDeleteChat }: ModalDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" className="fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[320px] flex-col rounded-r-[28px] border-r border-white/40 bg-[rgba(255,255,255,0.34)] p-4 shadow-[0_16px_36px_rgba(105,84,101,0.14)] backdrop-blur-[28px]" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="mb-4 flex items-center justify-between">
              <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded-full p-2 text-[#6f6077] hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1]" aria-label="Close navigation"><X className="h-5 w-5" /></button>
            </div>

            <button type="button" onClick={onCreateChat} className="mb-4 w-full rounded-2xl border border-white/50 bg-[rgba(244,199,214,0.42)] px-4 py-3 text-left font-medium text-[#5c4856] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] interactive">New Chat</button>

            <nav className="space-y-2">
              {navRows.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { onChangeTab(id); onClose() }} className={`flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm interactive ${activeTab === id ? 'bg-white/56 text-[#5a4a5d]' : 'text-[#6f6177] hover:bg-white/35'}`}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </nav>

            <div className="my-4 h-px bg-white/25" />
            <p className="mb-2 px-1 text-xs uppercase tracking-[0.15em] text-[#8d7f96]">Chats</p>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl bg-white/20 p-2 text-sm text-[#6f6075]">
              {chats.length === 0 ? <><p className="px-1">No saved chats yet.</p><p className="px-1 text-xs text-[#8d7f96]">Start a new chat to create one.</p></> : null}
              {chats.map((chat) => (
                <div key={chat.id} className={`flex items-center gap-2 rounded-xl p-1 ${activeChatId === chat.id ? 'bg-white/50' : 'bg-white/20'}`}>
                  <button type="button" onClick={() => onSelectChat(chat.id)} className="min-w-0 flex-1 truncate rounded-lg px-2 py-2 text-left interactive">{chat.title || 'New chat'}</button>
                  <button
                    type="button"
                    aria-label="Delete chat"
                    onClick={() => { if (window.confirm('Delete this chat? This cannot be undone.')) onDeleteChat(chat.id) }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7b6171] interactive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <footer className="mt-4 flex items-center justify-between">
              <button aria-label="Profile" title="Profile" className="h-11 w-11 rounded-2xl text-[#6f6077] hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1]"><UserCircle2 className="mx-auto h-5 w-5" /></button>
              <button aria-label="Settings" title="Settings" onClick={() => { onChangeTab('settings'); onClose() }} className="h-11 w-11 rounded-2xl text-[#6f6077] hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1]"><Settings className="mx-auto h-5 w-5" /></button>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
