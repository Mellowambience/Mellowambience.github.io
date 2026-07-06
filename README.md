# Aetherhaven Agentic MVP

A drop-in command deck for `mellowambience.github.io`.

It includes two modules:

## Dockmaster v0.1

A public site guide that can:

- route visitors;
- explain projects;
- draft GitHub issues;
- draft weekly devlogs;
- draft contact messages;
- summarize the strongest hiring proof;
- export sessions as Markdown;
- open Forge Fuel with `/fuel`.

## Forge Fuel v0.1

A temporary BYOK project-enhancement session UI.

It can:

- select a provider/model;
- accept a temporary API key for one run;
- choose a project and mission;
- set permission toggles;
- require consent;
- run in safe static demo mode;
- optionally call a server-side worker;
- export the result as Markdown.

It does **not** store keys, edit repos, send messages, post updates, or perform actions without approval.

Open `demo.html` locally to preview, then follow `docs/INSTALL.md`.

See `docs/FORGE_FUEL.md` for the BYOK architecture.
