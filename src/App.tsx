import { SendHorizonal } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BottomNav } from './components/BottomNav'
import { ChatScreen } from './components/ChatScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { TopProgressBar } from './components/TopProgressBar'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { defaultSettings, loadMessages, loadSettings, saveMessages, saveSettings } from './lib/storage'
import type { ChatMessage, TabId } from './types'

function buildMockReply(input: string): string {
  return `This is a local mock reply for now.\n\nYou said: **${input.slice(0, 160)}**\n\nConnect a real provider in a later slice.`
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useLocalStorageState<ChatMessage[]>(loadMessages, saveMessages)
  const [settings, setSettings] = useLocalStorageState(loadSettings, saveSettings)

  const progress = useMemo(() => {
    const usage = Math.min(100, Math.max(8, Math.round((messages.length % 24) * 4.2)))
    return usage
  }, [messages.length])

  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: buildMockReply(text),
      createdAt: new Date().toISOString(),
      isMock: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setDraft('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0] to-[#FDE8F1] text-[#3A2A4A]">
      <TopProgressBar value={progress} />
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-24 pt-4">
        <header className="glass-panel mt-3 rounded-3xl p-4">
          <h1 className="text-lg font-semibold">Cozy Companion</h1>
          <p className="text-sm text-[#6B4B5B]">A soft local shell for future AI conversations.</p>
        </header>

        {activeTab === 'chat' ? <ChatScreen messages={messages} /> : null}
        {activeTab === 'settings' ? (
          <SettingsScreen settings={settings || defaultSettings} onChange={setSettings} />
        ) : null}
        {activeTab !== 'chat' && activeTab !== 'settings' ? (
          <section className="glass-panel mt-4 rounded-3xl p-6 text-sm text-[#6B4B5B]">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} is scaffolded for a future PR.
          </section>
        ) : null}

        {activeTab === 'chat' ? (
          <form onSubmit={sendMessage} className="glass-panel fixed bottom-24 left-4 right-4 z-30 mx-auto max-w-xl rounded-3xl p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message"
                rows={2}
                className="input-base min-h-[56px] flex-1"
              />
              <button
                type="submit"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F9C5D5] text-[#4A2C3D] shadow transition hover:brightness-105"
              >
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>
          </form>
        ) : null}
      </main>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
