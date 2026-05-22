# Cozy Companion Foundation

A first foundation slice for a cozy AI companion web app using React + TypeScript + Vite.

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

## Implemented in this PR

- React + TypeScript + Vite app scaffold
- Tailwind CSS styling pipeline
- Mobile-first cozy UI shell with pastel gradients and glassmorphism panels
- Top 3px context usage progress bar
- Bottom navigation with Chat, Memory, Journal, Diagnostics, and Settings tabs
- Chat screen with markdown message rendering
- Local persistence for chat messages (localStorage)
- Settings form with provider presets, editable endpoints, and fetch models action
- OpenAI-compatible browser `fetch` provider service for models + chat completions
- Local-only mock mode fallback when API key is missing
- Minimal PWA scaffolding via Vite PWA plugin
