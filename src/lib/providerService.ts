import type { AppSettings, ChatMessage, ProviderPresetId } from '../types'

export interface ProviderPreset {
  id: ProviderPresetId
  label: string
  defaultBaseUrl: string
}

export const providerPresets: ProviderPreset[] = [
  { id: 'groq', label: 'Groq', defaultBaseUrl: 'https://api.groq.com/openai/v1' },
  {
    id: 'gemini',
    label: 'Gemini',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  { id: 'openrouter', label: 'OpenRouter', defaultBaseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'deepseek', label: 'DeepSeek', defaultBaseUrl: 'https://api.deepseek.com' },
  { id: 'custom', label: 'Custom', defaultBaseUrl: '' },
]

interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAiChatResponse {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

interface OpenAiModelsResponse {
  data?: Array<{ id?: string }>
  error?: { message?: string }
  models?: Array<{ id?: string; name?: string }>
}

export class ProviderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProviderError'
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim()
  if (!trimmed) throw new ProviderError('Missing base URL. Pick a provider preset or enter a custom URL.')
  try {
    const parsed = new URL(trimmed)
    return parsed.toString().replace(/\/$/, '')
  } catch {
    throw new ProviderError('Invalid base URL. Enter a full URL like https://api.example.com/v1')
  }
}

function buildHeaders(apiKey: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey.trim()}`,
  }
}

function toOpenAiMessages(messages: ChatMessage[], systemPrompt: string): OpenAiMessage[] {
  const payload: OpenAiMessage[] = []
  const trimmedSystem = systemPrompt.trim()
  if (trimmedSystem) {
    payload.push({ role: 'system', content: trimmedSystem })
  }

  for (const message of messages) {
    payload.push({ role: message.role, content: message.content })
  }

  return payload
}

export async function fetchProviderModels(settings: AppSettings): Promise<string[]> {
  if (!settings.apiKey.trim()) {
    throw new ProviderError('Missing API key. Add an API key in Settings to fetch models.')
  }

  const baseUrl = normalizeBaseUrl(settings.baseUrl)

  let response: Response
  try {
    response = await fetch(`${baseUrl}/models`, { headers: buildHeaders(settings.apiKey) })
  } catch {
    throw new ProviderError('Network failure while fetching models. Check your connection and base URL.')
  }

  let body: OpenAiModelsResponse | null = null
  try {
    body = (await response.json()) as OpenAiModelsResponse
  } catch {
    body = null
  }

  if (!response.ok) {
    const providerMessage = body?.error?.message
    throw new ProviderError(providerMessage ? `Provider error: ${providerMessage}` : 'Provider error while fetching models.')
  }

  const modelIds = body?.data?.map((m) => m.id).filter((id): id is string => Boolean(id))
  if (modelIds && modelIds.length > 0) {
    return modelIds
  }

  const altIds = body?.models
    ?.map((m) => m.id ?? m.name)
    .filter((id): id is string => Boolean(id))
  if (altIds && altIds.length > 0) {
    return altIds
  }

  throw new ProviderError('This provider did not return a compatible model list.')
}

export async function createAssistantReply(settings: AppSettings, history: ChatMessage[]): Promise<string> {
  if (!settings.apiKey.trim()) {
    throw new ProviderError('Missing API key. Add an API key in Settings or leave it blank to stay in mock mode.')
  }
  if (!settings.model.trim()) {
    throw new ProviderError('Missing model. Enter a model name in Settings.')
  }

  const baseUrl = normalizeBaseUrl(settings.baseUrl)

  const payload = {
    model: settings.model.trim(),
    messages: toOpenAiMessages(history, settings.systemPrompt),
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(settings.apiKey),
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ProviderError('Network failure while calling chat completions. Check your connection and base URL.')
  }

  let body: OpenAiChatResponse | null = null
  try {
    body = (await response.json()) as OpenAiChatResponse
  } catch {
    body = null
  }

  if (!response.ok) {
    const providerMessage = body?.error?.message
    throw new ProviderError(providerMessage ? `Provider error: ${providerMessage}` : 'Provider error from chat completions endpoint.')
  }

  const content = body?.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new ProviderError('Provider response did not include assistant message content.')
  }

  return content
}
