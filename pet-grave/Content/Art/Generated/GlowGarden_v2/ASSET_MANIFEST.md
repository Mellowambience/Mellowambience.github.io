# Milo GlowGarden v2 Generated Art Pack

Generated on 2026-06-13 with the built-in image generation tool.

## Files

- `Milo_GlowGarden_CreatureAtlas_v2.png`
  - Purpose: production-style creature sprite atlas reference for the authored v0.1 cast.
  - Use: cut into individual creature sprites or use as the source for final sprite-sheet paintovers.

- `Milo_GlowGarden_EnvironmentPropAtlas_v2.png`
  - Purpose: environment and prop atlas defining the GlowGarden shape language.
  - Use: homes, lanterns, campfire, rift brambles, path stones, world tree, flowers, fences, rocks.

- `Milo_GlowGarden_AtmosphereBackdrop_v2.png`
  - Purpose: title/menu atmosphere and key-art direction.
  - Use: title backdrop, marketing crop, and reference for in-game lighting.

- `Sprites/Creatures/*.png`
  - Purpose: transparent per-character cutouts used by the canvas renderer.
  - Use: in-world friends, battle creature views, team portraits, and codex portraits.

- `Sprites/Props/*.png`
  - Purpose: transparent environment prop cutouts.
  - Use: village homes, camp props, friend props, and future world decoration.

- `Characters/<id>/metadata.json`
  - Purpose: HashLips-style per-character metadata with role, rarity, traits, palette, layers, and animation paths.
  - Use: codex cards, future creator inventory, paid cosmetic/export tooling, and asset provenance.

- `Characters/<id>/layers/*.png`
  - Purpose: normalized base/glow/shadow layers for each cast member.
  - Use: future variant generation and consistent character compositing.

- `Characters/<id>/animations/*_strip.png`
  - Purpose: idle, cast, and hurt animation strips for the authored cast.
  - Use: in-game character motion and future sprite import pipelines.

- `Characters/_collection.json`
  - Purpose: collection-level manifest for all authored character packs.
  - Use: tooling and validation.

- `VFX/spells/*_strip.png`
  - Purpose: transparent spell/VFX animation strips keyed to each character's signature ability.
  - Use: projectile, nova, impact, snare, bloom, and halo effects in the canvas game.

- `VFX/vfx_manifest.json`
  - Purpose: manifest of spell sheet ownership, palette, frame count, and frame size.
  - Use: runtime validation and future VFX tooling.

- `Environment/*.png`
  - Purpose: layered environment art for the playable canvas scene.
  - Use: sky, far horizon, soft terrain tile source, painted ground wash, depth-sorted environmental props, and foreground foliage.

- `Environment/environment_manifest.json`
  - Purpose: draw-order manifest for layered 2.5D environment assets.
  - Use: runtime validation, future 3D/2.5D migration, and environment art iteration.

## Art Direction

- Cozy home garden in front, dangerous rift worlds in the distance.
- Warm amber lantern/campfire pools against cool violet twilight.
- Organic moss, mushrooms, rounded homes, curled brambles, and hand-painted texture.
- Original creature designs only; no Pokemon, Roblox, Fortnite, or copied IP.
- Layering rule: sky and horizon behind gameplay, painted ground under actors, depth props sorted with actors, foreground foliage on top.
