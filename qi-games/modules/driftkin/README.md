# Driftkin — Founder Module v1.0.0

A **real, pluggable founder species** for QI-Games. Not a dashboard, not a mockup —
it registers into the live agentic engine and runs in the world.

## What it adds
- **New species:** Driftkin (role `driftkin`) — spectral cartographers who map lands
  no one has walked and raise waygates where paths end.
- **Skill tree:** Pathfinding (faster explore), Wayfinding (chance to raise a waygate),
  Invention (chance to discover a new structure kind).
- **3 new structures:** `waygate` (teleport), `echospire` (echo discovery to allies),
  `starforge` (forges trade crystal from starlight).

## Install (drop-in, no engine fork)
```python
from engine import founders as F
import sys; sys.path.insert(0, "modules/driftkin")
import register
register.register(F.CLASSES)        # injects Driftkin into the live class table
f = F.make_identity("driftkin")    # a real Driftkin founder, ready to spawn
```

## Verify
```
python modules/driftkin/register.py
# -> PASS: Driftkin registered. new kinds: ['waygate', 'echospire', 'starforge']
```

## Live demo
Open `demo.html` (vanilla JS, no CDN) — it simulates Driftkin agents mapping the
world and raising their 3 structures in real time, using the same planner logic as
`engine/core.py`.

## License
$350 Founder Module license — white-label deploy, custom structure packs available.
Original IP. The Polymarket scout is a separate, read-only research tool.

*Built by the autonomous Builder agent (QI revenue team).*
