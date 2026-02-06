---
title: Quick Start
description: Get up and running with Context Mirror in 5 minutes
---

# Quick Start

Get Context Mirror running in minutes.

## Context Mirror (VSCode Extension)

### 1. Install a Local LLM

If you don't already have one running:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the recommended model
ollama pull qwen2.5-coder:14b
```

### 2. Install the Extension

Open VSCode and install Context Mirror from the marketplace, or:

```bash
code --install-extension contextmirror.context-mirror
```

### 3. Open a Project

Open any project in VSCode. Context Mirror will:

1. **Decode** your workspace — analyzing project structure, dependencies, and patterns
2. **Initialize memory** — setting up persistent storage for facts and lessons
3. **Activate hooks** — enabling policy enforcement for your LLM

### 4. Start Coding

Use the chat sidebar to interact with your local LLM. Context Mirror silently:

- Injects relevant context into every prompt
- Enforces read-before-edit policies
- Captures lessons from mistakes
- Remembers facts across sessions

---

## Voice Mirror (Desktop Overlay)

### 1. Clone and Install

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
```

### 2. Set Up the Voice Backend

```bash
cd python
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
cd ..
```

### 3. Launch

```bash
npm start
```

The floating orb appears on your desktop. Three ways to interact:

| Mode | How | Best For |
|------|-----|----------|
| **Wake Word** | Say "Hey Claude" | Hands-free |
| **Push-to-Talk** | Hold mouse button 4/5 | Quick questions |
| **Call Mode** | Always listening | Continuous conversation |

### 4. Try It

- **"Hey Claude, what's on my screen?"** — captures and analyzes your screen
- **"Search for flights to Paris"** — web search via browser automation
- **"Remember that the API key is in .env"** — stores to persistent memory
- Expand the panel with `Ctrl+Shift+V` for the full chat interface

---

## What's Different?

### Without Context Mirror

Your local LLM:
- Doesn't know your project structure
- Forgets everything between sessions
- Makes the same mistakes repeatedly
- Edits files it hasn't read

### With Context Mirror

Your local LLM:
- Understands your entire codebase instantly
- Remembers project conventions and decisions
- Learns from every mistake automatically
- Is prevented from making common errors

### With Voice Mirror

Your AI assistant:
- Lives as a floating orb on your desktop
- Responds to voice commands hands-free
- Can see your screen and analyze what's happening
- Controls your browser, runs terminal commands
- Automates workflows via n8n integration
- Works with 11 different AI providers

## Next Steps

- [Context Mirror Architecture](/docs/context-mirror/architecture/) — Understand how the VSCode extension works
- [Voice Mirror Architecture](/docs/voice-mirror/architecture/) — Understand the desktop overlay
- [MCP Tools Reference](/docs/reference/mcp-tools/) — Full tool documentation
