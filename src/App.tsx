import { Sparkles, SendHorizonal } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BottomNav } from './components/BottomNav'
import { ChatScreen } from './components/ChatScreen'
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
  const [messages, setMessages] = useLocalStorageState<ChatMessage[]>(loadMessages, saveMessages)
  const [settings, setSettings] = useLocalStorageState<AppSettings>(loadSettings, saveSettings)
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [isFetchingModels, setIsFetchingModels] = useState(false)

  const progress = useMemo(() => {
    const usage = Math.min(100, Math.max(8, Math.round((messages.length % 24) * 4.2)))
    return usage
  }, [messages.length])

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isSending) return
    setChatError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    const history = [...messages, userMessage]
    setMessages(history)
    setDraft('')

    if (!settings.apiKey.trim()) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: buildMockReply(text),
        createdAt: new Date().toISOString(),
        isMock: true,
      }
      setMessages((prev) => [...prev, assistantMessage])
      return
    }

    setIsSending(true)
    try {
      const content = await createAssistantReply(settings, history)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const message = error instanceof ProviderError ? error.message : 'Unexpected error while generating response.'
      setChatError(message)
    } finally {
      setIsSending(false)
    }
  }

  const handleFetchModels = async () => {
    setModelsError(null)
    setIsFetchingModels(true)
    try {
      const modelIds = await fetchProviderModels(settings)
      if (modelIds.length > 0) {
        setSettings({ ...settings, model: modelIds[0] })
      }
    } catch (error) {
      const message = error instanceof ProviderError ? error.message : 'Unexpected error while fetching models.'
      setModelsError(message)
    } finally {
      setIsFetchingModels(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F1EA] via-[#F7EFE8] to-[#F5ECE7] text-[#4E414D]">
      <TopProgressBar value={progress} />
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-24 pt-4">
        <header className="glass-panel mt-3 rounded-[2rem] p-6 text-center">
          <h1 className="text-4xl font-semibold tracking-wide text-[#8D8198] sm:text-[2.7rem]">Τεχνίκιον</h1>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm tracking-[0.22em] text-[#A194AA]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>tekh-NEE-kee-on</span>
          </p>
          <p className="mt-3 text-sm text-[#6D5E6C]">A soft local shell for future AI conversations.</p>
        </header>

        {activeTab === 'chat' ? <ChatScreen messages={messages} /> : null}
        {activeTab === 'settings' ? (
          <SettingsScreen
            settings={settings || defaultSettings}
            onChange={setSettings}
            onFetchModels={handleFetchModels}
            isFetchingModels={isFetchingModels}
            modelsError={modelsError}
          />
        ) : null}
        {activeTab !== 'chat' && activeTab !== 'settings' ? (
          <section className="glass-panel mt-4 rounded-3xl p-6 text-sm text-[#6B4B5B]">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} is scaffolded for a future PR.
          </section>
        ) : null}

        {activeTab === 'chat' ? (
          <form onSubmit={sendMessage} className="glass-panel fixed bottom-24 left-4 right-4 z-30 mx-auto max-w-xl rounded-full p-2.5">
            <div className="flex items-center gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message"
                rows={1}
                className="input-base min-h-[52px] flex-1 rounded-full px-5 py-3"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9B9C9] text-[#5B4050] shadow-[0_10px_22px_rgba(140,96,118,0.25)] transition hover:brightness-105 disabled:opacity-60"
              >
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>
            {isSending ? <p className="mt-2 px-3 text-sm text-[#766777]">Waiting for provider response…</p> : null}
            {chatError ? <p className="mt-2 px-3 text-sm text-[#8C2F39]">{chatError}</p> : null}
          </form>
        ) : null}
      </main>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
