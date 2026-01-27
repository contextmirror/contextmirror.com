---
title: Architecture
description: Voice Mirror system design and components
---

# Voice Mirror Architecture

Voice Mirror is a three-process Electron application that combines voice I/O, AI providers, and MCP tools into a desktop overlay.

## System Overview

```
┌──────────────────────────────────────────┐
│         Electron Overlay                  │
│  (transparent, always-on-top, frameless) │
├──────────────┬───────────────────────────┤
│              │                           │
│  Python      │    AI Provider            │
│  Backend     │    (Claude Code PTY       │
│  (Voice I/O) │     or OpenAI-compat)     │
└──────────────┴───────────────────────────┘
```

## Three Processes

### 1. Electron Main Process
- Window management (transparent overlay, tray icon)
- IPC orchestration between Python, AI, and MCP
- 8 modular services
- Multi-provider system (11+ providers)

### 2. Python Voice Backend
- **Wake word detection** — "Hey Claude" via OpenWakeWord
- **Speech-to-text** — Parakeet (fast) or Whisper (accurate)
- **Text-to-speech** — Kokoro (10 voices) or Qwen3-TTS (voice cloning)
- **Three activation modes** — Wake word, call mode, push-to-talk

### 3. AI Provider
**Claude Code PTY** (default):
- Full terminal with MCP tools
- Vision API support
- Watches inbox via `claude_listen`

**OpenAI-compatible API**:
- Local: Ollama, LM Studio, Jan (auto-detected)
- Cloud: OpenAI, Gemini, Groq, Mistral, OpenRouter, DeepSeek, Grok

## MCP Tools (14 Total)

| Category | Tools |
|----------|-------|
| Voice/Chat | `claude_send`, `claude_inbox`, `claude_listen`, `claude_status` |
| Memory | `memory_search`, `memory_get`, `memory_remember`, `memory_forget`, `memory_stats` |
| Screen & Browser | `capture_screen`, `browser_search`, `browser_fetch` |
| Voice Cloning | `clone_voice`, `clear_voice_clone`, `list_voice_clones` |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/contextmirror/voice-mirror-electron

# Install dependencies
npm install

# Start the app
npm start
```

See [Development](/docs/voice-mirror/development/) for full setup including the Python backend.
