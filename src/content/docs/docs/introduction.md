---
title: Introduction
description: What is Context Mirror and why does it exist?
---

# Introduction to Context Mirror

**Context Mirror** is an ecosystem of AI-powered developer tools that make local LLMs punch above their weight through intelligent scaffolding.

## The Problem

Local LLMs (Qwen, Devstral, etc.) are fast, private, and free — but they struggle with:

- Understanding large codebases
- Remembering context across sessions
- Following project conventions
- Making changes without breaking things

Cloud-based assistants (Copilot, Cursor) solve some of these but require sending your code to external servers. **Context Mirror keeps everything local.**

## The Solution

Context Mirror provides a cognitive operating system that gives local models the awareness and guardrails they need:

- **Smart Context Injection** — Auto-decodes your workspace into LLM-digestible format
- **Self-Learning System** — Captures mistakes as lessons, learns patterns, builds skills
- **Persistent Memory** — Three-tier memory (core, stable, volatile) across sessions
- **Hook Enforcement** — Event-driven policies that catch mistakes before they happen
- **Semantic Search** — Find code by meaning, not keywords
- **Multi-Agent Collaboration** — Browser Claude + Claude Code + local LLMs working together

## Proven Results

- **+33% performance lift** from scaffolding alone (67% → 100% on behavioral tests)
- **14B with scaffolding > 70B without** — smaller models outperform larger ones
- **919 unit tests**, 100 behavioral tests, 92% pass rate

## Products

### Context Mirror (VSCode Extension)

The core product. A VSCode extension (~50K lines of TypeScript) that scaffolds your local LLM with:

- **Decode System** — Codebase "vision" for local LLMs
- **40+ tools** for file operations, semantic search, code analysis, git
- **Hook Engine** — Automatic guardrails (read-before-edit, queue-based review)
- **Learning System** — Lessons, patterns, skills, and confidence tracking
- **56 MCP tools** across 10 modules, compatible with Claude Code

### Voice Mirror (Desktop Overlay)

A voice-controlled AI agent overlay for your entire computer. Voice Mirror combines:

- **Always-on floating orb** — Tiny overlay that lives on your desktop
- **Voice-first interaction** — Wake word ("Hey Claude"), push-to-talk, or always-on
- **Screen awareness** — Can see and analyze what's on your screen
- **55 MCP tools** across 8 dynamically-loaded groups
- **11 AI providers** — Claude Code, Ollama, LM Studio, OpenAI, Gemini, and more
- **Browser automation** — Full Chrome control via CDP (navigate, click, type, screenshot)
- **n8n integration** — 22 tools for workflow automation
- **Voice cloning** — Clone any voice from a 3-second audio sample
- **Cross-platform** — Windows, macOS, Linux

## Getting Started

1. **Context Mirror**: Install the VSCode extension and have a local LLM running
2. **Voice Mirror**: Download the desktop app — it works standalone or alongside Context Mirror

See the [Installation](/docs/installation/) guide for detailed setup instructions.
