# Tide Merchant — Brokers of the Drifting Tide

**Module #2 of the QI-Games $350 Founder Module line** (Driftkin was #1).

A playable founder species for QI-Games. Tide Merchants read the market like a
sea: they gather crystals, sell at the **peak price window**, earn a **Haggling**
premium, carry more per trip (**Logistics**), raise **bazaars** (trade posts that
pay a nearby-selling premium) and **coffers** (which pay passive interest), and
sell at a premium when near a bazaar.

This is a *shipped artifact*, not a screenshot. The same vocation + structure
logic the engine runs in `engine/society.py` is wired in via the fail-soft module
extension points, so a Tide Merchant actually lives and trades in the world.

## What you get
- A new founder class `merchant` with a 3-skill tree (Haggling / Logistics /
  Market Sense).
- Two new structure kinds: `bazaar`, `coffer`.
- Real economy behavior: peak-timing sales, proximity premiums, interest.

## Drop-in
Copy this folder into your QI-Games instance as `modules/merchant/` and let
`build_world()` auto-load it (or call `register(CLASSES)` from
`engine/founders.py`). Then mint a world that includes the role:

```python
from engine.society import build_world, mint_game
world = mint_game("Tide Reach", seed_roles={"merchant": 1, "trader": 1, "builder": 1})
```

## Verify it actually lives
```bash
python scripts/verify_merchant.py   # headless: proves a merchant earns + builds
python modules/merchant/register.py # class self-test
```

See `demo.html` for a live, real-tick simulation in the browser.
