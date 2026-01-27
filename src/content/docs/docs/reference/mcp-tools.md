---
title: MCP Tools Reference
description: Complete reference for all MCP tools in the Context Mirror ecosystem
---

# MCP Tools Reference

The Context Mirror ecosystem provides MCP (Model Context Protocol) tools across both products.

## Context Mirror Tools (56 total)

Context Mirror exposes 56 tools across 10 modules. These are available to any MCP-compatible client including Claude Code.

Key modules include:
- **File Operations** — Read, write, edit, search files
- **Semantic Search** — Vector-based code search
- **Memory** — Persistent fact storage
- **Code Analysis** — LSP integration
- **Git Operations** — Repository management

## Voice Mirror Tools (14 total)

### Voice & Chat Communication

#### `claude_send`
Send a message to the Voice Mirror inbox. The message will be spoken via TTS.

```json
{
  "instance_id": "voice-claude",
  "message": "Hello! I've finished the task."
}
```

#### `claude_inbox`
Read messages from the inbox.

#### `claude_listen`
Wait for voice input from the user. Blocks until a message arrives or timeout.

```json
{
  "instance_id": "voice-claude",
  "from_sender": "nathan",
  "timeout_seconds": 60
}
```

#### `claude_status`
Update or query instance presence status.

### Memory

#### `memory_search`
Hybrid semantic + keyword search (70% vector, 30% BM25).

#### `memory_remember`
Store a memory with tier classification:
- **core** — Permanent facts
- **stable** — 7-day TTL
- **notes** — Session-scoped

#### `memory_get` / `memory_forget` / `memory_stats`
Retrieve, delete, or get statistics on stored memories.

### Screen & Browser

#### `capture_screen`
Take a screenshot of the current display.

#### `browser_search`
Web search via Serper API or Playwright fallback.

#### `browser_fetch`
Fetch and extract content from a URL with JavaScript rendering.

### Voice Cloning

#### `clone_voice`
Clone a voice from an audio URL or file path (3-5 seconds of audio).

#### `clear_voice_clone`
Reset to default TTS voice.

#### `list_voice_clones`
List all saved voice clones.
