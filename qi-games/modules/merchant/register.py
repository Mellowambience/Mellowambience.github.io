#!/usr/bin/env python3
"""Tide Merchant Founder Module — plug-in registration (no engine fork needed).

Drop-in: import AFTER engine/founders.py is loaded and call register(CLASSES).
Injects the Tide Merchant class + skill tree into the live CLASSES dict so
make_identity("merchant") works. Additionally wires REAL live-sim behavior into
the engine via the fail-soft module extension points (VOCATION_MODULES /
STRUCTURE_MODULES) so merchants actually gather, sell at the market's PEAK, raise
bazaars/coffers, earn a Haggling premium, and draw Coffer interest -- not just
stand around.

This is Module #2 of the $350 Founder Module line (Driftkin was #1). Shipped
artifact, verified by scripts/playtest + a headless merchant sim
(scripts/verify_merchant.py).
"""
import json
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

# engine imports are resolved lazily via __import__ so this module can be
# imported standalone (self-test) without forcing a full engine import.
def _engine():
    return __import__("engine.society", fromlist=["MARKET_POS", "spawn_structure",
                                                  "move_toward", "nearest", "BUILD_COST"])


def load_manifest():
    with open(os.path.join(HERE, "manifest.json")) as f:
        return json.load(f)


def _build_tree(manifest):
    """Convert manifest linear-effect skills into the engine's lambda form."""
    tree = {}
    for skill, info in manifest["class"]["tree"].items():
        base = info.get("base", 0.0)
        lin = info.get("effect_linear", 0.0)
        tree[skill] = {
            "max": info["max"],
            "desc": info["desc"],
            "xp": info["xp"],
            "effect": (lambda b, l: (lambda lvl: b + l * lvl))(base, lin),
        }
    return tree


def _merchant_vocation(ecs, dt, eid):
    """Real merchant behavior in the live sim.

    - gather crystals toward capacity (Logistics raises the cap)
    - sell at the MARKET only at the peak price window (Market Sense widens it)
    - earn a Haggling bonus per sale
    - sell at a premium when near a bazaar
    - spend coin to raise a bazaar / coffer (like a builder, but rarer)
    """
    from engine.founders import grant_xp, skill_effect
    S = _engine()
    MARKET_POS = S.MARKET_POS
    spawn_structure = S.spawn_structure
    move_toward = S.move_toward
    nearest = S.nearest
    BUILD_COST = S.BUILD_COST

    pos = ecs.get(eid, "Position")
    vel = ecs.get(eid, "Velocity")
    coins = ecs.get(eid, "Coins")
    carry = ecs.get(eid, "Carry")
    bcd = ecs.get(eid, "BuildCD")
    ident = ecs.get(eid, "Identity")

    sense = (skill_effect(ident, "Market Sense") if ident else 0.0)
    haggle = (skill_effect(ident, "Haggling") if ident else 0.0)
    cap = int(skill_effect(ident, "Logistics") if ident else 1)
    cap = max(1, cap)

    m = ecs.get(0, "Market")
    price = m["price"] if m else 1.0
    # Market Sense widens the sell window toward the peak
    peak = max(1.0, 1.3 - 0.1 * (sense if sense else 0.0))
    sell_now = price >= peak

    # build a bazaar / coffer when flush with coin (rarer than a builder)
    bcd["t"] = max(0.0, bcd["t"] - dt)
    if coins["n"] >= BUILD_COST and bcd["t"] <= 0 and random.random() < 0.02:
        kind = random.choice(["bazaar", "coffer"])
        spawn_structure(ecs, kind, pos["x"], pos["y"], eid)
        coins["n"] -= BUILD_COST
        bcd["t"] = 4.0
        if ident:
            grant_xp(ident, "build")
        return

    # sell at market when carrying and (at peak or bag is full)
    if carry["crystal"] > 0 and (sell_now or carry["crystal"] >= cap):
        if move_toward(pos, vel, MARKET_POS["x"], MARKET_POS["y"]):
            bonus = int(haggle)
            # bazaar proximity premium
            for o in ecs.query("Position", "Structure"):
                so = ecs.get(o, "Position")
                sto = ecs.get(o, "Structure")
                if sto and sto.get("kind") == "bazaar":
                    d2 = (so["x"] - pos["x"]) ** 2 + (so["y"] - pos["y"]) ** 2
                    if d2 < 4.0:
                        bonus += int(carry["crystal"] * 0.25)
                        break
            coins["n"] += int(carry["crystal"] * price) + bonus
            carry["crystal"] = 0
            if ident:
                grant_xp(ident, "sell")
            return

    # gather crystals toward capacity
    if carry["crystal"] < cap:
        crys = ecs.query("Position", "Crystal")
        if crys:
            t = nearest(ecs, eid, "Crystal")
            p = ecs.get(t, "Position")
            if move_toward(pos, vel, p["x"], p["y"]):
                carry["crystal"] += 1
                ecs.components["Crystal"].pop(t, None)
                if ident:
                    grant_xp(ident, "gather")
            return

    vel["x"] *= 0.9
    vel["y"] *= 0.9


def _coffer_tick(ecs, dt, s, st, p):
    """A coffer pays passive interest to its founder owner each production period."""
    by = st.get("by")
    if by is None or by < 0:
        return  # only founder-owned coffers accrue (player coffers are client-side)
    coins = ecs.get(by, "Coins")
    if coins:
        coins["n"] += 0.1  # interest per production period


def register(CLASSES):
    """Inject Tide Merchant into an engine CLASSES dict + wire live behavior.
    Idempotent and fail-soft (engine hooks only wire if society is loaded)."""
    m = load_manifest()
    cls = m["class"]
    CLASSES["merchant"] = {
        "class_name": cls["class_name"],
        "title": cls["title"],
        "creed": cls["creed"],
        "quirk": cls["quirk"],
        "tree": _build_tree(m),
    }
    # ensure a founder species slot exists
    founders = sys.modules.get("engine.founders") or __import__(
        "engine.founders", fromlist=["NAME_POOL"])
    founders.NAME_POOL.setdefault(
        "merchant", ["Tide", "Maris", "Cove", "Reef", "Sol", "Bay", "Lux", "Shoal"])
    # wire real live-sim behavior (fail-soft: only if society is loaded in this process)
    try:
        import engine.society as S
        S.VOCATION_MODULES["merchant"] = _merchant_vocation
        S.STRUCTURE_MODULES["coffer"] = _coffer_tick
    except Exception:
        pass
    return CLASSES


def new_structure_kinds():
    m = load_manifest()
    return [s["kind"] for s in m.get("new_structures", [])]


def demo_ticker():
    kinds = new_structure_kinds()
    return [f"Tide Merchant read the tide -> raised {k} #{i+1}"
            for i, k in enumerate(random.sample(kinds * 3, 6))]


if __name__ == "__main__":
    # self-test: prove it registers against a real CLASSES copy
    sys.path.insert(0, os.path.dirname(os.path.dirname(HERE)))  # repo root
    from engine import founders as F
    before = set(F.CLASSES)
    register(F.CLASSES)
    after = set(F.CLASSES)
    assert "merchant" in after, "registration failed"
    ident = F.make_identity("merchant")
    assert ident["role"] == "merchant"
    print("PASS: Tide Merchant registered. new kinds:", new_structure_kinds())
    print("demo ticker:", demo_ticker()[:2])
