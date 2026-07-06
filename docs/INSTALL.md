# Install Aetherhaven Dockmaster + Forge Fuel

This branch adds a static-safe agentic MVP to the GitHub Pages site.

## Preview

Open:

```txt
/demo.html
```

The demo loads:

```html
<link rel="stylesheet" href="./agentic/dockmaster.css" />
<link rel="stylesheet" href="./agentic/forge-fuel.css" />
<script src="./agentic/dockmaster.js" defer></script>
<script src="./agentic/forge-fuel.js" defer></script>
```

## Add to the live homepage

Inside `index.html`, add these before `</head>`:

```html
<link rel="stylesheet" href="/agentic/dockmaster.css" />
<link rel="stylesheet" href="/agentic/forge-fuel.css" />
```

Then add these before `</body>`:

```html
<script src="/agentic/dockmaster.js" defer></script>
<script src="/agentic/forge-fuel.js" defer></script>
```

## Commands

Dockmaster supports:

```txt
/status
/fleet
/games
/ai
/browser
/project <name>
/issues <project>
/roadmap
/devlog
/hire
/contact <brief>
/recruiter
/agentic
/fuel
/export
```

## Safety

The public layer is draft-only. It does not write to GitHub, send email, store API keys, post to social media, or run real model calls without a server-side worker.
