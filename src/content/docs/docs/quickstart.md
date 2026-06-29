---
title: Quick Start
description: Get up and running with Voice Mirror in 5 minutes
---

# Quick Start

Voice Mirror is a voice-native IDE: you build real apps **by voice**, watch them render **live** in the **App Preview**, and the AI **sees and drives** the same running surface you do. The loop is simple — **voice → build → see → fix**.

This guide gets you there in about 5 minutes.

## 1. Install

Voice Mirror is in **alpha** and under active development. Build from source is the primary path today.

> **Installers are coming during alpha.** Code-signed installers and auto-update aren't ready yet. [Join the Discord](https://discord.com/invite/JBpsSFB7EQ) for alpha access and build announcements.

Clone from the [contextmirror](https://github.com/contextmirror) org and install dependencies:

```bash
git clone https://github.com/contextmirror/voice-mirror
cd voice-mirror
npm install
```

The repo has a Svelte frontend (`src/`) and a Rust/Tauri backend (`src-tauri/`) at its root. See the [Installation guide](/docs/installation/) for prerequisites and full setup.

## 2. Launch

```bash
npm run dev
```

The floating orb appears on your desktop. There are three ways to interact:

| Mode | How | Best For |
|------|-----|----------|
| **Wake Word** | Say "Hey Claude" (default) | Hands-free |
| **Push-to-Talk** | Hold the bound key/button (Windows) | Quick commands |
| **Call Mode** | Always-on listening | Continuous conversation |

## 3. The wow moment: build it, watch it, let the AI drive it

This is the loop Voice Mirror is built around. Ask it to build and launch a small app, then watch it come to life in the **App Preview** while the AI clicks through it.

> **"Hey Claude, build me a small to-do web app and launch it so I can see it."**

What happens:

1. **Voice → build** — the AI scaffolds the app, writes the code, and starts the dev server for you.
2. **See** — the running app streams **live, true-size** into the App Preview. You and the AI are looking at the *same* surface.
3. **Drive** — ask the AI to test it: **"Add a couple of tasks and check the box on the first one."** It reads the app's element tree, then clicks and types in the live preview while you watch.
4. **Fix** — spot something off? **"The checkbox doesn't strike through the text — fix that."** The AI edits the code, the preview reloads, and you verify it together.

The App Preview drives **web, Tauri, WebView2, and Electron** apps, and even **native Windows apps** (Notepad, Calculator, Settings) through the same interface — the AI can't tell which engine is underneath. Focus stays in sync: the preview auto-follows whichever window you or the AI last touched.

> **App Preview and native-app driving are Windows-only for now.** macOS and Linux support is planned.

## 4. A few more things to try

- **"Hey Claude, what's on my screen?"** — captures and analyzes your screen.
- **"Search for the latest Svelte 5 docs."** — web search via built-in browser automation.
- **"Remember that the API key lives in .env."** — stores to persistent memory across sessions.

## 5. Explore the workspace

Beyond the orb, Voice Mirror opens into a full VS Code-style IDE workspace:

- **Chat panel** — talk to your AI provider with full markdown rendering and inline tool-activity cards.
- **App Preview / live preview** — the see-and-drive surface, with dev-server detection and auto-start (Node and Python).
- **File tree + code editor** — CodeMirror 6 editor with syntax highlighting, go-to-definition, references, rename, and format via LSP.
- **Integrated terminals** — connected to AI providers, with dev-server start/stop/restart from the status bar.
- **Command palette** — quick file, line, and symbol navigation.

---

## What's Different?

### Without Voice Mirror

Your AI assistant:
- Forgets everything between conversations
- Can only respond to text — no voice, no screen awareness
- Can't see or interact with the apps you're building
- Lives in a separate window from your code

### With Voice Mirror

Your AI assistant:
- Lives as a floating orb, expandable to a full IDE workspace
- Responds to voice commands hands-free
- Builds apps by voice and watches them render live in the App Preview
- **Sees and drives** the running app — the same surface you watch
- Remembers project conventions and decisions across sessions
- Controls the browser, runs terminal commands, and edits files
- Provides **45 MCP tools across 5 groups** for deep integration
- Works with **75+ models via OpenCode**, plus Claude Code, Codex, Gemini CLI, and more

## Next Steps

- [Installation](/docs/installation/) — full setup guide with prerequisites and configuration
- [Voice Mirror Architecture](/docs/voice-mirror/architecture/) — how the App Preview and see-and-drive loop work
- [MCP Tools Reference](/docs/reference/mcp-tools/) — full tool documentation
