# Pet Grave Memorial Garden v1 Art Pack

## Purpose

Non-destructive visual refresh candidates for Pet Grave: Memorial Garden.

This pack should replace the current GlowGarden assets only after slicing, sizing, and in-browser QA. The menu backdrop is safe to use immediately because the game references it as one full background image.

Animation requirement: no asset from this pack should be considered production-ready until it has authored animation frames or a lightweight procedural motion plan.

## Files

| File | Purpose | Status |
| --- | --- | --- |
| `Concepts/PetGrave_MemorialGarden_KeyArt_v1.png` | Overall visual direction and mood target | Reference |
| `Menu/PetGrave_MenuBackdrop_MemorialGarden_v1.png` | Title/menu background | Wired into `index.html` |
| `Creatures/gravepup.png` | First sliced Gravemoss production candidate | Wired into `index.html` with procedural motion |
| `Creatures/pip.png` | Second sliced companion production candidate | Wired into `index.html` with procedural motion |
| `Atlases/PetGrave_CreatureAtlas_MemorialGarden_v1.png` | Candidate source sheet for pets/spirits | Needs slicing and normalization |
| `Atlases/PetGrave_PropsTerrainAtlas_MemorialGarden_v1.png` | Candidate source sheet for props/terrain | Needs slicing and normalization |

## Visual Direction

- Emotional cozy-haunted garden
- Memorial fire as the heart of the scene
- Soft moss, lanterns, pale mint spirit glow
- Warm amber safety against deep plum corruption
- Lost pets feel gentle, not collectible-monster branded

## Integration Plan

1. Use the menu backdrop immediately.
2. Use `Creatures/gravepup.png` and `Creatures/pip.png` as the first small production slices.
3. Review the remaining creature and props atlases visually.
4. Slice approved atlas items into the existing expected paths.
5. Add animation coverage:
   - Creatures: idle, move, hurt, and cast/interact.
   - Spirits: aura pulse, blink, and secondary float.
   - Props: lantern flicker, fire pulse, flower sway, water shimmer, mist drift, or bramble twitch.
6. Normalize scale and anchors.
7. Test boot, menu, gameplay, mobile controls, animation smoothness, and missing asset fallbacks.
8. Only then replace or switch the live art root.

## Approval Boundary

Do not push or publish this art refresh to GitHub Pages until the user approves.
