---
title: Installation
description: How to install and set up Context Mirror
---

# Installation

## Context Mirror (VSCode Extension)

### Prerequisites

- **VSCode** 1.80.0 or later (or code-server)
- **Local LLM** running via one of:
  - [Ollama](https://ollama.com) (recommended)
  - [LM Studio](https://lmstudio.ai)
  - [Jan](https://jan.ai)

### Recommended Models

| Model | Parameters | Context | Best For |
|-------|-----------|---------|----------|
| `qwen2.5-coder:14b` | 14B | 16K | General coding (recommended) |
| `devstral-small-2-32k` | 24B | 32K | Large codebases |
| `qwen3-coder:30b` | 30B (MoE) | 16K | Q&A and explanations |

:::caution
Ollama requires setting `num_ctx` in the Modelfile. Without this, models default to 2048 tokens which is too small. Use `num_ctx 16384` for Qwen or `num_ctx 32768` for Devstral.
:::

### Install the Extension

#### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Context Mirror"
4. Click Install

#### From Source

```bash
git clone https://github.com/contextmirror/context-mirror
cd context-mirror/src/extension
npm install
npm run build:all
```

### Configuration

Context Mirror works out of the box with sensible defaults. Configuration is available through VSCode settings:

- **AI Provider** — Select your local LLM provider (Ollama, LM Studio, Jan)
- **Model** — Choose your preferred model
- **Memory Tier** — Configure memory persistence levels
- **Hook Policies** — Customize enforcement rules

### Verify Installation

1. Open any project in VSCode
2. Look for the Context Mirror icon in the sidebar
3. Click "Decode" in the status bar — the extension will analyze your workspace
4. Start chatting with your local LLM — Context Mirror handles the rest

---

## Voice Mirror (Desktop Overlay)

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+ (for voice backend)
- **npm** 9+
- **ffmpeg** (optional, for voice cloning)
- **CUDA** (optional, for GPU acceleration)

### Install

```bash
git clone https://github.com/contextmirror/voice-mirror-electron
cd voice-mirror-electron
npm install
npm start
```

Or use the platform launchers:
- **Windows**: `launch.bat`
- **Linux/macOS**: `./launch.sh`

### Python Backend Setup

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

### Voice Dependencies

| Component | Package | Size | Notes |
|-----------|---------|------|-------|
| Wake Word | openwakeword | ~50MB | "Hey Claude" detection |
| STT (default) | onnx-asr (Parakeet) | ~200MB | Fast CPU inference |
| STT (alternative) | openai-whisper | ~1.5GB | Higher accuracy |
| TTS (default) | kokoro-onnx | ~311MB | 10 built-in voices |
| TTS (cloning) | qwen3-tts | ~2GB | GPU recommended, 9 preset speakers |

### API Key Setup

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

### Verify Installation

1. The floating orb appears on your desktop
2. Say "Hey Claude" — the orb pulses red when recording
3. Wait for the response — the orb pulses blue when speaking
4. Press `Ctrl+Shift+V` to expand the full panel
