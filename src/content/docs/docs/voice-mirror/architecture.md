---
title: Architecture
description: Voice Mirror system design and components
---

# Voice Mirror Architecture

Voice Mirror is a three-process Electron application that combines voice I/O, AI providers, and MCP tools into a desktop overlay agent.

## System Overview

```
┌──────────────────────────────────────────────────┐
│              Electron Overlay                     │
│   (transparent, always-on-top, frameless)        │
│                                                   │
│   ┌─────────────┐  ┌──────────────────────────┐  │
│   │   Python     │  │     AI Provider          │  │
│   │   Backend    │  │  (Claude Code PTY        │  │
│   │  (Voice I/O) │  │   or OpenAI-compat)      │  │
│   └─────────────┘  └──────────────────────────┘  │
│                                                   │
│   ┌──────────────────────────────────────────┐   │
│   │         MCP Server (55 tools)            │   │
│   │   8 dynamically-loaded tool groups       │   │
│   └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

## Three Processes

### 1. Electron Main Process

The orchestrator. Manages windows, IPC, and all service modules.

**15 Modular Services:**

| Service | Purpose |
|---------|---------|
| ai-manager | Multi-provider AI routing |
| python-backend | Voice backend lifecycle |
| inbox-watcher | MCP inbox monitoring |
| screen-capture-watcher | Screenshot management |
| browser-watcher | CDP browser lifecycle |
| provider-detector | Auto-detect local LLM servers |
| push-to-talk | PTT key handling |
| logger | Structured logging |
| perf-monitor | Real-time CPU/memory stats |
| hotkey-manager | Global keyboard shortcuts |
| diagnostic-collector | System diagnostics |
| diagnostic-watcher | Diagnostic monitoring |
| platform-paths | Cross-platform path resolution |
| uiohook-shared | Low-level input hooks |
| update-checker | Application update checks |

### 2. Python Voice Backend

Handles all audio I/O with pluggable engines:

**Wake Word Detection:**
- OpenWakeWord — "Hey Claude" activation
- Configurable sensitivity and cooldown

**Speech-to-Text (STT):**

| Engine | Model | Speed | Accuracy |
|--------|-------|-------|----------|
| Parakeet (default) | NVIDIA NeMo ONNX | Fast (CPU) | Good |
| Whisper | OpenAI | Slower | Excellent |
| Faster-Whisper | CTranslate2 | Medium | Excellent |

**Text-to-Speech (TTS):**

| Engine | Voices | Features |
|--------|--------|----------|
| Kokoro (default) | 10 built-in | Fast ONNX, CPU-friendly |
| Qwen3-TTS | 9 presets + cloning | High quality, voice cloning from 3s audio |

**Three Activation Modes:**

| Mode | Trigger | Use Case |
|------|---------|----------|
| Wake Word | "Hey Claude" | Hands-free, background listening |
| Push-to-Talk | Mouse button 4/5 or hotkey | Quick questions |
| Call Mode | Always on | Continuous conversation |

### 3. AI Provider

Voice Mirror supports **11 AI providers** with automatic detection:

**Terminal-Based:**
- **Claude Code** (default) — Full PTY with MCP tools, vision, terminal execution

**Local APIs (Auto-Detected on Startup):**

| Provider | Port | Features |
|----------|------|----------|
| Ollama | 11434 | Vision (llava), auto-detect |
| LM Studio | 1234 | Auto-detect |
| Jan | 1337 | Auto-detect |

**Cloud APIs:**

| Provider | Features |
|----------|----------|
| OpenAI | GPT-4o with vision |
| Google Gemini | Vision support |
| Groq | Fast inference |
| Mistral | Multi-model |
| OpenRouter | Unified multi-model access |
| DeepSeek | Various models |
| Grok (xAI) | Vision support |
| Kimi (Moonshot) | Vision (K2.5) |

Switch between providers without restart. API keys auto-detected from environment variables.

## MCP Tools (55 Total, 8 Groups)

Tools load dynamically — only what's needed is active at any time.

| Group | Tools | Key Capabilities |
|-------|-------|-----------------|
| **core** (4) | claude_send, claude_inbox, claude_listen, claude_status | Voice I/O, presence tracking |
| **meta** (3) | load_tools, unload_tools, list_tool_groups | Dynamic tool management |
| **screen** (1) | capture_screen | Desktop screenshots |
| **memory** (6) | search, get, remember, forget, stats, flush | Hybrid semantic + keyword search |
| **voice-clone** (3) | clone_voice, clear_voice_clone, list_voice_clones | Voice cloning from audio |
| **browser** (14) | start, stop, navigate, screenshot, snapshot, act, search, fetch... | Full Chrome automation via CDP |
| **n8n** (22) | workflows CRUD, executions, credentials, nodes, tags, variables | Workflow automation |
| **diagnostic** (1) | pipeline_trace | Message flow tracing |

## Browser Automation

Full Chrome/Chromium control via Chrome DevTools Protocol (CDP):

- Navigate to URLs
- Click, type, fill forms
- Take screenshots of pages
- Accessibility snapshots (DOM as structured tree)
- Execute JavaScript
- Web search (Google via headless browser)
- Content extraction from URLs

The browser is isolated — it does NOT access your existing browser sessions, cookies, or logged-in accounts.

## UI States

### Floating Orb (Collapsed)

A 64px draggable circle with color-coded states:

| State | Color | Animation |
|-------|-------|-----------|
| Idle / Listening | Purple gradient | Gentle pulse |
| Recording | Pink/Red gradient | Fast pulse |
| Speaking | Blue/Cyan gradient | Wave effect |
| Thinking | Purple | Spin |

### Expanded Panel

Three pages accessible via sidebar:
- **Chat** — Message history with markdown rendering and tool visualization
- **Claude Code** — Embedded terminal with full Claude Code output
- **Settings** — Provider selection, voice config, audio devices, appearance

## Security Model

- **Embedded isolation** — Voice Mirror runs its own browser instance, separate from yours
- **Tool-mediated actions** — Every action flows through LLM → tool schema → controller
- **MCP tool gating** — Tool groups load on demand, LLM can only access loaded tools
- **Screen capture** — Triggered by tool calls or user request only, not passive

## Getting Started

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
npm install
npm start
```

See [Development](/docs/voice-mirror/development/) for full setup including the Python backend.
