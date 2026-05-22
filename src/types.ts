export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  isMock?: boolean
}

export type TabId = 'chat' | 'memory' | 'journal' | 'diagnostics' | 'settings'

export type ProviderPresetId = 'groq' | 'gemini' | 'openrouter' | 'deepseek' | 'custom'

export interface AppSettings {
  provider: ProviderPresetId
  baseUrl: string
  apiKey: string
  model: string
  systemPrompt: string
}
