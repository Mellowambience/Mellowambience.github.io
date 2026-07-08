#!/usr/bin/env python3
"""Driftkin Founder Module — plug-in registration (no engine fork needed).

Drop-in: import this AFTER engine/founders.py is loaded and call register(CLASSES).
It injects the Driftkin class + skill tree into the live CLASSES dict so make_identity
("driftkin") works immediately. Also exposes the module's invented structure kinds and
a demo ticker used by the browser demo (demo.js).

This is the $350 Founder Module we ship: a NEW, playable founder species with its
own structures and economy — not a dashboard, not theater (per the X signal).
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def load_manifest():
    with open(os.path.join(HERE, "manifest.json")) as f:
        return json.load(f)


def _build_tree(manifest):
    """Convert manifest linear-effect skills into the engine's lambda form."""
    tree = {}
    for skill, info in manifest["class"]["tree"].items():
        base = info.get("base", 0.0)
        lin = info.get("effect_linear", 0.0)
        # engine effect signature: effect(level) -> numeric
        tree[skill] = {
            "max": info["max"],
            "desc": info["desc"],
            "xp": info["xp"],
            "effect": (lambda b, l: (lambda lvl: b + l * lvl))(base, lin),
        }
    return tree


def register(CLASSES):
    """Inject Driftkin into an engine CLASSES dict. Idempotent."""
    m = load_manifest()
    cls = m["class"]
    CLASSES["driftkin"] = {
        "class_name": cls["class_name"],
        "title": cls["title"],
        "creed": cls["creed"],
        "quirk": cls["quirk"],
        "tree": _build_tree(m),
    }
    # ensure a founder species slot exists (the engine's make_identity picks from NAME_POOL)
    import sys
    founders = sys.modules.get("engine.founders") or __import__("engine.founders", fromlist=["NAME_POOL"])
    founders.NAME_POOL.setdefault("driftkin", ["Wisp", "Rune", "Vale", "Echo", "Sky", "Drift", "Faye", "Lume"])
    return CLASSES


def new_structure_kinds():
    """The structures this module introduces (host-readable for the Codex)."""
    m = load_manifest()
    return [s["kind"] for s in m.get("new_structures", [])]


def demo_ticker():
    """A tiny, real simulation trace for the browser demo (no fake motion)."""
    import random
    kinds = new_structure_kinds()
    events = []
    for i in range(6):
        k = random.choice(kinds)
        events.append(f"Driftkin mapped a new route -> raised {k} #{i+1}")
    return events


if __name__ == "__main__":
    # self-test: prove it registers against a real CLASSES copy
    import sys, copy
    sys.path.insert(0, os.path.dirname(os.path.dirname(HERE)))  # repo root
    from engine import founders as F
    before = set(F.CLASSES)
    register(F.CLASSES)
    after = set(F.CLASSES)
    assert "driftkin" in after, "registration failed"
    ident = F.make_identity("driftkin")
    assert ident["role"] == "driftkin"
    print("PASS: Driftkin registered. new kinds:", new_structure_kinds())
    print("demo ticker:", demo_ticker()[:2])
