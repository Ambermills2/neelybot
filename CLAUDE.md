# NeelyBot — Project Brief (for Ryan's Claude Code)

NeelyBot is the Neely family wall-hub web app (a PWA) for the home tablet. Amber built it; Ryan is integrating it onto the tablet + Alexa. This file orients you (Ryan's Claude Code).

## How it's built / how to run

- Single static `index.html` — NO build step. Plain HTML/CSS/JS, one file, ~one big `<script>`. Edit `index.html` directly and reload.
- Farmhouse design system (CSS variables; fonts Roboto Slab / Source Sans 3 / Rye). Hash-router with a `SCR={}` map of screen functions; a reusable `openForm()` popup engine; a Hub-Code PIN gate for sensitive actions.
- Run locally:
  ```bash
  python3 -m http.server 4173 --directory .
  # then open http://localhost:4173
  ```
  (or just open `index.html` directly in a browser).
- PWA bits: `manifest.webmanifest`, `sw.js` (network-first service worker — bump the `CACHE` version string in it whenever assets change so tablets pull fresh), `icon*.png`, `apple-touch-icon.png`, `logo.png` (the final seal logo, source of truth).
- Quick JS syntax check after edits: extract the first `<script>` and `node --check` it.

## Where it lives

- LIVE: https://neelybot-gracies-grove.netlify.app (Netlify). Deploy is MANUAL via CLI: `netlify deploy --prod --dir .` (not auto-deploy from GitHub yet — connecting the repo in Netlify for push-to-deploy is a good early task).
- GitHub: github.com/Ambermills2/neelybot (private), branch `main`, SSH remote. Ryan is a collaborator (`ryanmitchellneely`).

## What is LIVE right now (pushed + deployed, as of the prior push)

The core app: Dashboard (Today / This Week / Chores / Reminders), Calendar (day/week/month/year + per-person filter), Chores (name filters, typed Add Chore form, Approvals [Hub-Code gated → approve deposits to kid's bank & logs the transaction, or reject → Undone], Undone Chores), Finance (kids' banking deposit/withdraw/goals, Bills with typed Add Bill + blue circular due-date badges, Banks), Shopping (base version), Reminders, Projects, Vault (Hub-Code), Trips, Settings (static at that point), Maintenance (Vehicles + Pros + Maintenance Reminders), Important Info (Contacts/Health/Home & Accounts/Pets/School/Dates), Remotes, Smart Home, Emergency, Music, Photos. Final seal logo + PWA installable.

## What is LOCAL-ONLY on Amber's machine (NOT pushed yet — do not assume these are live)

- **Remotes:** colored buttons + Roku/Samsung device→room filtering (Roku → Master/Boys Room/Patio; Samsung → Living Room).
- **Finance:** Edit Goal popup now includes a Price field.
- **Shopping** (big upgrade): clickable checkboxes; store tiles link to each store's app/site; a "+ Store" find-&-add-app popup; Add Item with List + Urgency dropdowns; a Price Checker (search an item, multiselect stores, cheapest-first comparison with pack/size, detail popup, add-to-list); per-item delete buttons.
- **Reminders:** Add Reminder popup automated (How Often + Who dropdowns, First Due date picker).
- **Settings:** tappable General rows (Hub Code change, Greeting editor that updates the header live, Day & Night, manage Weather Towns, Logo preview), Family info+edit popups, Connected Accounts with "+ Add Account".

Amber keeps building these locally and pushes when ready — so `main` will trail her local copy. Don't be surprised if the live site lacks a feature she described.

## Roadmap

build (Amber, ongoing, local) → push to GitHub → deploy to Netlify → run on the **Lenovo Tab P12** as a wall kiosk (Fully Kiosk Browser) → integrate **Alexa (Echo Dot)**.

Known "phase 2 / backend" items (currently UI-only placeholders or simulated):
- real data persistence + family login/auth (site is currently a public front-end prototype, search-hidden via robots)
- live product-price feed for the Price Checker (prices are realistic stand-ins now)
- two-way Alexa↔hub sync (no backend/API yet — Alexa work today is device-side: routines, Blink, music)
- a real dark-mode theme
- real smart-home device control

## Ownership / division of labor

- **Ryan** owns getting NeelyBot LIVE on the Lenovo Tab P12 (kiosk) and integrating the **Alexa Echo Dot** (routines/announcements, Blink, Spotify/Apple Music). See `RYAN-SETUP.md` for the step-by-step tablet kiosk setup, access, and an honest scope of what Alexa can/can't do today.
- **Amber** continues building features on the local site and pushes when ready.

---

Questions about app internals → read `index.html` (it's all in one file) or ask Amber. Setup/tablet/Alexa steps → `RYAN-SETUP.md`.
