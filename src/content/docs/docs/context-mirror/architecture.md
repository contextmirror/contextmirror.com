---
title: Architecture
description: How Context Mirror works under the hood
---

# Context Mirror Architecture

Context Mirror uses a simple but powerful architecture: **let the LLM decide, catch tool calls, enforce via hooks, auto-correct mistakes**.

This philosophy replaced 5,000 lines of complex classification code with ~450 lines in `TurnController.ts`.

## Core Components

### TurnController

The main orchestrator. A simple turn-based loop:

```
User Message → Stream to LLM → Extract Tool Calls → Execute with Hooks → Loop or Finalize
```

The LLM makes all decisions. Hooks enforce policy. The controller just orchestrates.

### Decode System

Converts your workspace into an LLM-digestible "cheat sheet":

- Auto-detects project type (Node, Python, Rust, Go, Java, .NET)
- Generates structured context (file tree, dependencies, conventions)
- Fits within context windows (16K-32K tokens)
- Updates incrementally as you work

### Hook Engine

Event-driven policy enforcement — the key innovation:

- **PreToolUse** — Validates before actions (e.g., must read file before editing)
- **PostToolUse** — Checks after actions (e.g., verify file writes)
- **Auto-correction** — Fixes common mistakes automatically
- **Queue-based review** — Human-in-the-loop for file writes

Hooks replace classifier-based routing with deterministic policy enforcement. The LLM doesn't need to "know" the rules — hooks enforce them.

### Memory System

Three-tier persistent memory shared between Claude and local LLMs:

| Tier | TTL | Use Case |
|------|-----|----------|
| **Core** | Permanent | Project conventions, key decisions, user preferences |
| **Stable** | 7 days | Important context, active decisions |
| **Volatile** | 4 hours | Session-specific notes |

Built on SQLite with FTS5 for full-text search.

### Learning System

Self-improving without fine-tuning:

| Feature | Tool | How It Works |
|---------|------|-------------|
| **Lessons** | `record_lesson` | Captured mistakes/solutions, injected into system prompt |
| **Patterns** | `record_pattern` | Code examples of "how this codebase does X" |
| **Skills** | `record_skill` | Process and workflow knowledge |
| **Confidence** | `record_outcome` | Success rate tracking by domain |

Lessons are the most impactful — they turn errors into permanent rules without any model retraining.

## System Prompt

The system prompt contains **13 CRITICAL RULES** that define the LLM's behavior:

1. Always read a file before editing it
2. Track task progress with todos
3. Use semantic search before guessing file locations
4. And 10 more guardrails...

These rules, combined with hook enforcement, are what produce the +33% performance lift.

## Multi-Agent Collaboration

Three AIs can work together on the same workspace:

| Agent | Role | How |
|-------|------|-----|
| **Browser Claude** | Eyes & voice — sees UI, takes screenshots, verifies UX | Via code-server at localhost:8080 |
| **Claude Code** | Hands — edits files, runs commands, builds/tests | MCP tools + terminal |
| **Local LLM (Qwen)** | Quick tasks — real-time responses, simple operations | Context Mirror sidebar |

Communication channels:
- **code-server** — Browser Claude types into Context Mirror sidebar
- **Relay API** — Async message passing via MCP inbox tools
- **Voice Mirror** — Two-way voice conversation

## MCP Integration

Context Mirror exposes **56 tools across 10 modules** via the Model Context Protocol (MCP). These are available to Claude Code and other MCP-aware agents:

- **File Operations** — Read, write, edit, search files
- **Semantic Search** — Vector-based code discovery (nomic-embed-text)
- **Memory** — Remember, recall, forget across sessions
- **Code Analysis** — LSP integration, dependency tracking
- **Git Operations** — Repository management
- **Delegation** — Assign tasks between agents
- **Learning** — Record lessons, patterns, skills, outcomes

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Extension | TypeScript (~50K lines) |
| Editor | VSCode Extension API |
| UI | React (chat sidebar) |
| Embeddings | nomic-embed-text for semantic search |
| Database | SQLite + FTS5 |
| Testing | Jest (919 unit tests) + custom harness (100 behavioral tests) |
| CI/CD | lint → type-check → test → build → coverage → package |
