---
title: Installation
description: How to install and set up Voice Mirror
---

Voice Mirror is in **alpha** and under active development.

Voice Mirror is **Windows-first** today: the see-and-drive App Preview,
push-to-talk, and native-app driving currently run on Windows. macOS and Linux
support is planned but not available yet.

## Windows Installer (recommended)

Download the latest installer from the
[releases page](https://github.com/contextmirror/voice-mirror/releases/latest)
and run it. Installed builds **auto-update** to new stable releases.

> **The alpha installer is unsigned**, so Windows SmartScreen will warn you on
> first run. Click **More info → Run anyway**. Code signing is planned.

### Release channels

| Channel | What you get | Where |
|---------|--------------|-------|
| **Stable** | Tagged releases with release notes; auto-updates | [Latest release](https://github.com/contextmirror/voice-mirror/releases/latest) |
| **Nightly** | The dogfood channel — newest features, rougher edges | [Nightly build](https://github.com/contextmirror/voice-mirror/releases/tag/nightly) |

Nightly is what we run ourselves day to day. If something breaks on nightly,
tell us in the [Discord](https://discord.com/invite/JBpsSFB7EQ) — that's the
point of the channel.

## Build from Source

The project lives under the GitHub org [contextmirror](https://github.com/contextmirror).
The commands below assume the repo at
[github.com/contextmirror/voice-mirror](https://github.com/contextmirror/voice-mirror)
— if the exact repo name differs, check the org page for the current one.

### Prerequisites

- **Node.js** (with npm)
- **Rust** toolchain (install via [rustup.rs](https://rustup.rs))
- **System dependencies** for Tauri 2 — see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/)

No Python required. The entire voice pipeline (STT, TTS, VAD) runs natively in Rust.

### Clone and Run

```bash
git clone https://github.com/contextmirror/voice-mirror
cd voice-mirror
npm install
npm run dev
```

The repo has a root-level `src/` (Svelte 5 frontend) and `src-tauri/` (Rust
backend). `npm run dev` rebuilds the `voice-mirror-mcp` Rust binary, starts the
Vite dev server, and launches the Tauri app with hot reload.

### Build for Production

```bash
npm run build
```

This produces a platform-specific bundle in `src-tauri/target/release/bundle/`.
Unlike the shipped installer, local builds aren't code-signed and don't
auto-update.

## Voice Engine

Voice features are built into the Rust backend — no separate installation is
required.

| Component | Default | Notes |
|-----------|---------|-------|
| STT | Whisper (local, whisper.cpp) | Model `base`; `tiny` / `base` / `small` downloadable |
| TTS | Kokoro (local ONNX) | Runs locally |
| TTS (fallback) | Edge TTS | Free Microsoft cloud voices; used if the local model isn't present |
| VAD | Silero | Voice activity detection (ONNX) |

## AI Provider Setup

Voice Mirror connects to AI in three ways. You can switch providers without
restarting, and API keys are auto-detected from your environment.

### CLI Agents

Terminal-based agents that run inside Voice Mirror's integrated terminal:

- **Claude Code** — Anthropic's CLI agent
- **OpenCode**
- **Codex**
- **Gemini CLI**
- **Kimi CLI**

### Local API

Local model servers, auto-detected with no API key required:

- **Ollama**
- **LM Studio**
- **Jan**

### Cloud API Keys

Direct HTTP connections to cloud providers. Keys are picked up automatically from
environment variables:

| Variable | Provider |
|----------|----------|
| `ANTHROPIC_API_KEY` | Anthropic |
| `OPENAI_API_KEY` | OpenAI |
| `GOOGLE_API_KEY` | Gemini |
| `XAI_API_KEY` | Grok (xAI) |
| `GROQ_API_KEY` | Groq |
| `MISTRAL_API_KEY` | Mistral |
| `OPENROUTER_API_KEY` | OpenRouter |
| `DEEPSEEK_API_KEY` | DeepSeek |

## Configuration

Voice Mirror stores its configuration in the platform app data directory:

- **Windows**: `%APPDATA%\voice-mirror\`
- **macOS**: `~/Library/Application Support/voice-mirror/`
- **Linux**: `~/.config/voice-mirror/`

All settings are accessible through the in-app Settings panel. Configuration is
persisted via Tauri's Rust backend with atomic writes.

## Verify Installation

1. The floating orb appears on your desktop
2. Say "Hey Claude" — the orb pulses red when recording
3. Wait for the response — the orb pulses blue when speaking
4. Press `Ctrl+Shift+V` to expand the full workspace (editor, terminal, and App Preview)
