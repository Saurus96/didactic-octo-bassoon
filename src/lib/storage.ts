import type { AppSettings, ChatMessage } from '../types'

const MESSAGES_KEY = 'cozy-companion.messages.v1'
const SETTINGS_KEY = 'cozy-companion.settings.v1'

export const defaultSettings: AppSettings = {
  provider: 'OpenAI-compatible',
  baseUrl: 'https://api.example.com/v1',
  apiKey: '',
  model: 'gpt-4.1-mini',
  systemPrompt:
    'You are a warm, thoughtful companion. Keep responses clear, kind, and practical.',
}

export function loadMessages(): ChatMessage[] {
  const raw = localStorage.getItem(MESSAGES_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ChatMessage[]
  } catch {
    return []
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return defaultSettings
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as AppSettings) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
