# ghostline — Code Wiki

> Auto-generated local documentation. Source of truth is the code; this is a map.

**Modules found:** 11

## Index

- [accountwatch](#accountwatch) — accountwatch CLI — Click-based entrypoint.
- [bookmark-audit](#bookmark-audit) — bookmark-audit — audit a browser bookmarks export for dual-use / risky links.
- [ghost-scan](#ghost-scan) — (no docstring)
- [ghostdns](#ghostdns) — (no docstring)
- [merch](#merch) — (no docstring)
- [phantomtrace](#phantomtrace) — phantomtrace CLI — Click entrypoint.
- [shadowaudit](#shadowaudit) — shadowaudit CLI — Click entrypoint.
- [tests](#tests) — Tests for the ghostline profile/report/doctor layer (offline, no network).
- [vaultcheck](#vaultcheck) — vaultcheck CLI — Click-based entrypoint.
- [web](#web) — (no docstring)
- [(root scripts)](#(root scripts)) — 3 top-level scripts

## accountwatch

- **Files:** 12 · **LOC:** 626
- **Purpose:** accountwatch CLI — Click-based entrypoint.

# accountwatch

> **Recovery contact backdoor detector.** Part of the [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## Why this exists

On March 2, 2026, an unauthorized third party silently added `nsh11@myyahoo.com` to a Meta Accounts Center as a recovery contact — without notifying the account owner, without requiring approval from existing verified contacts, and without any detection mechanism on Meta's end.

The attacker now had a permanent backdoor: password resets, 2FA intercepts, account lockout. Meta's platform did nothing. `accountwatch` does.

> *This is the exact attack it detects. It happened to the person who built it.*

---

## What it does

`accountwatch` monitors your platform accounts for unauthorized recovery contact additions — emails and phone numbers — and alerts you the moment anything changes, before the attacker can use it.

- Polls connected platform APIs on a configurable schedule
- Compares live contacts against a **locally-stored, HMAC-signed baseline** (never uploaded)
- Alerts via terminal, desktop notification, Discord/Slack/Telegram webhook, or SMTP
- Writes an **immutable append-only au

---

## bookmark-audit

- **Files:** 4 · **LOC:** 499
- **Purpose:** bookmark-audit — audit a browser bookmarks export for dual-use / risky links.

# bookmark-audit

> **Browser bookmark dual-use auditor.** Part of the [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## What it does

A browser bookmarks HTML export (Firefox / Netscape format) is a plain-text
inventory of everywhere you've pointed your browser. This tool parses it and
**shows you the dual-use security surface** in your own collection — disposable
identity services, default-credential lookups, hash crackers, wifi audit tools,
and recovery utilities.

- Parses every link + its folder path from **two formats**:
  - Netscape/Firefox HTML exports (`bookmarks.html`)
  - Chromium JSON bookmarks (Chrome / Edge / Opera GX / Brave — `Bookmarks` file)
  - Format is auto-detected — just point it at either file
- Classifies each link into a dual-use category (or benign)
- Emits a categorized inventory: **markdown / csv / json**
- Optionally writes a **CLEAN** export (favicon base64 stripped → tiny file)
- Optionally writes a **RISK-SPLIT** export (dual-use links routed to a separate
  `DUAL-USE (authorized audit only)` folder)

**Possession is legal. The line is *whose* network/account you point the tool at.**
Thi

---

## ghost-scan

- **Files:** 7 · **LOC:** 8753
- **Purpose:** see README

# ghost-scan

> **TCP connect port scanner + service fingerprinter.** Part of the
> [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## ⚠ Authorized use only

**Only scan hosts and networks you own or are explicitly authorized to test.**
Scanning networks without permission can violate computer-misuse and other
laws. By default, `ghost-scan` targets **localhost (127.0.0.1)** and will only
scan a remote host when you pass one explicitly.

---

## What it does

- **TCP connect scanning** — built on the standard-library `socket`, no raw
  sockets, **no root required**.
- **Service fingerprinting** — classifies ~8,000 well-known ports to service
  names (nmap-services derived).
- **Banner grabbing** — optionally reads the first bytes a service sends.
- **Fast, parallel** — bounded thread pool (default 200 workers).
- **JSON + file export** — pipe-friendly output for automation.

> Note: connect scanning (not SYN/half-open) is intentionally the only mode —
> it is safer, privilege-free, and far less likely to be mistaken for an attack.

---

## Install

```bash
git clone https://github.com/Mellowambience/ghostline.git
cd ghost

---

## ghostdns

- **Files:** 6 · **LOC:** 612
- **Purpose:** see README

# ghostdns

> **DNS resolver comparison + leak test.** Part of the [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## Why this exists

DNS is the quietest surveillance channel most people never think about. Every website, app, and API you open starts with a DNS lookup — and the resolver that answers that lookup sees *where you're going*, even when the traffic itself is encrypted. If your queries don't reach the resolver you think they do (your VPN's, your chosen privacy resolver), that's a **DNS leak**: your ISP, a captive portal, or a malicious network can log a near-complete map of your activity.

`ghostdns` gives you two things:

1. **Resolver comparison** — ask Cloudflare, Google, Quad9, OpenDNS *and* your system resolver the same question and see if they disagree. Disagreement can reveal cache poisoning, a hijacked resolver, split-horizon DNS, or a simple misconfiguration.
2. **Client-side leak detection** — generate a random, never-cached subdomain, ask your default resolver for it, and compare against public resolvers to spot a resolver that is doing something it shouldn't.

---

## What it does

- Queries multipl

---

## merch

- **Files:** 0 · **LOC:** 0
- **Purpose:** see README

# Ghostline Merch

> Wear the threat model.

Print-on-demand via **Printful** → **Stripe Checkout** → Ghost-branded storefront.

## Product Line v1

| Product | Design | Status |
|---------|--------|--------|
| Tee — "I am the threat model" | White text on void black | 🎨 Designing |
| Tee — Ghost skull logo | Minimal ghost + lock icon | 🎨 Designing |
| Tee — "chmod 777 my heart" | Terminal green on black | 🎨 Designing |
| Hoodie — Ghostline wordmark | Electric mint on black | 🎨 Designing |
| Sticker pack | Terminal prompts + ghost glitch art | 🎨 Designing |
| Enamel pin — ghost + lock | Ghost skull / padlock | 📋 Planned |

## Store Stack

- **Fulfillment**: Printful (zero inventory)
- **Payments**: Stripe Checkout
- **Storefront**: Vercel / GitHub Pages
- **Theme**: Void black + electric mint

## Status

🚧 In progress — storefront coming soon

---

## phantomtrace

- **Files:** 6 · **LOC:** 237
- **Purpose:** phantomtrace CLI — Click entrypoint.

# phantomtrace

> **Public-data OSINT recon toolkit.** Part of the [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## ⚠ Authorized use only

`phantomtrace` queries **only data that is already public** — DNS records, TLS
certificate metadata, HTTP response headers, and WHOIS registration data. It
performs **no** enumeration of private assets, no brute-forcing, no scraping of
authenticated content.

**You must only investigate targets you are authorized to assess.** Misuse
against systems you do not own or have permission to test may violate computer
misuse, privacy, and other laws. The operators bear sole responsibility.

---

## What it does

`phantomtrace recon` runs a single, read-only recon pass over public signals and
reports:

- **DNS** — A / AAAA / MX / TXT / NS records
- **TLS certificate** — subject, issuer, validity window, SAN
- **HTTP headers** — as returned by the server (redirects followed)
- **WHOIS** — registrar, creation/expiry, name servers (where published)

---

## Install

```bash
git clone https://github.com/Mellowambience/ghostline.git
cd ghostline/phantomtrace
pip install -e .
```

---

## Quick st

---

## shadowaudit

- **Files:** 6 · **LOC:** 292
- **Purpose:** shadowaudit CLI — Click entrypoint.

# shadowaudit

> **Non-destructive web-app security checklist generator.** Part of the
> [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## ⚠ Authorized use only

`shadowaudit` performs **non-destructive** checks only: it reads publicly
visible HTTP security headers, TLS/transport behavior, and redirect hygiene. It
does **not** perform injection testing, fuzzing, auth bypass, or any action that
writes to or mutates the target.

**Only audit targets you are authorized to assess.** Unauthorized scanning or
testing of systems you do not own may violate computer-misuse and other laws.

---

## What it does

`shadowaudit audit <target>` probes a URL and scores it against a checklist of
safe, observable security signals:

- Served over **HTTPS**
- **HTTP → HTTPS** redirect
- Presence of key **security headers**:
  - `Strict-Transport-Security`
  - `Content-Security-Policy` (also checks for recommended directives)
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`

Each check returns **pass / warn / fail** with a remediation hint. The run ends
with a hardening score (`score / max_s

---

## tests

- **Files:** 1 · **LOC:** 38
- **Purpose:** Tests for the ghostline profile/report/doctor layer (offline, no network).

---

## vaultcheck

- **Files:** 7 · **LOC:** 625
- **Purpose:** vaultcheck CLI — Click-based entrypoint.

# vaultcheck

> **Password strength analyzer + HIBP breach checker.** Part of the [Ghostline](https://github.com/Mellowambience/ghostline) cybersecurity suite.

*Invisible. Inevitable.*

---

## ⚠️ Read this first

- **Do not run `vaultcheck` with your real passwords on a shared, multi-user, or compromised machine.** Anyone with access to that machine (or its shell history, process list, or a keylogger) could capture what you type. Use it on a machine you control and trust.
- The breach check uses **k-anonymity**: only the **first 5 hex characters of the SHA-1 hash** of your password are ever sent to HaveIBeenPwned. **The password itself and the full hash never leave your machine.** That is by design — do not "improve" this by sending more.
- This is a **defensive / authorized-use** tool only. Run it against your own passwords.

---

## Why this exists

Most "password strength meters" are games of vibes — they reward `P@ssw0rd1!` because it hits character-class checkboxes while being trivially crackable. `vaultcheck` does two concrete things instead:

1. **Measures real entropy** (Shannon bits) and converts it to a pessimistic crack-time estimate.
2. **Checks your password against 

---

## web

- **Files:** 0 · **LOC:** 0
- **Purpose:** see README

# Ghostline Web Dashboard

> Premium layer. Dark theme. Mint accents.

Next.js dashboard providing a visual interface over all Ghostline CLI modules.

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS (custom Ghostline theme)
- shadcn/ui (dark variant)
- API routes wrapping CLI module outputs

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | CLI only (open source) |
| Dashboard | $9/mo | Unlimited scans, history, exports |
| Pro | $29/mo | API access, team seats, custom reports |

## Status

📋 Planned — Month 2 target

---

## (root scripts)

- **Files:** 3 · **LOC:** 327
- **Purpose:** 3 top-level scripts

---
