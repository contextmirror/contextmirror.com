---
title: Introduction
description: Voice Mirror is a voice-native IDE — build real apps by voice, watch them render live, and let the AI see and drive them.
---

**Voice Mirror** is a **voice-native IDE**, built by [Context Mirror](https://contextmirror.com). You describe what you want out loud, watch it get built, and see it render **live** in a sandbox **App Preview** — the same running surface that the in-app AI can **see and drive** for itself. It runs as a floating orb on your desktop and is powered by Tauri 2, Rust, and Svelte 5.

The core loop is simple: **voice → build → see → fix.**

## The Problem

Today's AI coding assistants live inside chat windows. They are powerful reasoners, but they are trapped behind a text box:

- **They can't hear you.** You type everything, even when speaking would be faster.
- **They can't see what they built.** They emit code, but they never look at the running app the way you do.
- **They can't drive it.** They can't click the button, fill the form, or notice that the layout broke.
- **They forget you.** Every session starts from zero. Preferences, decisions, and context are lost.
- **They live in one window.** Your editor, terminal, AI, and the app under construction are scattered across separate tools.

You end up describing your own screen back to an assistant that can't act on it. The intelligence is there; the eyes and hands are not.

## The Solution

Voice Mirror closes the loop. Speak an idea, and it builds a real app. The app renders **live** in the **App Preview** — a true-size view of what's running. Crucially, the AI looks at that *same* surface: it can take a screenshot, read the element tree, and click and type inside the running app, then fix what it sees.

- **Hears you** — Wake word ("Hey Claude"), push-to-talk, or always-on call mode. Speak naturally and it understands.
- **Builds for you** — A full IDE with editor, terminals, dev-server management, and multi-provider AI, all driven by voice.
- **Sees and drives the app** — The App Preview streams the running app live, and the AI reads its UI and operates it like a user would.
- **Speaks back** — Local Kokoro TTS with an Edge TTS fallback. Responses are spoken aloud, sentence by sentence, and interruptible.
- **Remembers you** — Three-tier persistent memory (core, stable, notes) with hybrid semantic + keyword search survives across sessions.
- **Works with any AI** — CLI agents (Claude Code, OpenCode, Codex, Gemini CLI, Kimi CLI), local runtimes (Ollama, LM Studio, Jan), and cloud providers, with 75+ models available via OpenCode.

## App Preview — see and drive

The **App Preview** is the headline capability. It's a live, true-size view of the app you're building, and you and the AI watch the *same* running surface.

- **How the AI sees** — a live stream of the running app (CDP screencast for web / Tauri / WebView2 / Electron apps; Windows Graphics Capture for native windows).
- **How the AI drives** — it reads an accessibility / element tree as `@e{n}` references and clicks and types against them.
  - A **CDP** engine drives web, Tauri, WebView2, and Electron apps.
  - A **UI Automation** engine drives **native Windows apps** (Notepad, Calculator, Settings, Win32 / WinForms / WPF / Qt) through the same tool surface — the AI can't tell which engine is underneath.
- **Two-way focus sync** — the preview auto-follows whichever window you *or* the AI last touched.

The App Preview and native-app driving are **Windows-only for now.**

## Key Capabilities

### 45 MCP Tools Across 5 Groups

Voice Mirror exposes its capabilities to the AI through the Model Context Protocol (MCP). Tool groups load dynamically by profile and intent, so the AI only uses what it needs:

| Group | Always loaded | Tools | What It Does |
|-------|---------------|-------|-------------|
| **Core** | yes | 5 | Voice I/O, presence, inbox, logs |
| **Capture** | yes | 11 | App Preview: list/capture windows and browser, sandbox start/attach/snapshot/screenshot/click/type/close, port discovery |
| **Memory** | no | 6 | Persistent memory with hybrid search |
| **Browser** | no | 1 | Unified `browser_action` dispatching ~50 sub-actions (navigate, click, type, screenshot, snapshot, search, fetch, cookies, storage…) |
| **n8n** | no | 22 | Workflow, execution, credential, tag, and node automation |

That's **45 tools across 5 groups**. Unused groups auto-unload after a stretch of idle calls to keep the AI's context lean.

### Voice-native IDE

A VS Code-style development environment built into Voice Mirror, all reachable by voice:

- **Code editor** — CodeMirror 6 with per-tab buffers, syntax highlighting, command palette, and Go-to-File / Line / Symbol.
- **Language intelligence** — LSP client for definitions, references, rename, and formatting.
- **Terminals** — integrated terminals connected to AI providers.
- **Dev-server manager** — Node and Python project detection with auto-start (and venv setup), plus start/stop/restart from the status bar.
- **App Preview** — the live see-and-drive surface described above.

### Voice pipeline

- **Speech to text** — Whisper running locally (whisper.cpp), default model `base`.
- **Text to speech** — Kokoro running locally (ONNX), with a free Microsoft **Edge TTS** cloud fallback when the local model isn't present.
- **Activation** — Wake Word (default, "Hey Claude"), Push-to-Talk (Windows), or always-on Call Mode. Silero VAD handles voice activity detection.

### Persistent memory

Three tiers — core, stable, and notes — with hybrid semantic + keyword search, so preferences, decisions, and context carry forward across sessions.

## Platforms

Voice Mirror is **Windows-first** today, with full features including App Preview, native-app driving, and push-to-talk. **macOS and Linux are coming.**

Built with Tauri 2 and Rust for the backend (the entire voice pipeline and the MCP server are native Rust — no Python, no Electron runtime) and Svelte 5 for the frontend. Lightweight by design.

## Getting Started

Voice Mirror is in **alpha** and under active development. Installers aren't shipping yet, so the way in today is to **build from source** — or **[join the Discord](https://discord.com/invite/JBpsSFB7EQ) for alpha access** as installers come online.

### From Source

```bash
git clone https://github.com/contextmirror/voice-mirror.git
cd voice-mirror
npm install
npm run dev
```

The repo is laid out with `src/` (Svelte frontend) and `src-tauri/` (Rust backend) at the root.

The floating orb appears on your desktop. Say "Hey Claude" to start talking, then describe the app you want to build.

For the full setup including the Rust toolchain and AI provider configuration, see the [Installation](/docs/installation/) guide. For a hands-on walkthrough, see the [Quick Start](/docs/quickstart/). To go deeper, browse the [MCP tools reference](/docs/reference/mcp-tools/) and the [architecture overview](/docs/voice-mirror/architecture/).
