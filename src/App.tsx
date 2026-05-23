import { SendHorizonal, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ChatScreen } from './components/ChatScreen'
import { HamburgerButton } from './components/HamburgerButton'
import { ModalDrawer } from './components/ModalDrawer'
import { SettingsScreen } from './components/SettingsScreen'
import { TopProgressBar } from './components/TopProgressBar'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { createAssistantReply, fetchProviderModels, ProviderError } from './lib/providerService'
import { defaultSettings, loadMessages, loadSettings, saveMessages, saveSettings } from './lib/storage'
import type { AppSettings, ChatMessage, TabId } from './types'

function buildMockReply(input: string): string {
  return `This is a local mock reply for now.\n\nYou said: **${input.slice(0, 160)}**\n\nAdd an API key in Settings to enable real provider responses.`
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat')
  const [draft, setDraft] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [headerCompact, setHeaderCompact] = useState(false)
  const [messages, setMessages] = useLocalStorageState<ChatMessage[]>(loadMessages, saveMessages)
  const [settings, setSettings] = useLocalStorageState<AppSettings>(loadSettings, saveSettings)
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [isFetchingModels, setIsFetchingModels] = useState(false)

  const progress = useMemo(() => Math.min(100, Math.max(8, Math.round((messages.length % 24) * 4.2))), [messages.length])

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isSending) return
    setChatError(null)

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, createdAt: new Date().toISOString() }
    const history = [...messages, userMessage]
    setMessages(history)
    setDraft('')

    if (!settings.apiKey.trim()) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant', content: buildMockReply(text), createdAt: new Date().toISOString(), isMock: true,
      }
      setMessages((prev) => [...prev, assistantMessage])
      return
    }

    setIsSending(true)
    try {
      const content = await createAssistantReply(settings, history)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content, createdAt: new Date().toISOString() }])
    } catch (error) {
      setChatError(error instanceof ProviderError ? error.message : 'Unexpected error while generating response.')
    } finally {
      setIsSending(false)
    }
  }

  const handleFetchModels = async () => {
    setModelsError(null)
    setIsFetchingModels(true)
    try {
      const modelIds = await fetchProviderModels(settings)
      if (modelIds.length > 0) setSettings({ ...settings, model: modelIds[0] })
    } catch (error) {
      setModelsError(error instanceof ProviderError ? error.message : 'Unexpected error while fetching models.')
    } finally {
      setIsFetchingModels(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#F8F1EA] via-[#F7EFE8] to-[#F5ECE7] text-[#4E414D]">
      <TopProgressBar value={progress} />
      <HamburgerButton onClick={() => setDrawerOpen(true)} />
      <ModalDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} activeTab={activeTab} onChangeTab={setActiveTab} />

      <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-4 pt-16">
        <header className={`glass-panel-soft sticky top-3 z-20 mt-2 overflow-hidden rounded-[32px] text-center transition-all duration-300 ${headerCompact ? 'p-4' : 'p-6'}`}>
          <h1 className="text-3xl font-semibold tracking-wide text-[#8D8198]">Τεχνίκιον</h1>
          <div className={`transition-all duration-300 ${headerCompact ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
            <p className="mt-2 flex items-center justify-center gap-2 text-sm tracking-[0.22em] text-[#A194AA]"><Sparkles className="h-4 w-4" />tekh-NEE-kee-on</p>
            <p className="mt-3 text-sm text-[#6D5E6C]">A soft local shell for future AI conversations.</p>
          </div>
        </header>

        {activeTab === 'chat' && <ChatScreen messages={messages} onScroll={(top) => setHeaderCompact(top > 20)} />}
        {activeTab === 'settings' && <SettingsScreen settings={settings || defaultSettings} onChange={setSettings} onFetchModels={handleFetchModels} isFetchingModels={isFetchingModels} modelsError={modelsError} />}
        {activeTab === 'memory' && <section className="glass-panel-soft mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="font-medium">No memories saved yet.</p><p className="text-sm text-[#8f8297]">Important details can live here later.</p></section>}
        {activeTab === 'journal' && <section className="glass-panel-soft mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="font-medium">No journal entries yet.</p><p className="text-sm text-[#8f8297]">Reflections will appear here when journal tools are added.</p></section>}
        {activeTab === 'diagnostics' && <section className="glass-panel-soft mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="font-medium">No signals yet.</p><p className="text-sm text-[#8f8297]">Companion telemetry will appear after Signal Lens is added.</p></section>}

        {activeTab === 'chat' ? (
          <form onSubmit={sendMessage} className="glass-panel-input fixed left-4 right-4 z-30 mx-auto max-w-xl rounded-full p-2.5" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-2">
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" rows={1} className="input-base min-h-[52px] flex-1 rounded-full px-5 py-3" disabled={isSending} />
              <button type="submit" disabled={isSending} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9B9C9] text-[#5B4050] shadow-[0_10px_22px_rgba(140,96,118,0.25)] transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1] disabled:opacity-60">
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>
            {isSending ? <p className="mt-2 px-3 text-sm text-[#766777]">Waiting for provider response…</p> : null}
            {chatError ? <p className="mt-2 px-3 text-sm text-[#8C2F39]">{chatError}</p> : null}
          </form>
        ) : null}
      </main>
    </div>
  )
}
