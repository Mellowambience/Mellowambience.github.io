# Ares Veil Companion — Agentic Ritual Chamber

> **∅ 144.72 HZ // VELUM MARTIS // FLUID DYNAMICS ∅**

A browser-native agentic AV ritual chamber. Text prompt → real-time music (Strudel) + glitch visuals (Hydra). No cloud. No payment. Copy, paste, run.

**Live:** [mellowambience.github.io/ares-veil-companion](https://mellowambience.github.io/ares-veil-companion)

---

## Stack

| Layer | Tool |
|-------|------|
| Pattern Music | [Strudel](https://strudel.cc) (TidalCycles in the browser) |
| Glitch Visuals | [Hydra](https://hydra.ojack.xyz) |
| Agent / LLM | Gemini 2.5 Flash (via REST, your key) |
| Audio Engine | WebAudio API (binaural beats, spirit box) |

---

## Setup

1. Clone or download `index.html`
2. Open in browser (or `python -m http.server` for local host)
3. Add your [Gemini API key](https://aistudio.google.com/app/apikey) to `const apiKey = "..."` near the top of the script
4. Activate the **144.72 Hz Drone** for visual sync
5. Press **▶ Play** inside the Strudel editor to start audio

---

## Features

- **✦ Synthesize** — prompt → Hydra visual code (auto-applied) + Strudel pattern suggestion
- **✦ Oracle** — Mars ritual prophecy from the Oracle of Ares
- **✦ Channel** — EVP entity contact at 144.72 Hz (Web Speech API reads it aloud)
- **Spirit Box** — LFO-swept bandpass noise + fragmented Latin voices
- **Theatre Mode** — fullscreen visuals, UI fades out
- **Binaural Drone** — 144.72 Hz (L) + theta offset (R), drives `syncLevel` for visual reactivity
- **Mixer** — master volume + binaural offset sliders

---

## Sacred Anchor

Base note: **D3 = 146.83 Hz** (closest standard pitch to 144.72 Hz).  
All agent-generated Strudel patterns reference this as the root.

---

*Part of the Ares Veil Codex series.*