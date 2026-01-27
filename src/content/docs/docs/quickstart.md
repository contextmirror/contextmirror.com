---
title: Quick Start
description: Get up and running with Context Mirror in 5 minutes
---

# Quick Start

Get Context Mirror running in minutes.

## 1. Install a Local LLM

If you don't already have one running:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the recommended model
ollama pull qwen2.5-coder:14b
```

## 2. Install the Extension

Open VSCode and install Context Mirror from the marketplace, or:

```bash
code --install-extension contextmirror.context-mirror
```

## 3. Open a Project

Open any project in VSCode. Context Mirror will:

1. **Decode** your workspace — analyzing project structure, dependencies, and patterns
2. **Initialize memory** — setting up persistent storage for facts and lessons
3. **Activate hooks** — enabling policy enforcement for your LLM

## 4. Start Coding

Use the chat sidebar or inline completions. Context Mirror silently:

- Injects relevant context into every prompt
- Enforces read-before-edit policies
- Captures lessons from mistakes
- Remembers facts across sessions

## What's Different?

Without Context Mirror, your local LLM:
- Doesn't know your project structure
- Forgets everything between sessions
- Makes the same mistakes repeatedly
- Edits files it hasn't read

With Context Mirror, your local LLM:
- Understands your entire codebase instantly
- Remembers project conventions and decisions
- Learns from every mistake automatically
- Is prevented from making common errors

## Next Steps

- [Architecture](/docs/context-mirror/architecture/) — Understand how it works
- [Voice Mirror](/voice-mirror/) — Add voice control to your setup
