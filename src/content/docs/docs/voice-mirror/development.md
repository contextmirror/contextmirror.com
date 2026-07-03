---
title: Development
description: Setting up Voice Mirror for development
---

Voice Mirror is in **alpha** and under active development. There are no signed
installers yet, so the supported way to run it is to **build from source**.

## Prerequisites

- **Node.js** 18+
- **Rust** toolchain (stable, via [rustup](https://rustup.rs/))
- **npm** 9+
- **Platform dependencies** for Tauri 2 (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))
  - **Windows**: WebView2 (pre-installed on Windows 10/11), Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.1`, `libappindicator3`, `librsvg2`

> Voice Mirror is **Windows-first**. The full see-and-drive App Preview loop,
> push-to-talk, and native-window driving are Windows-only today; macOS and Linux
> support is planned.

## Quick Start

```bash
git clone https://github.com/contextmirror/voice-mirror
cd voice-mirror
npm install
npm run dev
```

`npm run dev` runs:

```
cargo build --manifest-path src-tauri/Cargo.toml --bin voice-mirror-mcp && tauri dev
```

which does three things:

1. Rebuilds the native `voice-mirror-mcp` Rust binary
2. Starts the Vite dev server on **port 31420** (moved off Tauri's default `1420`
   so the previewed apps you build never collide with Voice Mirror's own server)
3. Launches the Tauri app with hot reload

## Commands

```bash
npm install          # Install frontend dependencies
npm run dev          # Tauri dev mode + hot reload (rebuilds the MCP binary first)
npm run build        # Production Tauri build (rebuilds the MCP binary in release)
npm test             # Run all JS tests (node:test) — ~6,200 cases
npm run test:rust    # Run Rust tests (cd src-tauri && cargo test)
npm run test:all     # Run JS tests, then Rust tests
npm run check        # Svelte type checking (svelte-check)
```

`npm test` runs both `*.test.cjs` and `*.test.mjs` files under `test/` via
`node --test`. There is no Jest, Mocha, or external test framework.

## Project Structure

The repo is a single project with the Svelte 5 frontend at the **root `src/`** and
the Rust/Tauri backend in **`src-tauri/`** (there is no `tauri/` subfolder).

```
voice-mirror/
├── src/                        # Svelte 5 frontend
│   ├── App.svelte              # Root component
│   ├── main.js                 # Entry point
│   ├── components/
│   │   ├── chat/               # Chat panel, messages, input
│   │   ├── lens/               # Lens workspace: editor, file tree, tabs,
│   │   │                       #   preview, command palette, diff viewer
│   │   ├── overlay/            # Always-on-top overlay, orb
│   │   ├── settings/           # Settings panels + appearance sub-panels
│   │   ├── shared/             # Reusable: SplitPanel, ResizeEdges, etc.
│   │   ├── sidebar/            # Navigation sidebar
│   │   └── terminal/           # Terminal emulator (ghostty-web WASM)
│   ├── lib/
│   │   ├── stores/             # Svelte 5 reactive stores (*.svelte.js)
│   │   ├── api.js              # Tauri invoke() wrappers
│   │   ├── health-contracts.js # Subsystem health checks
│   │   ├── markdown.js         # Markdown rendering with DOMPurify
│   │   └── ...                 # Editor theme, file icons, orb presets, etc.
│   └── styles/                 # CSS modules (base, tokens, animations, etc.)
│
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── lib.rs              # Tauri app setup, plugin/command registration
│   │   ├── main.rs            # App binary entry point
│   │   ├── bin/mcp.rs         # voice-mirror-mcp binary entry point
│   │   ├── commands/          # Tauri command modules (ai, chat, config,
│   │   │                      #   lsp, sandbox, terminal, voice, window, …)
│   │   ├── config/            # Schema, persistence (atomic writes)
│   │   ├── providers/         # AI providers: API HTTP, CLI PTY, manager
│   │   ├── voice/             # Voice pipeline (STT, TTS, VAD, wake word)
│   │   ├── mcp/               # MCP server, tool registry, handlers/, pipe router
│   │   ├── ipc/               # Named-pipe IPC (protocol, server, client)
│   │   ├── lsp/               # Language Server Protocol client
│   │   ├── terminal/          # PTY / terminal backend
│   │   └── services/          # Background services:
│   │       │                  #   sandbox / sandbox_stream (App Preview),
│   │       │                  #   uia (native UI Automation driving),
│   │       │                  #   cdp (Chrome DevTools Protocol),
│   │       │                  #   window_stream, window_follow (focus sync),
│   │       │                  #   dev_server, browser_bridge, file_watcher,
│   │       │                  #   crash_handler, hang_watchdog, logger, …
│   ├── tauri.conf.json         # App config (frameless, transparent window)
│   └── Cargo.toml              # Rust dependencies
│
├── test/                       # JavaScript tests (~6,200 cases)
│   ├── unit/                   # Direct-import tests for pure JS (.mjs)
│   ├── stores/                 # Source-inspection tests for Svelte stores (.cjs)
│   ├── api/                    # Source-inspection tests for API wrappers (.cjs)
│   ├── components/             # Source-inspection tests for components (.cjs)
│   └── lib/                    # Source-inspection tests for lib utilities (.cjs)
│
├── docs/                       # Project documentation
└── package.json
```

## Configuration

Config is stored in the platform app data directory:

| Platform | Location |
|----------|----------|
| **Windows** | `%APPDATA%\voice-mirror\config.json` |
| **macOS** | `~/Library/Application Support/voice-mirror/config.json` |
| **Linux** | `~/.config/voice-mirror/config.json` |

The frontend sends config patches via `invoke('set_config', { patch })`. The Rust backend merges and persists atomically (write to temp file, then rename). Schema is defined in `src-tauri/src/config/schema.rs` with serde `camelCase` rename.

## Testing

Voice Mirror uses two testing approaches based on module type:

### Pure JS Functions (`.mjs` tests)

Direct ES module imports:

```js
import { deepMerge } from '../../src/lib/utils.js';
it('merges objects', () => {
    assert.deepStrictEqual(deepMerge({a: 1}, {b: 2}), {a: 1, b: 2});
});
```

### Svelte Stores and Components (`.cjs` tests)

Source-inspection pattern (Svelte 5 runes cannot run in Node.js):

```js
const src = fs.readFileSync(
    path.join(__dirname, '../../src/lib/stores/config.svelte.js'), 'utf-8'
);
it('exports configStore', () => {
    assert.ok(src.includes('export const configStore'));
});
```

All JS tests use `node:test` and `node:assert/strict`.

### Rust Tests

```bash
# Compilation verification (preferred on Windows)
cargo check --manifest-path src-tauri/Cargo.toml --tests

# Rebuild the MCP binary
cargo build --manifest-path src-tauri/Cargo.toml --bin voice-mirror-mcp
```

> On Windows, `cargo test --lib` fails because of a WebView2 DLL load issue. Use
> `cargo check --tests` to verify compilation, and build the MCP binary directly
> with `cargo build --bin voice-mirror-mcp`.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle panel expand/collapse |
| `Ctrl+P` | Command palette (in Lens workspace) |
| Mouse Button 4/5 | Push-to-talk (when PTT mode active) |

## Common Pitfalls

- **Stale MCP binary**: `tauri dev` alone does **not** rebuild `voice-mirror-mcp`.
  Always use `npm run dev`, which rebuilds it first. Serde silently drops unknown
  fields, so a stale binary loses features without any error.
- **`tauri dev` rebuilds kill the running app**: `tauri dev` watches `src-tauri/`,
  so any `.rs` or Cargo edit while it's running triggers a rebuild that restarts
  the app (it can look like a crash). Frontend-only changes hot-reload without a
  rebuild. If you're editing the backend while the app is live, do that work in an
  isolated **git worktree** and merge once.
- **Svelte 5 runes**: `$state`, `$effect`, `$derived` only work in `.svelte` and
  `.svelte.js` files. A store in a plain `.js` file will throw `ReferenceError`.
- **Voice features**: STT/TTS engines are behind the `native-ml` Cargo feature
  flag. Default dev builds exclude them.
- **ghostty-web WASM**: the WASM file is downloaded/copied at build time via the
  Vite plugin in `vite.config.js`.
- **Crash logs**: crashes and hangs self-report to
  `%APPDATA%\voice-mirror\logs\crashes.log` (panic hook + crash handler +
  UI-hang watchdog). Check there first when the app disappears.

## Git workflow

Development happens on the **`dev`** branch; push to `dev`. Merge to **`main`** only
for releases.
</content>
</invoke>
