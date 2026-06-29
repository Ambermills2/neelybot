# NeelyBot — Setup Guide for Ryan 🤠

Hey Ryan — this is everything you need to get **NeelyBot** running on the wall tablet
and wired up with Alexa. Amber's handing you the code; this doc walks the rest.

**What it is:** the Neely family wall hub — calendar, chores + kids' banking, reminders,
shopping, projects, trips, vehicles/maintenance, smart-home shortcuts. One web app that
runs full-screen on the wall tablet *and* installs as an app icon on family phones.

**Current state (important):** it's a working front-end prototype with **placeholder data
and no login yet**. It's safe to put on the wall tablet now; just don't load real personal
data until we add a family login. More on that at the bottom.

---

## 1. The Site

- **Live now:** https://neelybot-gracies-grove.netlify.app
- **Future home:** **NeelyBot.com** (Amber owns it; DNS not pointed at Netlify yet)
- It's a **PWA** — installable, works offline-ish (cached), updates when we redeploy.

You don't need a login to open it right now — it's public (hidden from Google via robots).

---

## 2. Access Amber Sets Up For You

| What | Why you need it | How |
|---|---|---|
| **GitHub repo** (private) `github.com/Ambermills2/neelybot` | view/edit the code | Send Amber your **GitHub username** → she adds you as a collaborator |
| **Netlify team** "Lone Star ABA" *(optional)* | redeploy / point the domain | Only if you'll handle deploys — Amber invites you by email |
| **Lenovo Tab P12** | the wall display | In hand |
| **Amazon / Alexa account** | voice + routines | Household account |
| **Blink account** | cameras into Alexa | Household account |
| **Spotify + Apple Music** | voice playback | Household accounts |

> Use your **own** GitHub login (don't reuse Amber's key). After she invites you, clone over
> HTTPS or add your own SSH key.

---

## 3. Wall Tablet (Lenovo Tab P12) — Kiosk Mode

**Recommended: Fully Kiosk Browser** (Play Store / Amazon Appstore) — built for exactly this.

1. Install **Fully Kiosk Browser**.
2. **Start URL** → `https://neelybot-gracies-grove.netlify.app`
3. Turn on:
   - **Keep screen on** / disable sleep
   - **Auto-start on boot**
   - **Fullscreen** + lock (hide nav/status bars)
   - *(optional)* **Motion/PIR wake** so it lights up when someone walks by, dims overnight
   - *(optional)* set Fully as the **launcher** so the tablet boots straight into NeelyBot
4. Set a **kiosk exit PIN** so the boys can't back out of it.

**No-extra-app alternative:** open the URL in Chrome → **⋮ → Add to Home screen** (installs the
PWA) → launch it → set screen timeout to never. Simpler, but no auto-relaunch / motion wake.

---

## 4. Alexa & Smart Home — Read This First

Right now **NeelyBot and Alexa are two separate systems.** The app is a front-end prototype
with no backend/API, so **Alexa can't read or change the hub's chores, shopping list, or
reminders yet.** Don't go looking for an integration hook — it doesn't exist yet.

**What you CAN do today** (all in the **Alexa app**, not in NeelyBot's code):
- Build **Alexa Routines / announcements** — morning briefing, chore reminders, "bedtime," etc.
- Link **Blink cameras** to Alexa.
- Link **Spotify + Apple Music** for voice playback.

**What's a future phase** (needs a backend we haven't built):
- Two-way sync — e.g. *"Alexa, add milk to the shopping list"* showing up in NeelyBot, or
  Alexa reading out today's chores. When you want this, flag Amber/Dusty to scope the data layer.

> The in-app **smart-home buttons** (Roku, Blink, lights, pet feeder, thermostat) are **UI
> placeholders** today — not wired to the real devices yet.

> Got an **Echo Show** and want *it* to display the hub instead of the tablet? Technically
> possible through the Echo's Silk browser, but it's clunky and Amazon-limited — the **Lenovo
> Tab P12 is the intended display**.

---

## 5. Deploying Code Changes

Today it's a **manual deploy** from the project folder:

```
netlify deploy --prod --dir .
```

**Better:** connect the GitHub repo in Netlify (*Site → Build & deploy → link repository*) so
**every push to `main` auto-deploys**. Recommended — then you just `git push` and it goes live.

---

## 6. Repo Quick Facts

- **Single file:** `index.html` — plain HTML/CSS/JS, **no build step**. Edit and reload.
- **PWA bits:** `manifest.webmanifest`, `sw.js` (service worker — bump the `CACHE` version in
  it when you change assets so tablets pull the new version), `icon.svg` + PNG icons.
- `netlify.toml` = publish root + SPA redirect · `robots.txt` = noindex (keeps it off Google).
- Branch: **`main`**.

---

## Heads-Up / Open Items

- **No family login yet** — the site is public (just hidden from search). Fine for a home wall
  tablet short-term; we add real auth **before** real personal data goes on it.
- The in-app **"Hub Code" PIN** is a *parent gate* for sensitive actions (vault, bank deposits,
  remove/delete) — **not** front-door security.
- **NeelyBot.com** DNS still needs pointing at Netlify (Netlify → Domain management → add custom
  domain → follow the DNS records at the registrar).

Questions → text Amber, or she'll loop in Dusty.
