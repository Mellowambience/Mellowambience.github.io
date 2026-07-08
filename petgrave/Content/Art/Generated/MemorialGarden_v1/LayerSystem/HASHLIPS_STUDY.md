# HashLips Study Notes For Pet Grave

## What To Keep

HashLips Art Engine is useful as a production pattern:

- Put source parts into ordered layer groups.
- Give traits weighted selection.
- Generate deterministic DNA from selected traits.
- Export images plus metadata.
- Optionally export GIF/animation outputs.
- Allow layer options such as opacity, blend mode, display names, and DNA bypass.

## What To Change For Pet Grave

Pet Grave is a game, not a static collection, so the layer system needs stricter rules:

- Species are gameplay actors, not numbered editions.
- Layers attach to anatomy landmarks before rendering.
- Animation states are required: idle, walk, interact, hurt.
- Every moving part needs an attachment point: ears to skull, tail to pelvis, legs to shoulders/hips.
- Random traits must preserve readable silhouettes at isometric camera scale.
- Generated output is a source candidate until it passes desktop and mobile gameplay QA.

## Current Implementation

`tools/pet_grave_creature_layers.py` implements the Pet Grave version:

- Reads ordered layer config from `pet-grave-creature-layers.json`.
- Selects weighted traits using a deterministic seed.
- Creates a DNA hash and metadata file.
- Draws anatomy-aware creature frames using named rig landmarks.
- Exports `preview.png`, `idle_strip.png`, `walk_strip.png`, `interact_strip.png`, and `hurt_strip.png`.

## Naming Decision

The first companion should be Pet Grave themed:

- New taxonomy id: `gravepup`
- Display name: `Gravemoss`
- Legacy runtime alias: `milo`

The legacy runtime alias remains only to avoid breaking saves and the current single-file game logic. New art pipeline output, docs, and player-facing copy should use `gravepup` / `Gravemoss`.

## Anatomy Acceptance Checklist

Before a generated creature is wired into gameplay:

- Feet visually land on the same ground plane in neutral frames.
- Tail pivots from the body, not from empty space.
- Ears move with the head and skull.
- Walk cycles alternate forelegs and hind legs.
- Hurt frames compress the body as one connected rig.
- Interact/pounce frames extend forelegs while hind legs stay grounded.
- No part detaches during scale-down at gameplay camera size.
