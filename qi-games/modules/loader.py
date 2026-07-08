#!/usr/bin/env python3
"""Module auto-loader — makes 'drop a folder in modules/, it registers' real.

Scans modules/*/ for a register.py exposing register(CLASSES) and calls it.
This is D3 from TECH_DEBT.md: Driftkin currently requires a manual
`import register; register.register(CLASSES)`. After this, the engine (or any
host) calls load_all_modules(CLASSES) once and every module is live.

Safe: a broken module logs + is skipped (never crashes the world).
"""
import os
import sys
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load_all_modules(CLASSES, base=HERE):
    """Import every modules/<name>/register.py and call register(CLASSES).

    Returns list of module ids that registered successfully.
    Broken modules are logged and skipped (fail-soft) so one bad module
    can't take down the world.
    """
    loaded = []
    if base not in sys.path:
        sys.path.insert(0, base)
    for name in sorted(os.listdir(base)):
        moddir = os.path.join(base, name)
        reg = os.path.join(moddir, "register.py")
        if not os.path.isdir(moddir) or not os.path.isfile(reg):
            continue
        try:
            spec = importlib.util.spec_from_file_location(f"qimod_{name}", reg)
            m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(m)
            if hasattr(m, "register"):
                m.register(CLASSES)
                loaded.append(name)
            else:
                print(f"[modules] {name}/register.py has no register(CLASSES) — skipped")
        except Exception as e:  # noqa — fail-soft
            print(f"[modules] FAILED to load '{name}': {e} — skipped (world continues)")
    return loaded


if __name__ == "__main__":
    # self-test against the real engine CLASSES
    sys.path.insert(0, ROOT)
    from engine import founders as F
    before = set(F.CLASSES)
    loaded = load_all_modules(F.CLASSES)
    added = set(F.CLASSES) - before
    print("registered modules:", loaded)
    print("new classes:", sorted(added))
    assert "driftkin" in added, "auto-loader failed to register driftkin"
    print("PASS: module auto-loader registers all modules with fail-soft isolation.")
