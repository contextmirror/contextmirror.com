# Context Mirror

**Make local LLMs punch above their weight.**

Context Mirror is an ecosystem of AI-powered developer tools that make local LLMs more capable and reliable. This repository contains the source for [contextmirror.com](https://contextmirror.com) — the marketing site and documentation hub.

## Products

### Context Mirror — VSCode Extension

Intelligent scaffolding for AI coding assistants. Turns local LLMs into reliable dev partners with 56 MCP tools, a hook engine for automatic guardrails, and a learning system that improves over time.

- **Decode System** — converts codebases into LLM-digestible format
- **Hook Engine** — read-before-edit, queue-based review, auto-guardrails
- **Learning System** — captures mistakes as lessons, builds reusable skills
- **Proven Results** — +33% performance lift (67% → 100% on behavioral tests)

### Voice Mirror — Desktop Overlay

A voice-controlled AI agent overlay for your entire computer. Always-on floating orb with screen awareness, browser automation, and voice cloning.

- **11 AI Providers** — Claude Code, Ollama, LM Studio, Jan, OpenAI, Gemini, Groq, Mistral, OpenRouter, DeepSeek, Grok
- **55 MCP Tools** across 8 dynamically-loaded groups
- **Voice Cloning** — clone any voice from a 3-second audio sample
- **Browser Automation** — full Chrome control via CDP
- **Cross-platform** — Windows, macOS, Linux

## Tech Stack

- [Astro](https://astro.build) v5 — static site generation
- [Starlight](https://starlight.astro.build) — documentation theme
- [React](https://react.dev) v19 — interactive components
- [Tailwind CSS](https://tailwindcss.com) v4 — styling
- [Framer Motion](https://motion.dev) — animations
- [Spline](https://spline.design) — 3D visuals
- [TypeScript](https://www.typescriptlang.org) — type safety

## Getting Started

```bash
# Clone the repo
git clone https://github.com/contextmirror/contextmirror.com.git
cd contextmirror.com

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm run dev`     | Start local dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`      |
| `npm run preview` | Preview the production build locally    |

## Project Structure

```
src/
├── components/       # Astro + React UI components
│   └── ui/           # Reusable UI (navbar, cards, orb demo)
├── content/
│   ├── blog/         # Blog posts (Markdown)
│   └── docs/         # Documentation (Starlight)
├── layouts/          # Page layouts
├── pages/            # Route pages
├── styles/           # Global CSS + Tailwind theme
└── lib/              # Utilities
```

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions. The workflow installs dependencies, builds the static site, and publishes the `./dist/` directory.

**Live at:** [contextmirror.com](https://contextmirror.com)

## Links

- [Documentation](https://contextmirror.com/docs/introduction/)
- [Discord](https://discord.gg/JBpsSFB7EQ)
- [GitHub](https://github.com/contextmirror)
- [Contact](mailto:contextmirror@proton.me)
