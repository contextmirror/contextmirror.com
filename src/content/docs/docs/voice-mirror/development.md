---
title: Development
description: Setting up Voice Mirror for development
---

# Development Setup

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+ (for voice backend)
- **npm** 9+

## Quick Start

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
npm start
```

## Python Backend Setup

The voice backend requires additional setup:

```bash
cd python
pip install -r requirements.txt
```

### Voice Dependencies

| Component | Package | Size |
|-----------|---------|------|
| Wake Word | openwakeword | ~50MB |
| STT (default) | onnx-asr (Parakeet) | ~200MB |
| STT (alternative) | openai-whisper | ~1.5GB |
| TTS (default) | kokoro-onnx | ~311MB |
| TTS (cloning) | qwen3-tts | ~2GB (GPU) |

## Project Structure

```
voice-mirror-electron/
├── electron/           # Electron app
│   ├── main.js         # Window, tray, IPC
│   ├── services/       # 8 modular services
│   ├── providers/      # AI provider system
│   ├── browser/        # Playwright integration
│   └── tools/          # Tool system for local LLMs
├── python/             # Voice backend
│   ├── voice_agent.py  # Main voice engine
│   ├── audio/          # Wake word, VAD
│   ├── tts/            # TTS adapters
│   └── stt/            # STT adapters
├── mcp-server/         # MCP server (14 tools)
└── docs/               # Documentation
```

## Configuration

Config file locations:
- **Linux**: `~/.config/voice-mirror-electron/config.json`
- **macOS**: `~/Library/Application Support/voice-mirror-electron/config.json`
- **Windows**: `%APPDATA%\voice-mirror-electron\config.json`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle overlay |
| `Ctrl+Shift+M` | Push-to-talk |
