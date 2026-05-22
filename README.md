# Τεχνίκιον

**tekh-NEE-kee-on**  
A soft local shell for future AI conversations.

This project is a mobile-first React + TypeScript + Vite app focused on a cozy local-shell chat experience with real provider connectivity and local mock mode.

## Install

```bash
npm install
```

## Run development server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Current scope

- Soft, minimal chat shell UI with bottom tab scaffold (Chat, Memory, Journal, Diagnostics, Settings).
- Real provider chat completions via OpenAI-compatible HTTP APIs.
- Local mock chat fallback when API key is not configured.
- Settings persistence in browser localStorage.
- Fetch Models action in Settings for compatible providers.

## Provider configuration

Open **Settings** and configure:

- **Provider preset**: Groq, Gemini, OpenRouter, DeepSeek, or Custom.
- **Base URL**: prefilled from preset, editable.
- **API key**: stored in browser localStorage (not hidden).
- **Model**: model id used for chat completions.
- **System prompt**: sent as a system message when present.

Preset default base URLs:

- Groq: `https://api.groq.com/openai/v1`
- Gemini: `https://generativelanguage.googleapis.com/v1beta/openai/`
- OpenRouter: `https://openrouter.ai/api/v1`
- DeepSeek: `https://api.deepseek.com`
- Custom: user-entered URL

## Mock mode

If API key is blank, chat stays in **local mock mode**:

- User messages are saved normally.
- Assistant replies are generated locally and marked as mock.
- No network request is sent.

## Current limitations

- Non-streaming chat completions only.
- Fetch Models uses `/models` for OpenAI-compatible providers and gracefully reports incompatible responses.
- No web search, memory extraction, MCP, embeddings, file upload, tool calling, or diagnostics integration yet.
