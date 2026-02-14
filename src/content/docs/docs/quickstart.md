---
title: Quick Start
description: Get up and running with Voice Mirror in 5 minutes
---

# Quick Start

Get Voice Mirror running in minutes.

## 1. Clone and Install

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
```

## 2. Set Up the Voice Backend

```bash
cd python
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
cd ..
```

## 3. Launch

```bash
npm start
```

The floating orb appears on your desktop. Three ways to interact:

| Mode | How | Best For |
|------|-----|----------|
| **Wake Word** | Say "Hey Claude" | Hands-free |
| **Push-to-Talk** | Hold mouse button 4/5 | Quick questions |
| **Call Mode** | Always listening | Continuous conversation |

## 4. Try It

- **"Hey Claude, what's on my screen?"** — captures and analyzes your screen
- **"Search for flights to Paris"** — web search via browser automation
- **"Remember that the API key is in .env"** — stores to persistent memory
- Expand the panel with `Ctrl+Shift+V` for the full chat interface

---

## What's Different?

### Without Voice Mirror

Your AI assistant:
- Doesn't know your project structure or remember past sessions
- Forgets everything between conversations
- Can only respond to text — no voice, no screen awareness
- Can't interact with your browser, files, or workflows

### With Voice Mirror

Your AI assistant:
- Lives as a floating orb on your desktop
- Responds to voice commands hands-free
- Can see your screen and analyze what's happening
- Remembers project conventions and decisions across sessions
- Controls your browser, runs terminal commands
- Automates workflows via n8n integration
- Works with 11 different AI providers

## Next Steps

- [Voice Mirror Architecture](/docs/voice-mirror/architecture/) — Understand the desktop overlay
- [MCP Tools Reference](/docs/reference/mcp-tools/) — Full tool documentation
