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

## Implemented in this PR

- React + TypeScript + Vite app scaffold
- Tailwind CSS styling pipeline
- Mobile-first cozy UI shell with pastel gradients and glassmorphism panels
- Top 3px context usage progress bar
- Bottom navigation with Chat, Memory, Journal, Diagnostics, and Settings tabs
- Chat screen with markdown message rendering
- Mock send flow: user message + local-only assistant mock response
- Local persistence for chat messages (localStorage)
- Settings form (Provider, Base URL, API key, Model, System prompt)
- Local persistence for settings (localStorage)
- Minimal PWA scaffolding via Vite PWA plugin

## Intentionally not implemented yet

- Real API calls or provider SDK integrations
- Backend services
- MCP, Mem0, QuickJS, file uploads, APK flows
- Real model welfare or diagnostics logic
- Production-grade auth or key management
