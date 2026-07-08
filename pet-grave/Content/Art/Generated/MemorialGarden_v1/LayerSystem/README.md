# Pet Grave Creature Layer System

This is the Pet Grave adaptation of the HashLips-style art engine pattern.

HashLips uses ordered folders, weighted trait filenames, DNA uniqueness, and metadata output. Pet Grave keeps the useful production ideas, but adds creature anatomy rules and animation states before a generated asset is considered usable.

## Naming

The first companion should no longer be presented as Milo. In Pet Grave taxonomy it is `gravepup`, display name `Gravemoss`. The old runtime key can remain as a compatibility alias until the save system is migrated.

## Layer Order

The canonical render order is:

1. aura
2. tail
3. hind legs
4. body
5. body marking
6. fore legs
7. head
8. ears
9. face
10. charm
11. foreground sparks

## Anatomy Rules

- Ears attach to skull landmarks.
- Tail pivots from the pelvis.
- Forelegs and hind legs move in opposing phases during walk cycles.
- Feet return to a shared ground plane.
- Head motion follows the neck and spine.
- Hurt and interact animations compress or extend the whole rig, not isolated floating parts.

## Generate

From the repo root:

```powershell
python .\tools\pet_grave_creature_layers.py --species gravepup --seed memorial-garden
python .\tools\pet_grave_creature_layers.py --species lanternkit --seed first-rescue
```

Outputs are written under:

`Content/Art/Generated/MemorialGarden_v1/LayerSystem/build`

Each creature gets:

- `preview.png`
- `idle_strip.png`
- `walk_strip.png`
- `interact_strip.png`
- `hurt_strip.png`
- `metadata.json`

## Runtime Boundary

Do not wire generated layer-system strips directly into the game until the specific creature passes desktop and mobile QA. Generated strips are source candidates until scale, anchor, and motion read correctly in the game camera.
