---
title: Introduction
description: What is Context Mirror and why does it exist?
---

# Introduction to Context Mirror

**Context Mirror** is a VSCode extension that makes local LLMs punch above their weight through intelligent scaffolding.

## The Problem

Local LLMs (Qwen, Devstral, etc.) are fast, private, and free — but they struggle with:

- Understanding large codebases
- Remembering context across sessions
- Following project conventions
- Making changes without breaking things

## The Solution

Context Mirror provides a cognitive operating system that gives local models the awareness and guardrails they need:

- **Smart Context Injection** — Auto-decodes your workspace into LLM-digestible format
- **Self-Learning System** — Captures mistakes as lessons, learns patterns, builds skills
- **Persistent Memory** — Three-tier memory (core, stable, volatile) across sessions
- **Hook Enforcement** — Event-driven policies that catch mistakes before they happen
- **Semantic Search** — Find code by meaning, not keywords
- **Multi-Agent Collaboration** — Browser Claude + Claude Code working together

## Proven Results

- **+33% performance lift** from scaffolding alone (67% → 100% on behavioral tests)
- **14B with scaffolding > 70B without** — smaller models outperform larger ones
- **919 unit tests**, 100 behavioral tests, 92% pass rate

## Products

### Context Mirror (VSCode Extension)
The core product. A VSCode extension that scaffolds your local LLM with context injection, memory, lessons, and hooks.

### Voice Mirror (Desktop Overlay)
A companion desktop overlay that adds voice control, screen awareness, and multi-AI provider support. Free and open source.

## Getting Started

1. Install the VSCode extension
2. Have a local LLM running (Ollama, LM Studio, or Jan)
3. Open any project — Context Mirror automatically decodes your workspace

See the [Installation](/docs/installation/) guide for detailed setup instructions.
