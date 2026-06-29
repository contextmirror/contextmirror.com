---
title: Architecture
description: Voice Mirror system design and components
---

# Voice Mirror Architecture

Voice Mirror is a **voice-native IDE**: you build real desktop apps and websites by voice, watch them render live in a sandbox **App Preview**, and the in-app AI can **see and drive** the running app — the same surface you watch. The north-star loop is **voice → build → see → fix**.

It is a Tauri 2 desktop application with a Rust backend and a Svelte 5 frontend. It runs as a floating orb overlay that expands into a full VS Code-style workspace. Voice, screen awareness, terminal, and browser automation are supporting capabilities around the see-and-drive core.

Voice Mirror is currently in **alpha**, under active development, and **Windows-first**. The App Preview see-and-drive loop, native-app driving, and push-to-talk are Windows-only today; macOS and Linux support is planned.

## System Overview

```
Tauri 2 desktop app (transparent, always-on-top, frameless)
  |
  +-- Rust backend (src-tauri/)
  |     Voice pipeline: STT (Whisper / whisper.cpp), TTS (Kokoro + Edge fallback),
  |                      VAD (Silero), wake word (OpenWakeWord)
  |     App Preview: live capture + see-and-drive (CDP + UI Automation engines)
  |     MCP server: 45 tools across 5 groups (native Rust binary, stdio JSON-RPC)
  |     Providers: CLI agents (PTY) + local API + cloud API
  |     IPC: Named pipe (length-prefixed JSON) between MCP binary and Tauri app
  |     Services: capture/stream, window-follow, browser bridge, dev-server
  |               manager, file/inbox watchers, input hook, logger
  |
  +-- Svelte 5 frontend (src/)
  |     VS Code-style IDE: command palette, editor tabs, file tree, LSP,
  |                        integrated terminals, dev-server status bar, chat
  |     Floating orb overlay with animated voice states
  |
  +-- Vite build system (ghostty-web WASM terminal, CodeMirror 6 editor)
```

## App Preview — See and Drive

App Preview is the centerpiece of the architecture. It is a live, true-size view of the app being built, so you and the AI look at the **same running surface**.

**How the AI sees** — a live stream of the running app:

| Source | Capture method |
|--------|----------------|
| Web / Tauri / WebView2 / Electron | CDP screencast |
| Native Windows windows | Windows Graphics Capture (MJPEG to localhost) |

**How the AI drives** — it reads an accessibility/element tree exposed as `@e{n}` refs, then clicks and types against those refs. There are **two engines behind one identical tool surface**:

| Engine | Drives | Notes |
|--------|--------|-------|
| **CDP** | Web, Tauri, WebView2, Electron apps | AX tree via `Accessibility.getFullAXTree`; transport-agnostic parser shared between the in-process Lens webview (WebView2 COM) and external apps launched with `--remote-debugging-port` (CDP WebSocket) |
| **UI Automation (UIA)** | Native Windows apps — Notepad, Calculator, Settings, Win32 / WinForms / WPF / Qt | Microsoft UI Automation COM API on a dedicated MTA worker thread |

Both engines emit the same `- {role} "{name}" @e{n}` tree lines and the same JSON shape, so the AI cannot tell which engine is underneath. Driving a native, non-web Windows app through the same `@ref` model that it uses for websites is genuinely novel beyond a typical IDE.

**Two-way focus sync (window-follow):** an OS focus-event hook (`SetWinEventHook`) arbitrates between the window the *user* last brought to the foreground and the window *Claude* last drove, with the most-recent action winning (plus short hysteresis to avoid thrash). The preview auto-follows whichever window was last touched, and survives a window closing by re-pointing to a surviving window.

App Preview and native-app driving are **Windows-only today.**

The MCP tools behind App Preview live in the **capture** group: `sandbox_start`, `sandbox_attach`, `sandbox_snapshot`, `sandbox_screenshot`, `sandbox_click`, `sandbox_type`, `sandbox_close_window`, plus `capture_list_windows`, `capture_window`, `capture_browser`, and `list_ports`.

## Two Binaries, One Crate

Voice Mirror compiles into two Rust binaries from a single Cargo crate.

### 1. Tauri App Binary

The main desktop application. It manages windows, IPC, the voice pipeline, App Preview capture/streaming, providers, and the backend services (capture/stream, window-follow, browser bridge, dev-server manager, file watcher, inbox watcher, input hook, logger).

### 2. MCP Binary (`voice-mirror-mcp`)

A separate native Rust binary that implements the MCP (Model Context Protocol) server. It speaks stdio JSON-RPC to AI agents (such as Claude Code) and talks to the Tauri app over a named pipe (with a file-inbox fallback).

**Key files:**
- `src-tauri/src/bin/mcp.rs` — binary entry point
- `src-tauri/src/mcp/server.rs` — JSON-RPC protocol handler
- `src-tauri/src/mcp/tools.rs` — tool registry (45 tools, 5 groups)
- `src-tauri/src/mcp/pipe_router.rs` — concurrent message routing

**Communication flow:**

```
Claude Code <-> stdio JSON-RPC <-> voice-mirror-mcp <-> named pipe <-> Tauri app
```

> The Electron / Node MCP server still in the repo is **legacy** and is not the active target.

## Voice Pipeline

The entire voice pipeline is native Rust — no Python backend.

**Speech-to-Text (STT):**

| Engine | Notes |
|--------|-------|
| Whisper (local, whisper.cpp) | Default; model size `base` (tiny/base/small downloadable) |

**Text-to-Speech (TTS):**

| Engine | Notes |
|--------|-------|
| Kokoro (local ONNX) | Default; runs on CPU |
| Edge TTS | Free Microsoft cloud voices; automatic fallback when the local Kokoro model is not present |

**Voice Activity Detection (VAD):** Silero ONNX, with an energy-based fallback.

**Wake word:** OpenWakeWord, default phrase "hey_claude".

TTS is sentence-level streaming and interruptible.

**Activation Modes:**

| Mode | Trigger | Use Case |
|------|---------|----------|
| Wake Word (default) | "Hey Claude" | Hands-free, background listening |
| Push-to-Talk (Windows) | Mouse button or hotkey | Quick questions |
| Call Mode | Always on | Continuous conversation |

## AI Providers

Switch providers without restarting; API keys are auto-detected from environment variables.

**CLI agents (spawned in a PTY terminal):**
Claude Code, OpenCode, Codex, Gemini CLI, Kimi CLI.

**Local API providers (auto-detected):**
Ollama, LM Studio, Jan.

**Cloud API providers:**

| Provider | |
|----------|---|
| OpenAI | Anthropic |
| Google Gemini | Grok (xAI) |
| Groq | Mistral |
| OpenRouter | DeepSeek |

75+ models are also reachable via OpenCode's gateway.

## IPC: Named Pipes

The Tauri app and MCP binary communicate over Windows named pipes using length-prefixed JSON frames.

- **`protocol.rs`** — defines the `McpToApp` and `AppToMcp` message enums
- **`pipe_server.rs`** (Tauri side) — dispatches incoming requests to handlers
- **`pipe_client.rs`** (MCP side) — connects and sends/receives frames
- **`pipe_router.rs`** (MCP side) — routes responses by `request_id` (oneshot for browser/sandbox responses, mpsc for user messages)

## Browser Automation

Browser automation is **CDP-based**. The MCP `browser_action` tool routes through the named pipe to the Tauri app's in-process Lens WebView2, which is driven via WebView2's `CallDevToolsProtocolMethod` (CDP). Accessibility snapshots use `Accessibility.getFullAXTree`, parsed into the same `@e{n}` ref map that subsequent click/type/etc. actions target — the same CDP path and AX-tree parser the web/Tauri/Electron App Preview uses.

- **`services/browser_bridge.rs`** — dispatches browser actions; uses WebView2 `ExecuteScript` for JS return values, `CapturePreview` for screenshots, and `CallDevToolsProtocolMethod` for CDP
- **`services/cdp.rs`** — transport-agnostic AX-tree parser and `@ref` model, shared by the browser bridge and the sandbox CDP path
- Direct HTTP sub-actions (search, fetch) use `reqwest` without the pipe

## MCP Tools (45 Total, 5 Groups)

Tools load dynamically — only what's needed is active at any time — and auto-unload after roughly 15 idle calls. The default `voice-assistant` profile loads **core + memory + browser** (with **capture** always loaded on top). See the [MCP Tools Reference](/docs/reference/mcp-tools/) for the complete list.

| Group | Always loaded | Tools | Count |
|-------|---------------|-------|-------|
| **core** | yes | `voice_send`, `voice_inbox`, `voice_listen`, `voice_status`, `get_logs` | 5 |
| **capture** | yes | App Preview see-and-drive: `sandbox_*` (start/attach/snapshot/screenshot/click/type/close_window), `capture_list_windows`, `capture_window`, `capture_browser`, `list_ports` | 11 |
| **memory** | no | `memory_search`, `memory_get`, `memory_remember`, `memory_forget`, `memory_stats`, `memory_flush` | 6 |
| **browser** | no | `browser_action` — one unified tool dispatching ~50 sub-actions (navigate, click, type, screenshot, snapshot, search, fetch, cookies, storage, …) | 1 |
| **n8n** | no | Workflow / execution / credential / tag / node automation | 22 |

## VS Code-Style IDE Surface

The expanded panel is a multi-panel workspace combining a code editor, file tree, live browser preview, integrated terminals, and chat.

- **Command palette** with Go-to-File / Line / Symbol
- **LSP integration** — definitions, references, rename, format
- **Per-tab editor buffers** — CodeMirror 6 (JS, TS, Rust, CSS, HTML, JSON, Markdown, Python) with dirty indicators and a diff viewer
- **Integrated terminals** — xterm / ghostty-web WASM emulator
- **Dev-server manager** — Node and Python detection / auto-start (including venv setup), with bottom status-bar start / stop / restart
- **Real-time chat streaming** with inline tool-activity cards
- **First-run "Get Started" 9-step tutorial**

The live browser preview is a native WebView2 child window positioned by absolute pixel coordinates so it renders above DOM elements; panel resizing syncs bounds via a ResizeObserver.

## Memory

A 3-tier persistent memory system (core / stable / notes) with hybrid semantic + keyword search, exposed through the `memory` MCP group.

## Self-Diagnostics

Voice Mirror runs runtime self-diagnostics: component health contracts, crash/hang self-reporting, and structured logging routed into per-channel Output logs (`app`, `cli`, `voice`, `mcp`, `browser`, `frontend`, `preview`, plus dynamic per-project channels). Logs are queryable from the AI side via the `get_logs` tool.

## UI States

### Floating Orb (Collapsed)

A draggable circle with animated state indicators:

| State | Animation |
|-------|-----------|
| Idle / Listening | Gentle pulse |
| Recording | Fast pulse |
| Speaking | Wave effect |
| Thinking | Spin |

### Theme System

- Colorblind-safe default preset, plus a Light preset
- Custom themes — import / export as JSON, with real-time preview

## Security Model

- **In-process browser** — browser tools drive the built-in WebView2 (via CDP), isolated from your everyday browser sessions
- **Tool-mediated actions** — every action flows through LLM → tool schema → handler
- **MCP tool gating** — groups load on demand; the LLM can only call loaded tools
- **Capture on request** — App Preview capture and screenshots are triggered by tool calls or user request, not passive
- **Destructive tool confirmation** — tools like `memory_forget` require explicit confirmation

## Getting Started

```bash
git clone https://github.com/contextmirror/voice-mirror
npm install
npm run dev
```

See [Development](/docs/voice-mirror/development/) for the full setup, including Rust toolchain requirements.
</content>
</invoke>
