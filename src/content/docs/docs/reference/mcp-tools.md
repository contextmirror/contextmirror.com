---
title: MCP Tools Reference
description: Complete reference for all MCP tools in the Context Mirror ecosystem
---

# MCP Tools Reference

The Context Mirror ecosystem provides MCP (Model Context Protocol) tools across both products, enabling Claude Code and other MCP-aware agents to interact with the system.

## Context Mirror Tools (56 total)

Context Mirror exposes 56 tools across 10 modules:

### File Operations
- **read_file** / **write_file** / **edit_file** — File CRUD operations
- **search_files** — Glob-based file search
- **list_directory** — Directory listing

### Semantic Search
- **semantic_search** — Vector-based code discovery using nomic-embed-text
- **grep_search** — Pattern-based content search

### Memory
- **remember** — Store a fact with tier classification (core/stable/volatile)
- **recall** — Search memory with hybrid semantic + keyword matching
- **forget** — Remove a stored memory

### Code Analysis
- **get_symbols** — LSP-powered symbol extraction
- **get_references** — Find all references to a symbol
- **analyze_dependencies** — Dependency graph analysis

### Learning
- **record_lesson** — Capture mistakes and solutions (injected on Decode)
- **record_pattern** — Record codebase patterns
- **record_skill** — Record workflow knowledge
- **record_outcome** — Track success/failure for confidence calibration

### Delegation
- **query_local_llm** — Ask the local LLM a question
- **delegate_task** — Assign work to the local LLM
- **get_work_panel_state** — Check todos, pending writes, artifacts

### Git Operations
- **git_status** / **git_diff** / **git_log** — Repository state
- **git_commit** — Create commits

### Diagnostics
- **get_devlogs** — Real-time hook execution, tool parsing, errors
- **get_codebase_summary** — Doc drift detection

---

## Voice Mirror Tools (55 total, 8 groups)

Voice Mirror tools load dynamically in groups. Use `load_tools` / `unload_tools` to manage what's active.

### Core Group (4 tools) — Always loaded

#### `claude_send`
Send a message to the Voice Mirror inbox. The message will be spoken via TTS.

```json
{
  "instance_id": "voice-claude",
  "message": "Hello! I've finished the task.",
  "thread_id": "voice-mirror"
}
```

#### `claude_inbox`
Read messages from the inbox. Supports filtering by sender and read status.

```json
{
  "instance_id": "voice-claude",
  "include_read": false,
  "limit": 10
}
```

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

```json
{
  "instance_id": "voice-claude",
  "action": "update",
  "status": "active",
  "current_task": "Working on docs"
}
```

### Meta Group (3 tools) — Always loaded

#### `load_tools` / `unload_tools` / `list_tool_groups`
Dynamically manage which tool groups are active. Groups: screen, memory, voice-clone, browser, n8n, diagnostic.

### Memory Group (6 tools)

#### `memory_search`
Hybrid semantic + keyword search across stored memories.

```json
{
  "query": "user preferences for TTS voice",
  "max_results": 5,
  "min_score": 0.3
}
```

#### `memory_remember`
Store a memory with tier classification:
- **core** — Permanent facts (user preferences, project decisions)
- **stable** — Important context, 7-day TTL
- **notes** — Temporary reminders, 24-hour TTL

```json
{
  "content": "User prefers Kokoro TTS with voice af_heart",
  "tier": "core"
}
```

#### `memory_get` / `memory_forget` / `memory_stats` / `memory_flush`
Retrieve, delete, get statistics, or flush important context to persistent storage.

### Screen Group (1 tool)

#### `capture_screen`
Take a screenshot of the user's desktop. Returns the image for visual analysis.

```json
{
  "display": 0
}
```

### Voice Clone Group (3 tools)

#### `clone_voice`
Clone a voice from an audio file (3-5 seconds of speech). Uses Qwen3-TTS.

#### `clear_voice_clone`
Reset to the default TTS voice.

#### `list_voice_clones`
List all saved voice clones with metadata.

### Browser Group (14 tools)

Full Chrome/Chromium automation via CDP:

| Tool | Purpose |
|------|---------|
| `browser_start` / `browser_stop` | Launch/close managed Chrome |
| `browser_status` | Check if browser is running |
| `browser_tabs` | List open tabs |
| `browser_open` / `browser_close_tab` | Open/close tabs |
| `browser_focus` | Activate a tab |
| `browser_navigate` | Navigate to URL |
| `browser_screenshot` | Screenshot a tab |
| `browser_snapshot` | Accessibility tree (DOM as structured refs) |
| `browser_act` | Click, type, fill, hover, press, select, drag, evaluate |
| `browser_console` | Get console logs/errors |
| `browser_search` | Google search via headless browser |
| `browser_fetch` | Extract text content from URL |

### n8n Group (22 tools)

Full n8n workflow automation:

| Tool | Purpose |
|------|---------|
| `n8n_list_workflows` / `n8n_get_workflow` | Read workflows |
| `n8n_create_workflow` / `n8n_update_workflow` / `n8n_delete_workflow` | Manage workflows |
| `n8n_validate_workflow` | Check for errors |
| `n8n_trigger_workflow` | Execute via webhook |
| `n8n_get_executions` / `n8n_get_execution` | Check run history |
| `n8n_retry_execution` / `n8n_delete_execution` | Manage executions |
| `n8n_search_nodes` / `n8n_get_node` | Discover available nodes |
| `n8n_list_credentials` / `n8n_create_credential` / `n8n_delete_credential` | Manage credentials |
| `n8n_get_credential_schema` | Get required fields for credential types |
| `n8n_list_tags` / `n8n_create_tag` / `n8n_delete_tag` | Workflow organization |
| `n8n_list_variables` | Global variables (Enterprise) |
| `n8n_deploy_template` | Deploy from n8n.io templates |

### Diagnostic Group (1 tool)

#### `pipeline_trace`
Trace message flow through the live voice pipeline. Useful for debugging audio/transcription issues.
