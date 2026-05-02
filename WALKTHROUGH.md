# Portfolio repo walkthrough

This project is a **Next.js** app that wraps your Claude-artifact portfolio (interactive UI, ⌘K command menu, draggable hero words, “Ask Ayush” chat) into something you can run locally and deploy to **Vercel**.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (ships with Node)

---

## Main commands

| Command | What it does |
|--------|----------------|
| `npm install` | Installs dependencies (run once after cloning). |
| `npm run dev` | Starts the dev server (usually http://localhost:3000). Hot reload while you edit. |
| `npm run build` | Production build — checks linting and emits the optimized `.next/` output. |
| `npm run start` | Serves the **production** build. Run **`npm run build`** first. |
| `npm run lint` | Runs ESLint with Next.js defaults. |

Typical flows:

1. **Daily development:** `npm install` → `npm run dev`
2. **Before deploying:** `npm run build` (should finish with no errors)

---

## How the app is wired

### Entry: `app/page.jsx`

This is the home page (client component). It wraps everything in **`SoundProvider`** (micro-sounds + context), renders **`MagneticCursor`**, then the main **`Portfolio`** with:

- **`P={portfolio}`** — all copy/case studies from `lib/portfolio-data.js`
- **`theme={PORTFOLIO_THEME}`** — colors and font stacks from `lib/theme.js`

### Layout & styles: `app/layout.jsx` + `app/globals.css`

- **`layout.jsx`** sets page metadata (title/description) and wraps children with `<html>` / `<body>`.
- **`globals.css`** pulls **Inter**, **Instrument Serif**, and **JetBrains Mono** from Google Fonts so the theme matches what the JSX expects.

### Portfolio UI: `components/Portfolio.jsx`

The long scroll portfolio: hero, work cards, timelines, overlays, ⌘K, etc. It imports primitives from `./shared`:

- **`CommandMenu`**, **`AskAyush`**, **`BlurIn`**, **`Reveal`**, **`AnimatedNumber`**, **`useDragReorder`**, and uses **`SoundCtx`** for clicks/hover sounds.

Editing your story, projects, timeline, etc. ⇒ mostly **`lib/portfolio-data.js`**.

### Interactive primitives + chat UI: `components/shared.jsx`

Reusable pieces: magnetic cursor (desktop), sound system, animations, command palette, Ask Ayush panel.

Originally the artifact used **`window.claude.complete`**. Here, **Ask Ayush** calls **`POST /api/chat`** with the conversation (without the canned intro message). The server adds your resume/context and calls Anthropic safely with your API key.

### AI chat API: `app/api/chat/route.js`

- Builds a fixed **system prompt** + **portfolio context** via **`lib/ai-context.js`** and **`lib/portfolio-data.js`** (so the model stays aligned with the site).
- Expects JSON: `{ "messages": [ { "role": "user" \| "assistant", "content": "..." }, ... ] }`.
- Returns JSON: `{ "reply": "..." }` on success.

If **`ANTHROPIC_API_KEY`** is missing, the route responds with **`503`** and **`{ "error": "NO_KEY" }`**; the UI shows a friendly “not wired yet” message.

### Config & paths

- **`next.config.mjs`** — Next.js settings (minimal).
- **`jsconfig.json`** — `@/` alias → project root (e.g. `@/components/...`).

---

## Environment variables (Vercel / local)

Copy **`.env.example`** to **`.env.local`** for local runs (never commit `.env.local`).

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `ANTHROPIC_API_KEY` | Optional but needed for Ask Ayush in prod | Anthropic API key for `/api/chat`. |
| `ANTHROPIC_MODEL` | Optional | Defaults to **`claude-3-5-haiku-20241022`** if unset. |

On **Vercel**: Project → **Settings → Environment Variables** → add the same keys for Production (and Preview if you want chat on previews).

---

## Deploying on Vercel (short)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the repo in [Vercel](https://vercel.com): framework **Next.js** is auto-detected.
3. Build command: **`npm run build`** · Output: default (`.next`).
4. Add **`ANTHROPIC_API_KEY`** (and optionally **`ANTHROPIC_MODEL`**) if you want the chat widget to work live.

---

## `design-canvas.jsx` at the repo root

This file is the **standalone Figma-style canvas** artifact (pan/zoom, artboards). It still targets **`window`** globals and optional host bridges; it is **not** wired into the Next.js app route tree. If you want it as a page later, it would need a small client page that imports React and registers the components like the old artifact did.

---

## Quick mental model

```
app/page.jsx
  → SoundProvider + MagneticCursor + Portfolio(theme, portfolio data)

components/Portfolio.jsx  → layout, sections, ⌘K, overlays
components/shared.jsx     → cursor, sound, animations, AskAyush → fetch("/api/chat")

app/api/chat/route.js     → Anthropic + context from lib/

lib/portfolio-data.js     → your content (edit here)
lib/theme.js              → colors / font families
lib/ai-context.js         → text blob sent to the model as “who is Ayush”
```

If something breaks after a change, run **`npm run build`** — it catches many issues before deploy.
