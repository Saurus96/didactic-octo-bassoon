import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BackgroundBlobs } from './components/BackgroundBlobs'
import { ChatScreen } from './components/ChatScreen'
import { FloatingGlassInput } from './components/FloatingGlassInput'
import { GlassAppBar } from './components/GlassAppBar'
import { ModalDrawer } from './components/ModalDrawer'
import { PageContainer } from './components/PageContainer'
import { PageTitleChip } from './components/PageTitleChip'
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
  const [fetchedModels, setFetchedModels] = useState<string[]>([])

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? null, [activeChatId, chats])
  const messages = activeChat?.messages ?? []
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
      setFetchedModels(modelIds)
    } catch (error) {
      setModelsError(error instanceof ProviderError ? error.message : 'Unexpected error while fetching models.')
    } finally {
      setIsFetchingModels(false)
    }
  }

  return (
    <div className="app-shell">
      <TopProgressBar value={progress} />
      <BackgroundBlobs />
      <GlassAppBar onOpenNavigation={() => setDrawerOpen(true)} />
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

      <main className="app-content page-width">
        {activeTab === 'chat' && (
          <PageContainer className="chat-page">
            <ChatScreen messages={messages} onScroll={() => undefined} />
          </PageContainer>
        )}

        {activeTab === 'settings' && <PageContainer><h1 className="settings-title text-[15px] font-semibold text-[#655771]">Settings</h1><SettingsScreen settings={settings || defaultSettings} onChange={setSettings} onFetchModels={handleFetchModels} fetchedModels={fetchedModels} isFetchingModels={isFetchingModels} modelsError={modelsError} /></PageContainer>}
        {activeTab === 'memory' && <PageContainer><PageTitleChip title="Memory" /><section className="glass-surface glass-card p-4 text-[#5e5264]"><p className="text-sm">Important details can live here later.</p></section></PageContainer>}
        {activeTab === 'journal' && <PageContainer><PageTitleChip title="Journal" /><section className="glass-surface glass-card p-4 text-[#5e5264]"><p className="text-sm">Reflections will appear here when journal tools are added.</p></section></PageContainer>}
        {activeTab === 'diagnostics' && <PageContainer><PageTitleChip title="Diagnostics" /><section className="glass-surface glass-card p-4 text-[#5e5264]"><p className="text-sm">Companion telemetry will appear after Signal Lens is added.</p></section></PageContainer>}
      </main>

      {activeTab === 'chat' ? (
        <FloatingGlassInput draft={draft} onDraftChange={setDraft} isSending={isSending} onSubmit={sendMessage} chatError={chatError} />
      ) : null}
    </div>
  )
}
