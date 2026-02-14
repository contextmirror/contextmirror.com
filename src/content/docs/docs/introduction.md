---
title: Introduction
description: What is Voice Mirror and why does it exist?
---

# Introduction to Voice Mirror

**Voice Mirror** is a voice-controlled AI agent overlay for your desktop, built by [Context Mirror](https://contextmirror.com). It turns any AI model into a hands-free assistant that can hear you, see your screen, control your browser, and remember everything across sessions.

## The Problem

Today's AI assistants live inside chat windows. They are powerful reasoners, but they are trapped behind a text box:

- **They can't hear you.** You type everything, even when speaking would be faster.
- **They can't see your screen.** You screenshot, crop, paste, and describe what you are looking at.
- **They can't act on your behalf.** You copy their suggestions and run them yourself.
- **They forget you.** Every session starts from zero. Preferences, decisions, and context are lost.
- **They live in one app.** Switch windows and your assistant is gone.

You end up spending more time wrangling the interface than getting help. The assistant is smart, but it is blind, deaf, and amnesiac.

## The Solution

Voice Mirror sits as a floating orb on your desktop, always available, never in the way. It bridges the gap between AI intelligence and real-world interaction:

- **Hears you** — Wake word detection ("Hey Claude"), push-to-talk, or always-on call mode. Speak naturally and it understands.
- **Sees your screen** — Multi-monitor screenshot capture and analysis. Ask "what's on my screen?" and it tells you.
- **Acts on your behalf** — Runs terminal commands, automates browser workflows, manages files, and orchestrates n8n automations.
- **Speaks back** — Seven TTS engines including real-time voice cloning from a 3-second audio sample. Responses are spoken aloud, not just displayed.
- **Remembers you** — Three-tier persistent memory (core, stable, notes) survives across sessions. Your preferences, decisions, and context carry forward.
- **Works with any AI** — 75+ models via Claude Code, OpenCode, Ollama, LM Studio, OpenAI, Gemini, Groq, and more. Bring your own model or use a cloud provider.

## Key Capabilities

### 58 MCP Tools Across 8 Groups

Voice Mirror exposes a rich set of tools to the AI through the Model Context Protocol (MCP). Tool groups load dynamically so the AI only uses what it needs:

| Group | Tools | What It Does |
|-------|-------|-------------|
| **Core** | 4 | Voice I/O, presence, inbox |
| **Memory** | 6 | Persistent memory with semantic search |
| **Browser** | 16 | Full Chrome automation via CDP |
| **n8n** | 22 | Workflow automation and orchestration |
| **Screen** | 1 | Multi-monitor screenshot capture |
| **Voice Clone** | 3 | Clone voices from audio samples |
| **Diagnostic** | 1 | Pipeline tracing and debugging |
| **Facades** | 3 | Token-efficient single-tool wrappers |

### Browser Automation

Full Chrome DevTools Protocol integration. The AI can open tabs, navigate, click, type, fill forms, take screenshots, read accessibility trees, manage cookies and storage, and run Google searches — all hands-free.

### Workflow Automation

22 n8n integration tools for managing workflows, executions, credentials, tags, variables, and nodes. Build and trigger automations through voice commands.

### Voice Cloning

Clone any voice from a 3-second audio sample using Qwen3-TTS. Nine preset speakers plus unlimited custom clones. GPU recommended for real-time performance.

### Cross-Platform

Voice Mirror runs on Windows, macOS, and Linux. The Electron shell provides the overlay and UI, while a Python backend handles the voice pipeline (wake word, speech-to-text, text-to-speech, voice activity detection).

## Getting Started

Getting Voice Mirror running takes three steps:

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install && npm start
```

The floating orb appears on your desktop. Say "Hey Claude" to start talking.

For the full setup including the Python voice backend and AI provider configuration, see the [Installation](/docs/installation/) guide. For a hands-on walkthrough, see the [Quick Start](/docs/quickstart/).
