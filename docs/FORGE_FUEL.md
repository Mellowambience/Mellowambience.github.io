# Forge Fuel

Forge Fuel is the temporary bring-your-own-key session layer for Aetherhaven.

The product rule:

```txt
Bring temporary fuel. Choose a mission. Set limits. Draft only unless Amara approves the next action.
```

## What v0.1 does

- Lets a user choose a provider and model.
- Accepts a temporary key field for a single run.
- Requires explicit consent.
- Allows only draft output in the public static MVP.
- Exports the run result as Markdown.
- Supports a future server-side worker through `window.AETHER_FORGE_FUEL_ENDPOINT`.

## What it does not do

- It does not store keys in browser storage.
- It does not commit code.
- It does not create GitHub issues.
- It does not open pull requests.
- It does not send email or post social updates.
- It does not merge anything.

## Real backend shape

```txt
Aetherhaven static site
  -> Forge Fuel UI
  -> server-side worker
  -> temporary provider request
  -> draft result
  -> key discarded
```

## Recommended permission gates

```txt
Analyze project context       public/demo safe
Draft docs/tasks/roadmap      public/demo safe
Create GitHub issues          private authenticated only
Open pull request             private authenticated only
Merge pull request            never automatic
Send email/social post        never automatic
```

## Production note

Use server-side secret storage for owner-owned provider credentials. For public BYOK, accept a temporary key only in memory for one request, never log it, and discard it immediately after the run.
