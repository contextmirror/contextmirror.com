---
title: Development
description: Setting up Voice Mirror for development
---

# Development Setup

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+ (for voice backend)
- **npm** 9+
- **ffmpeg** (optional, for voice cloning)
- **CUDA** (optional, for GPU-accelerated TTS)

## Quick Start

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
npm start
```

Or use the platform launchers:
- **Windows**: `launch.bat` (uses VBS wrapper — no console window)
- **Linux/macOS**: `./launch.sh`

## Python Backend Setup

The voice backend requires additional setup:

```bash
cd python
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

### Voice Dependencies

| Component | Package | Size | Notes |
|-----------|---------|------|-------|
| Wake Word | openwakeword | ~50MB | "Hey Claude" detection |
| STT (default) | onnx-asr (Parakeet) | ~200MB | Fast NVIDIA NeMo on CPU |
| STT (alternative) | openai-whisper | ~1.5GB | Higher accuracy |
| STT (alternative) | faster-whisper | ~1.5GB | CTranslate2 optimized |
| TTS (default) | kokoro-onnx | ~311MB | 10 built-in voices |
| TTS (cloning) | qwen3-tts | ~2GB | GPU recommended, 9 presets + cloning |

## Project Structure

```
voice-mirror-electron/
├── electron/               # Electron app
│   ├── main.js             # Window, tray, IPC, process orchestration
│   ├── preload.js          # Security bridge (contextBridge)
│   ├── config.js           # Cross-platform config
│   ├── claude-spawner.js   # Claude Code PTY (node-pty)
│   ├── window/             # Window manager + system tray
│   ├── providers/          # Multi-AI provider system (11 providers)
│   ├── services/           # 15 modular services
│   ├── browser/            # Chrome automation (CDP + Playwright)
│   ├── tools/              # Tool system for local LLMs
│   ├── js/                 # Renderer modules
│   └── styles/             # CSS modules
├── python/                 # Voice backend
│   ├── voice_agent.py      # Main voice engine
│   ├── audio/              # Wake word, VAD
│   ├── tts/                # TTS adapters (Kokoro, Qwen3)
│   ├── stt/                # STT adapters (Parakeet, Whisper)
│   └── electron_bridge.py  # IPC bridge for Electron
├── mcp-server/             # MCP server (55 tools, 8 groups)
├── wayland-orb/            # Rust native overlay (Linux/Wayland)
├── chrome-extension/       # Browser relay extension (MV3, CDP)
├── test/                   # Unit tests (14 suites, 138 cases)
│   └── browser-benchmark/  # 102 browser automation tests
├── docs/                   # Documentation
├── assets/                 # Icons (16-256px)
└── package.json
```

## Configuration

Config file locations:
- **Linux**: `~/.config/voice-mirror-electron/config.json`
- **macOS**: `~/Library/Application Support/voice-mirror-electron/config.json`
- **Windows**: `%APPDATA%\voice-mirror-electron\config.json`

### Key Settings

| Setting | Description |
|---------|-------------|
| `provider` | AI provider (claude-code, ollama, openai, etc.) |
| `activation_mode` | wake-word, call, push-to-talk |
| `stt_engine` | parakeet, whisper, faster-whisper |
| `tts_engine` | kokoro, qwen3-tts |
| `voice` | TTS voice selection |
| `audio_input_device` | Microphone selection |
| `audio_output_device` | Speaker selection |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle panel expand/collapse |
| `Ctrl+Shift+M` | Toggle performance monitor |
| Mouse Button 4/5 | Push-to-talk (when PTT mode active) |

## Testing

```bash
# Run unit tests
npm test

# Run browser benchmark (102 tests)
npm run test:browser
```

**Test Coverage:**
- 14 test suites, 138 unit test cases
- 102 browser automation benchmark tests
- Config safety, API key detection, provider detection
- Settings persistence, startup behavior
- Cross-platform path resolution
