# NeelyBot — Gracie's Grove Family Wall Hub

A rustic-farmhouse family dashboard for the Neely family, built to run full-screen on a
wall-mounted Lenovo Tab P12 (kiosk) and install as a PWA on the family's phones.

**Live site:** https://neelybot.com  *(once DNS is pointed)*

## What this is
A single-page web app (`index.html`) — no build step, no server required. It uses a
hash-based router (`#home`, `#chores`, `#finance`, etc.) and renders every screen in plain
HTML/CSS/JS. It is currently a **front-end prototype with placeholder data**; the live data
layer and family login are a later phase.

## Run it locally
```bash
python3 -m http.server 4173 --directory .
# then open http://localhost:4173
```

## Files
| File | Purpose |
| --- | --- |
| `index.html` | The entire app (UI + screens + router). |
| `manifest.webmanifest` | PWA metadata (name, icons, theme) so it installs as an app. |
| `sw.js` | Service worker — network-first with an offline cache fallback. |
| `icon.svg` / `icon-*.png` | App icons (engraved Highland-cow seal). **Placeholder until the final logo lands.** |
| `netlify.toml` | Netlify hosting config (SPA fallback + headers). |
| `robots.txt` | Tells search engines not to index this private family app. |

## Deploy
Hosted on **Netlify**, connected to this GitHub repo. Every push to `main` auto-deploys.

## Hand-off — automation (Ryan)
The web app above is the dashboard. The automation lives outside this repo:
- **Tablet kiosk:** load `https://neelybot.com` in Fully Kiosk Browser on the Lenovo Tab P12; "Add to Home Screen" to install the PWA.
- **Alexa / smart home:** Echo voice + routines, Blink cameras, smart switches, Spotify —
  configured in the Alexa app, not in this codebase. The dashboard's smart-home controls
  are UI placeholders to be wired to the real devices/APIs in a later phase.

## To do (later phases)
- Final logo (replace the placeholder cow seal everywhere).
- Family login + real data backend (the screens currently show demo data).
- Wire smart-home / music / camera controls to live device APIs.
