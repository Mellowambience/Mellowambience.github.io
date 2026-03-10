# Divinity: Static — Production Cockpit

**URL:** `https://mellowambience.github.io/divinity-static`

## What it is
A self-contained web app for the *Divinity: Static* song project — song timeline visualization, vocal chain reference, Gemini-powered AI Studio (lyrics / Latin chants / visual prompts), YouTube reference playlist, and BPM sync calculator.

## How to update
This is a **single-file app** (`index.html`). Edit it directly — no build step needed.

- **Add a song section** → find `songStructure` array, add an object
- **Change BPM modes** → find the 140/172 buttons in the header
- **Update vocal chain** → find the `vocals` tab section
- **Change AI model** → update the model string in `callGemini`
- **Set Gemini API key** → add `<script>window.__GEMINI_KEY__ = "your-key";</script>` before the main script tag (never commit real keys to a public repo)

## Stack
- React 18 (CDN, no build)
- Tailwind CSS (CDN)
- Babel standalone (JSX transpile in-browser)
- Gemini 2.5 Flash Preview (REST API, client-side)

## Part of the Aetherhaven web network
Sits alongside `/aetherrose`, `/aethertab`, `/amara-codex`. Footer links back to the main portfolio.
