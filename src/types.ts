export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  isMock?: boolean
}

export type TabId = 'chat' | 'memory' | 'journal' | 'diagnostics' | 'settings'

export interface AppSettings {
  provider: string
  baseUrl: string
  apiKey: string
  model: string
  systemPrompt: string
}
