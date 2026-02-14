---
title: Installation
description: How to install and set up Voice Mirror
---

# Installation

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+ (for voice backend)
- **npm** 9+
- **ffmpeg** (optional, for voice cloning)
- **CUDA** (optional, for GPU acceleration)

## Install

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
npm start
```

Or use the platform launchers:
- **Windows**: `launch.bat`
- **Linux/macOS**: `./launch.sh`

## Python Backend Setup

The voice backend powers wake word detection, speech-to-text, and text-to-speech:

```bash
cd python
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
```

## Voice Dependencies

| Component | Package | Size | Notes |
|-----------|---------|------|-------|
| Wake Word | openwakeword | ~50MB | "Hey Claude" detection |
| STT (default) | onnx-asr (Parakeet) | ~200MB | Fast CPU inference |
| STT (alternative) | openai-whisper | ~1.5GB | Higher accuracy |
| TTS (default) | kokoro-onnx | ~311MB | 10 built-in voices |
| TTS (cloning) | qwen3-tts | ~2GB | GPU recommended, 9 preset speakers |

## Local Model Setup

If you're using local AI providers (Ollama, LM Studio, or Jan), Voice Mirror includes a TUI Dashboard — a terminal-based interactive interface for discovering and configuring local models. Run `npm run setup` to launch it, where you can browse available models, select a provider, and configure your setup without editing config files manually.

## API Key Setup

Voice Mirror auto-detects API keys from environment variables on startup:

| Variable | Provider |
|----------|----------|
| `ANTHROPIC_API_KEY` | Claude |
| `OPENAI_API_KEY` | OpenAI |
| `GOOGLE_API_KEY` | Gemini |
| `GROQ_API_KEY` | Groq |
| `MISTRAL_API_KEY` | Mistral |
| `XAI_API_KEY` | Grok |
| `OPENROUTER_API_KEY` | OpenRouter |
| `DEEPSEEK_API_KEY` | DeepSeek |
| `SERPER_API_KEY` | Web search |

## Verify Installation

1. The floating orb appears on your desktop
2. Say "Hey Claude" — the orb pulses red when recording
3. Wait for the response — the orb pulses blue when speaking
4. Press `Ctrl+Shift+V` to expand the full panel
