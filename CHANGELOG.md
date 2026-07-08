# Changelog

## Rev 7.0 — Hub polish across the fleet (Jul 2026)

### Main hub (`index.html`, `styles.css`, `app.js`)
- New hero layout with quick-route panel into live demos
- **Play now** section featuring Aether Garden, Pet Grave, QI Games, Fairy Council, AetherTab, Divinity
- Project filters (All / AI / Games / Tools / Web)
- Scroll progress bar, active nav highlighting, back-to-top
- Expanded experiments deck (QI Games, Dockmaster, Calling Card)
- Richer glass/glow design system, reduced-motion support
- Improved SEO meta + JSON-LD
- Live GitHub fleet telemetry cache v3

### Shared chrome
- `site-chrome.css` + `site-chrome.js` — floating **Aetherhaven** hub link on every subpage

### Surface upgrades
- **Fairy Council** — how-to steps, clipboard API, select/summon actions, motion, meta
- **QI Games** — full visual redesign, pause/speed, focus highlight, particle bursts, nav to sibling demos
- **Aether Garden** — sharper HUD, mobile layout, OG meta
- **Consulting** — modern font stack + meta description
- **AetherTab** — a11y focus + selection polish
- **Portfolio** — stylesheet path fix for GH Pages subfolder
- **Ares Veil Codex** — real landing (was placeholder)

### Subpages receiving hub chrome
aether-garden, aetherrose, aethertab, amara-codex, ares-veil-companion, consulting, divinity-static, fairy-council, natalie, pet-grave, petgrave, portfolio, qi-games (+ play/society3d/store/tv/ops/agent_vision), card, demo, rates

---

## v0.2 — Forge Fuel

Added:

- `agentic/forge-fuel.css`
- `agentic/forge-fuel.js`
- `/fuel` Dockmaster command
- temporary BYOK session UI
- project/mission selectors
- permission toggles
- consent gate
- safe static demo mode
- Markdown export for Forge runs
- `worker/forge-fuel-worker-example.js`
- `docs/FORGE_FUEL.md`

Validated:

- JavaScript syntax checks passed for Dockmaster, Forge Fuel, and both worker examples.
- Project memory JSON validates.
