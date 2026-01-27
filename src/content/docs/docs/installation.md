---
title: Installation
description: How to install and set up Context Mirror
---

# Installation

## Prerequisites

- **VSCode** 1.80.0 or later
- **Local LLM** running via one of:
  - [Ollama](https://ollama.com) (recommended)
  - [LM Studio](https://lmstudio.ai)
  - [Jan](https://jan.ai)

## Recommended Models

| Model | Parameters | Best For |
|-------|-----------|----------|
| `qwen2.5-coder-14b` | 14B | General coding (recommended) |
| `devstral-small-2-2512` | 24B | Code generation |

## Install the Extension

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Context Mirror"
4. Click Install

### From Source

```bash
git clone https://github.com/contextmirror/context-mirror
cd context-mirror
npm install
npm run build
```

## Configuration

Context Mirror works out of the box with sensible defaults. Configuration is available through VSCode settings:

- **AI Provider**: Select your local LLM provider
- **Model**: Choose your preferred model
- **Memory Tier**: Configure memory persistence levels
- **Hook Policies**: Customize enforcement rules

## Verify Installation

1. Open any project in VSCode
2. Look for the Context Mirror icon in the sidebar
3. The extension will automatically decode your workspace
4. Start chatting with your local LLM — Context Mirror handles the rest
