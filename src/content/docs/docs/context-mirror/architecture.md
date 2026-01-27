---
title: Architecture
description: How Context Mirror works under the hood
---

# Architecture

Context Mirror uses a simple but powerful architecture: **let the LLM decide, catch tool calls, enforce via hooks, auto-correct mistakes**.

## Core Components

### Decode System
Converts your workspace into an LLM-digestible "cheat sheet":
- Auto-detects project type (Node, Python, Rust, Go, Java, .NET)
- Generates structured context that fits in context windows
- Updates incrementally as you work

### Hook System
Event-driven policy enforcement:
- **PreToolUse** — Validates before actions (e.g., read-before-edit)
- **PostToolUse** — Checks after actions (e.g., verify file writes)
- **Auto-correction** — Fixes common mistakes automatically
- **Queue-based review** — Human-in-the-loop for file writes

### Memory System
Three-tier persistent memory:
- **Core** — Permanent facts (project conventions, key decisions)
- **Stable** — Important context (7-day TTL)
- **Volatile** — Session-specific notes (4-hour TTL)

### Learning System
Self-improving without fine-tuning:
- **Lessons** — Captured mistakes/solutions, injected as rules
- **Patterns** — Learned "how this codebase does X"
- **Skills** — Process/workflow knowledge
- **Confidence** — Success rate tracking by domain

## MCP Integration

Context Mirror exposes 56 tools across 10 modules via the Model Context Protocol (MCP), making it compatible with Claude Code and other MCP-aware agents.

## Tech Stack

- **TypeScript** — ~50,000 lines
- **VSCode Extension API** — Editor integration
- **React** — Chat sidebar UI
- **Vector Embeddings** — nomic-embed-text for semantic search
- **SQLite** — Local database for memory and search index
