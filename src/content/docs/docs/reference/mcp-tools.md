---
title: MCP Tools Reference
description: Complete reference for all MCP tools in Voice Mirror
---

Voice Mirror provides 45 MCP (Model Context Protocol) tools across 5 dynamically loadable groups, enabling Claude Code, OpenCode, and other MCP-aware agents to interact with the system. The MCP server is a native Rust binary (`voice-mirror-mcp`) that communicates over stdio JSON-RPC.

Tool groups load on demand. Two groups (**core** and **capture**) are always loaded; the rest load when the active profile enables them or when the AI mentions a relevant keyword. Groups that go unused for ~15 consecutive tool calls are automatically unloaded to reduce context size.

| Group | Always loaded | Tools | Count |
|-------|---------------|-------|-------|
| [core](#core-group-5-tools--always-loaded) | yes | voice_send, voice_inbox, voice_listen, voice_status, get_logs | 5 |
| [capture](#capture-group-11-tools--always-loaded) | yes | capture_list_windows, capture_window, capture_browser, sandbox_start, sandbox_attach, sandbox_snapshot, sandbox_screenshot, sandbox_click, sandbox_type, sandbox_close_window, list_ports | 11 |
| [memory](#memory-group-6-tools) | no | memory_search, memory_get, memory_remember, memory_forget, memory_stats, memory_flush | 6 |
| [browser](#browser-group-1-tool) | no | browser_action | 1 |
| [n8n](#n8n-group-22-tools) | no | workflow / execution / credential / tag / node tools | 22 |

## Core Group (5 tools) -- Always loaded

Core voice communication and diagnostics between the AI agent and Voice Mirror.

### `voice_send`
Send a message to the Voice Mirror inbox. The message is spoken aloud via TTS.

```json
{
  "instance_id": "voice-claude",
  "message": "Hello! I've finished the task.",
  "thread_id": "optional-thread-id",
  "reply_to": "optional-message-id"
}
```

Required: `instance_id`, `message`.

### `voice_inbox`
Read messages from the inbox. Voice queries from the user appear here.

```json
{
  "instance_id": "voice-claude",
  "include_read": false,
  "limit": 10,
  "mark_as_read": true
}
```

Required: `instance_id`.

### `voice_listen`
Wait for new voice input from the user. Blocks until a message arrives or timeout.

```json
{
  "instance_id": "voice-claude",
  "from_sender": "user",
  "thread_id": "optional-thread-filter",
  "timeout_seconds": 300
}
```

Required: `instance_id`, `from_sender`. Timeout defaults to 300 seconds (max 600).

### `voice_status`
Update or list Claude instance presence status.

```json
{
  "instance_id": "voice-claude",
  "action": "update",
  "status": "active",
  "current_task": "Working on docs"
}
```

Required: `instance_id`. `action` is `update` or `list`; `status` is `active` or `idle`.

### `get_logs`
Query Voice Mirror's structured output logs. Without a channel, returns a summary of all channels with entry counts. With a channel name, returns actual log lines.

```json
{
  "channel": "preview",
  "level": "info",
  "last": 100,
  "search": "stream"
}
```

System channels: `app` (Voice Mirror core), `cli` (CLI provider), `voice` (voice pipeline), `mcp` (MCP server), `browser` (browser bridge), `frontend` (frontend errors), `preview` (App Preview window-follow + streaming). Project channels are dynamic -- created when dev servers start -- and contain build logs plus browser console output for the project being developed.

## Capture Group (11 tools) -- Always loaded

This is the headline group. It powers the **App Preview** "see and drive" loop: a live, true-size view of the app you are building, where the AI looks at the *same* running surface the user does, then reads its element tree and clicks/types to test it.

How the AI **sees** the app:

- **CDP screencast** for web, Tauri, WebView2, and Electron apps.
- **Windows Graphics Capture** for native windows rendered at true window size.

How the AI **drives** the app:

- It reads an accessibility/element tree exposed as `@e{n}` refs, then clicks and types by ref.
- **CDP** engine -> web / Tauri / WebView2 / Electron apps.
- **UI Automation (UIA)** engine -> native Windows apps (Notepad, Calculator, Settings, Win32/WinForms/WPF/Qt).
- Both engines present the **same tool surface and the same `@ref` model** -- the AI cannot tell which engine is underneath. Driving native Windows apps this way is genuinely novel.

The live preview auto-follows whichever window you *or* the AI last touched (two-way focus sync).

> **Windows-only today.** App Preview and native-app driving currently run on Windows.

### `capture_list_windows`
List all visible desktop windows (title, process name, dimensions). Use this to find a target before capturing or driving it.

```json
{
  "filter": "notepad"
}
```

`filter` is an optional case-insensitive substring match on title or process name.

### `capture_window`
Take a screenshot of a specific desktop window. Use `capture_list_windows` first, then capture by title substring or exact `hwnd`.

```json
{
  "title": "Calculator",
  "hwnd": 132456
}
```

Provide `title` or `hwnd` (HWND is more precise). Returns the screenshot as an image.

### `capture_browser`
Screenshot the Lens browser preview at its exact current viewport size -- the web app or site the user is building, as the user sees it. Prefer this over `capture_window` for previewing localhost apps/sites. No parameters.

### `sandbox_start`
Call this **first** when starting work on a desktop app (e.g. a Tauri app). It launches the app with remote debugging on a safe port and opens the live App Preview so both you and the user see it running.

```json
{
  "path": "C:/projects/my-tauri-app"
}
```

`path` is optional -- omit it to launch Voice Mirror's active project.

### `sandbox_attach`
Register an app you already launched yourself (with `--remote-debugging-port=PORT`) as the active sandbox and open the live App Preview for it. Use this instead of `sandbox_start` when you launched the app in a terminal.

```json
{
  "port": 9333
}
```

Required: `port` (must not be Voice Mirror's own port 9222).

### `sandbox_snapshot`
See the structure of the app. Returns the accessibility tree as `@ref` element handles plus a `windows` list of the app's open windows (`[index] title — url`). Call this first, then use the refs with `sandbox_click` / `sandbox_type`.

```json
{
  "port": 9333,
  "hwnd": 132456,
  "window": "settings"
}
```

- Omit `port`/`hwnd` to use the active sandbox app launched by Voice Mirror.
- Pass `hwnd` to drive a **native** (non-CDP) app via UI Automation -- mutually exclusive with `port`.
- `window` selects a secondary window from a previous snapshot's `windows` list (prefer a URL/route substring or index, since apps often reuse the same window title). Subsequent `sandbox_click` / `sandbox_type` act on whichever window you last snapshotted.

### `sandbox_screenshot`
See the app rendered at its **true** window size (the real running window, not a stretched web preview). Works for CDP/Tauri apps and for native apps snapshotted by `hwnd`.

```json
{
  "port": 9333
}
```

`port` is optional -- defaults to the active sandbox app (or the native window from the last `sandbox_snapshot`).

### `sandbox_click`
Click an element in the running app to test it. Acts on whichever window the most recent `sandbox_snapshot` targeted (CDP or native).

```json
{
  "element_ref": "@e7",
  "port": 9333
}
```

Required: `element_ref` (from the last snapshot). `port` is optional.

### `sandbox_type`
Type text into an element in the running app.

```json
{
  "element_ref": "@e7",
  "text": "hello world",
  "port": 9333
}
```

Required: `element_ref`, `text`. `port` is optional.

### `sandbox_close_window`
Gracefully close the app window you are currently driving (the one your last `sandbox_snapshot` targeted) -- e.g. a Settings window you opened. Performs the native title-bar close you cannot reach with `sandbox_click`.

```json
{
  "port": 9333
}
```

`port` is optional.

### `list_ports`
List which process holds each listening TCP port (port, PID, process name, state) -- instantly see what is running on a port without shelling out to PowerShell/netstat.

```json
{
  "port": 9333
}
```

Pass `port` to filter to a single port (e.g. to check a dev port before `sandbox_start`); omit it to list all listening ports.

## Memory Group (6 tools)

Persistent memory with hybrid semantic + keyword search across three tiers. Memories survive across sessions.

| Tier | TTL | Use case |
|------|-----|----------|
| **core** | Permanent | User preferences, project decisions, durable facts |
| **stable** | 7 days | Important context, session decisions |
| **notes** | 24 hours | Temporary reminders |

### `memory_search`
Search memories using hybrid semantic + keyword search.

```json
{
  "query": "user preferences for TTS voice",
  "max_results": 5,
  "min_score": 0.3
}
```

Required: `query`. Defaults: `max_results` 5, `min_score` 0.3.

### `memory_get`
Read the full content of a memory chunk or file. Use after `memory_search` to pull only the lines you need.

```json
{
  "path": "chunk_abc123",
  "from_line": 10,
  "lines": 20
}
```

Required: `path` (file path or chunk ID from search results).

### `memory_remember`
Store a persistent memory with a tier classification.

```json
{
  "content": "User prefers Kokoro TTS with voice af_bella",
  "tier": "core"
}
```

Required: `content`. `tier` is `core`, `stable`, or `notes`.

### `memory_forget`
Delete a memory by content or chunk ID. Destructive -- requires `confirmed: true`.

```json
{
  "content_or_id": "chunk_abc123",
  "confirmed": true
}
```

Required: `content_or_id`.

### `memory_stats`
Get memory system statistics including storage, index, and embedding info. No parameters.

### `memory_flush`
Flush important context to persistent memory before the context window is compacted, to preserve key decisions, topics, and action items.

```json
{
  "topics": ["voice pipeline debugging"],
  "decisions": ["switched to Kokoro TTS"],
  "action_items": ["test App Preview on the new build"],
  "summary": "Debugged TTS pipeline, switched engines"
}
```

## Browser Group (1 tool)

Browser automation is a **single unified tool**, `browser_action`, that dispatches roughly 50 sub-actions via its `action` parameter. (Earlier versions exposed many separate `browser_*` tools; that is no longer the case.) The browser exposes elements as `@e{n}` refs -- call `snapshot` first to discover them, then target elements by `ref`.

### `browser_action`

```json
{
  "action": "snapshot",
  "interactiveOnly": true
}
```

```json
{
  "action": "click",
  "ref": "@e3"
}
```

```json
{
  "action": "navigate",
  "url": "https://example.com"
}
```

Required: `action`. Other fields apply depending on the action (`ref`, `selector`, `url`, `value`, `expression`, `query`, `name`, `username`, `password`, `key`, `pattern`, `content`, `annotate`, `interactiveOnly`, `timeout`, `stableMs`, `tabId`, `x`, `y`).

Sub-actions by category:

| Category | Actions |
|----------|---------|
| Navigation | `navigate`, `back`, `forward`, `reload` |
| Interaction | `click`, `dblclick`, `fill`, `fill_rich_editor`, `type`, `hover`, `focus`, `scroll`, `select`, `check`, `uncheck` |
| Inspection | `screenshot` (set `annotate: true` for numbered overlays), `snapshot` (`@eN` refs; `interactiveOnly: true` to filter), `gettext`, `content`, `boundingbox`, `isvisible`, `url`, `title` |
| Scripting | `evaluate`, `addscript` |
| Tabs | `tab_new`, `tab_list`, `tab_switch`, `tab_close` |
| Waiting | `wait`, `waitforurl`, `waitforloadstate`, `waitforstable` (DOM mutation silence) |
| State | `cookies_get`, `cookies_set`, `cookies_clear`, `storage_get`, `storage_set` |
| Auth | `auth_save`, `auth_login`, `auth_list`, `auth_delete` |
| Web | `search`, `fetch` |

## n8n Group (22 tools)

Full n8n workflow automation over the n8n REST API.

| Tool | Purpose |
|------|---------|
| `n8n_search_nodes` | Search for n8n nodes by keyword |
| `n8n_get_node` | Get detailed node info (minimal/standard/full) |
| `n8n_list_workflows` | List all workflows (optionally active only) |
| `n8n_get_workflow` | Get workflow details by ID |
| `n8n_create_workflow` | Create a new workflow |
| `n8n_update_workflow` | Update a workflow via operations |
| `n8n_delete_workflow` | Delete a workflow (requires confirmation) |
| `n8n_validate_workflow` | Validate a workflow configuration |
| `n8n_trigger_workflow` | Execute via webhook trigger |
| `n8n_deploy_template` | Deploy from an n8n.io template |
| `n8n_get_executions` | Get recent executions |
| `n8n_get_execution` | Get execution details |
| `n8n_delete_execution` | Delete an execution (requires confirmation) |
| `n8n_retry_execution` | Retry a failed execution |
| `n8n_list_credentials` | List credentials |
| `n8n_create_credential` | Create a new credential |
| `n8n_delete_credential` | Delete a credential (requires confirmation) |
| `n8n_get_credential_schema` | Get the schema for a credential type |
| `n8n_list_tags` | List all tags |
| `n8n_create_tag` | Create a new tag |
| `n8n_delete_tag` | Delete a tag (requires confirmation) |
| `n8n_list_variables` | List global variables |

Destructive tools (`n8n_delete_workflow`, `n8n_delete_credential`, `n8n_delete_tag`, `n8n_delete_execution`) require `confirmed: true`. `memory_forget` is also gated this way.

## Tool Response Format

All MCP tools return the standard MCP tool-result shape -- a `content` array plus an `isError` flag:

```json
{
  "content": [{ "type": "text", "text": "Message sent." }],
  "isError": false
}
```

On error, `isError` is `true` and the text describes what went wrong:

```json
{
  "content": [{ "type": "text", "text": "Description of what went wrong" }],
  "isError": true
}
```

Screenshot tools (`capture_window`, `sandbox_screenshot`, `browser_action` with `action: "screenshot"`) return an `image` content item (base64 data + `mimeType`) alongside a short text note.

## Dynamic Loading

Tools load by **profile** and by **keyword intent**:

- **Always loaded:** `core` and `capture` are loaded at startup and cannot be unloaded.
- **Profile:** an active tool profile pins a set of groups. The default `voice-assistant` profile enables **core + memory + browser** (with **capture** always loaded on top).
- **Keyword intent:** if no profile restricts it, a group auto-loads when the user's message mentions a matching keyword -- for example "remember"/"recall" loads **memory**, "search"/"website"/"snapshot" loads **browser**, "screenshot"/"sandbox"/"preview" relates to **capture** (already always loaded), and "n8n"/"workflow"/"trigger" loads **n8n**.
- **Auto-unload:** any non-pinned, non-always-loaded group that goes unused for ~15 consecutive tool calls is automatically unloaded to keep the tool list and context small.
