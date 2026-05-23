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
import {
  buildChatTitle,
  createNewChat,
  defaultSettings,
  loadActiveChatId,
  loadChats,
  loadSettings,
  saveActiveChatId,
  saveChats,
  saveSettings,
} from './lib/storage'
import type { AppSettings, ChatMessage, SavedChat, TabId } from './types'

function buildMockReply(input: string): string {
  return `This is a local mock reply for now.\n\nYou said: **${input.slice(0, 160)}**\n\nAdd an API key in Settings to enable real provider responses.`
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat')
  const [draft, setDraft] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [chats, setChats] = useLocalStorageState<SavedChat[]>(loadChats, saveChats)
  const [activeChatId, setActiveChatIdState] = useLocalStorageState<string | null>(loadActiveChatId, saveActiveChatId)
  const [settings, setSettings] = useLocalStorageState<AppSettings>(loadSettings, saveSettings)
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [isFetchingModels, setIsFetchingModels] = useState(false)

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? null, [activeChatId, chats])
  const messages = activeChat?.messages ?? []
  const hasMessages = messages.length > 0
  const progress = useMemo(() => Math.min(100, Math.max(8, Math.round((messages.length % 24) * 4.2))), [messages.length])


  const createFreshChat = () => {
    const chat = createNewChat()
    setChats((prev) => [chat, ...prev])
    setActiveChatIdState(chat.id)
    setActiveTab('chat')
    return chat
  }

  const ensureActiveChat = (): SavedChat => {
    if (activeChat) return activeChat
    return createFreshChat()
  }

  const updateChatMessages = (chatId: string, nextMessages: ChatMessage[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: nextMessages, title: buildChatTitle(nextMessages), updatedAt: new Date().toISOString() }
          : chat,
      ),
    )
  }

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isSending) return
    setChatError(null)

    const chat = ensureActiveChat()
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, createdAt: new Date().toISOString() }
    const history = [...chat.messages, userMessage]
    updateChatMessages(chat.id, history)
    setDraft('')

    if (!settings.apiKey.trim()) {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant', content: buildMockReply(text), createdAt: new Date().toISOString(), isMock: true,
      }
      updateChatMessages(chat.id, [...history, assistantMessage])
      return
    }

    setIsSending(true)
    try {
      const content = await createAssistantReply(settings, history)
      updateChatMessages(chat.id, [...history, { id: crypto.randomUUID(), role: 'assistant', content, createdAt: new Date().toISOString() }])
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
      <ModalDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(chatId) => { setActiveChatIdState(chatId); setActiveTab('chat'); setDrawerOpen(false) }}
        onCreateChat={() => { createFreshChat(); setDrawerOpen(false) }}
        onDeleteChat={(chatId) => {
          const nextChats = chats.filter((chat) => chat.id !== chatId)
          setChats(nextChats)
          if (activeChatId === chatId) {
            if (nextChats.length > 0) setActiveChatIdState(nextChats[0].id)
            else {
              const fresh = createNewChat()
              setChats([fresh])
              setActiveChatIdState(fresh.id)
            }
          }
        }}
      />

      <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-4 pt-16">
        {activeTab === 'chat' ? (
          hasMessages ? (
            <header className="glass-panel-ambient sticky top-3 z-20 mt-2 rounded-3xl px-4 py-3">
              <h1 className="text-xl font-semibold tracking-wide text-[#8D8198]">Τεχνίκιον</h1>
            </header>
          ) : (
            <header className="glass-panel-ambient sticky top-3 z-20 mt-2 overflow-hidden rounded-[32px] p-6 text-center">
              <h1 className="text-3xl font-semibold tracking-wide text-[#8D8198]">Τεχνίκιον</h1>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm tracking-[0.22em] text-[#A194AA]"><Sparkles className="h-4 w-4" />tekh-NEE-kee-on</p>
              <p className="mt-3 text-sm text-[#6D5E6C]">A soft local shell for future AI conversations.</p>
            </header>
          )
        ) : null}

        {activeTab === 'chat' && <ChatScreen messages={messages} onScroll={() => undefined} />}
        {activeTab === 'settings' && <><section className="glass-panel-ambient mt-4 rounded-[28px] p-5 text-[#6f6075]"><p className="text-base font-medium">Settings</p><p className="mt-1 text-sm text-[#8f8297]">Configure providers and local app preferences.</p></section><SettingsScreen settings={settings || defaultSettings} onChange={setSettings} onFetchModels={handleFetchModels} isFetchingModels={isFetchingModels} modelsError={modelsError} /></>}
        {activeTab === 'memory' && <section className="glass-panel-ambient mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="text-base font-medium">Memory</p><p className="mt-1 text-sm text-[#8f8297]">Important details can live here later.</p></section>}
        {activeTab === 'journal' && <section className="glass-panel-ambient mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="text-base font-medium">Journal</p><p className="mt-1 text-sm text-[#8f8297]">Reflections will appear here when journal tools are added.</p></section>}
        {activeTab === 'diagnostics' && <section className="glass-panel-ambient mt-4 rounded-[28px] p-6 text-[#6f6075]"><p className="text-base font-medium">Diagnostics</p><p className="mt-1 text-sm text-[#8f8297]">Companion telemetry will appear after Signal Lens is added.</p></section>}

        {activeTab === 'chat' ? (
          <form onSubmit={sendMessage} className="glass-panel-input fixed left-4 right-4 z-30 mx-auto max-w-xl rounded-[28px] p-2.5" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
            <div className="flex items-center gap-2">
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" rows={1} className="input-base min-h-[52px] flex-1 rounded-full px-5 py-3" disabled={isSending} />
              <button type="submit" disabled={isSending} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9B9C9] text-[#5B4050] shadow-[0_10px_22px_rgba(140,96,118,0.18)] transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1] disabled:opacity-60">
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
