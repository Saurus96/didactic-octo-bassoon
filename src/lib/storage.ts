import type { AppSettings, ChatMessage, SavedChat } from '../types'

const CHATS_KEY = 'cozy-companion.chats.v1'
const ACTIVE_CHAT_KEY = 'cozy-companion.active-chat.v1'
const LEGACY_MESSAGES_KEY = 'cozy-companion.messages.v1'
const SETTINGS_KEY = 'cozy-companion.settings.v1'

export const defaultSettings: AppSettings = {
  provider: 'groq',
  baseUrl: 'https://api.groq.com/openai/v1',
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  systemPrompt:
    'You are a warm, thoughtful companion. Keep responses clear, kind, and practical.',
}

export function createNewChat(initialMessages: ChatMessage[] = []): SavedChat {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), title: 'New chat', createdAt: now, updatedAt: now, messages: initialMessages }
}

export function buildChatTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((message) => message.role === 'user')
  if (!firstUser) return 'New chat'
  const normalized = firstUser.content.replace(/\s+/g, ' ').trim()
  return normalized.length > 48 ? `${normalized.slice(0, 48)}…` : normalized
}

export function loadChats(): SavedChat[] {
  const raw = localStorage.getItem(CHATS_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as SavedChat[]
    } catch {
      return []
    }
  }

  const legacy = localStorage.getItem(LEGACY_MESSAGES_KEY)
  if (!legacy) return []
  try {
    const messages = JSON.parse(legacy) as ChatMessage[]
    if (!Array.isArray(messages) || messages.length === 0) return []
    return [{ ...createNewChat(messages), title: buildChatTitle(messages) }]
  } catch {
    return []
  }
}

export function saveChats(chats: SavedChat[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
}

export function loadActiveChatId(): string | null {
  return localStorage.getItem(ACTIVE_CHAT_KEY)
}

export function saveActiveChatId(chatId: string | null): void {
  if (!chatId) {
    localStorage.removeItem(ACTIVE_CHAT_KEY)
    return
  }
  localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
}

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return defaultSettings
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
