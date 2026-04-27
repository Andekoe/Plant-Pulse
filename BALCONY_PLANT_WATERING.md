# 🌿 Balcony Plant Watering Assistant

A smart, software-only watering reminder system for balcony plants — no new hardware required.

---

## 📋 Project Overview

**Problem:** Balcony plants (palm, lavender, olive tree, oregano, rosemary) keep dying — likely due to inconsistent watering (too much or too little).

**Goal:** A cross-platform software solution that notifies the right person at the right time to water the right plant — usable by multiple family members, no new hardware needed.

**Approach:** A Progressive Web App (PWA) with a plant database, smart watering schedules based on plant type + season + weather data, and push notifications — accessible from any smartphone browser.

---

## 🌱 Plants in Scope

| Plant | Size | Watering Profile |
|---|---|---|
| Palm | Small | Moderate, avoid waterlogging |
| Lavender | Small | Dry-tolerant, infrequent |
| Olive Tree | Medium | Drought-tolerant, deep watering |
| Oregano | Small | Dry-tolerant, light watering |
| Rosemary | Small | Very drought-tolerant |

---

## 🏗️ Proposed Project Structure

```
balcony-plants/
├── .github/
│   └── copilot-instructions.md        ← Agent behavior rules (see below)
├── public/
│   ├── manifest.json                  ← PWA manifest
│   ├── sw.js                          ← Service worker (push notifications)
│   └── icons/
├── src/
│   ├── plants/
│   │   ├── plantDatabase.ts           ← Plant profiles & watering rules
│   │   └── wateringScheduler.ts       ← Scheduling logic
│   ├── weather/
│   │   └── weatherService.ts          ← Free weather API integration
│   ├── notifications/
│   │   └── pushService.ts             ← Web Push API
│   ├── dashboard/
│   │   ├── Dashboard.tsx              ← Main UI component
│   │   └── PlantCard.tsx              ← Per-plant status card
│   ├── store/
│   │   └── plantStore.ts              ← State management
│   └── main.tsx                       ← App entry point
├── .env.example                       ← Required env vars (no secrets committed)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                          ← This file
└── BALCONY_PLANT_WATERING.md          ← Project brief (this file)
```

---

## 🧠 Solution Design

### Tech Stack (cost-free, no hardware)

- **Frontend:** React + TypeScript + Vite (fast, modern, free)
- **PWA:** Service Worker + Web Push API (native push notifications, no app store needed)
- **Weather:** Open-Meteo API (free, no API key required)
- **State/Storage:** localStorage / IndexedDB (no backend needed initially)
- **Notifications:** Web Push (works on Android; iOS 16.4+ with PWA install)
- **Hosting:** Vercel or GitHub Pages (free tier)

### How It Works

1. User opens the PWA and grants notification permission
2. Each plant has a watering profile (frequency, amount, drought tolerance)
3. The app fetches local weather data daily (rainfall, temperature, humidity)
4. The scheduler adjusts watering reminders based on weather (skip if it rained, increase frequency in heat)
5. Push notifications are sent to all subscribed family members at the right time
6. Users confirm watering via the dashboard → schedule resets

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- VS Code with GitHub Copilot enabled

### Setup

```bash
git clone <your-repo-url>
cd balcony-plants
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

```env
VITE_APP_NAME=Balcony Plant Watering
VITE_PUSH_PUBLIC_KEY=         # VAPID public key (generate with web-push)
PUSH_PRIVATE_KEY=             # VAPID private key (keep secret, server-side only)
VITE_WEATHER_LAT=             # Your balcony latitude
VITE_WEATHER_LON=             # Your balcony longitude
```

---

## 📱 Features

- [ ] Plant dashboard with watering status per plant
- [ ] Smart schedule based on plant type + season
- [ ] Weather-aware adjustments (Open-Meteo API)
- [ ] Push notifications for all subscribed users
- [ ] "Mark as watered" confirmation
- [ ] Multi-user support (wife can subscribe on her phone)
- [ ] PWA installable on home screen (iOS + Android)
- [ ] Offline-capable

---

## 🧩 GitHub Copilot Agent Instructions

> See `.github/copilot-instructions.md` for the full agent config.  
> Summary below — the full file is the authoritative source.

The Copilot agent working on this project should:

- Act as a **Senior Full-Stack Developer** with strong TypeScript and PWA experience
- **Ask clarifying questions** before implementing anything ambiguous
- Always **weigh cost vs. benefit** — prefer free-tier solutions, avoid unnecessary dependencies
- Write **clean, well-commented code** that a non-expert can understand
- Suggest the **simplest solution first**, then offer alternatives if needed
- Never introduce a paid service or new hardware dependency without explicit approval
- Prefer **progressive enhancement** — the app must work on older phones too

---

## 📄 `.github/copilot-instructions.md` — Full Agent Config

> Copy this content into `.github/copilot-instructions.md` in your repo:

```markdown
# GitHub Copilot Agent Instructions

## Role
You are a Senior Full-Stack Developer working on a family-use PWA for balcony plant 
watering reminders. You write production-quality TypeScript/React code, make 
pragmatic architectural decisions, and always keep the end users (non-technical 
family members) in mind.

## Behavior Rules

### Before implementing
- If a requirement is unclear or has multiple valid approaches, STOP and ask.
- State your assumptions explicitly before writing code.
- If a task seems large, break it into steps and confirm the plan first.

### Cost & complexity awareness
- Always prefer free, open-source, or already-included solutions.
- Do not introduce new npm packages without justification (bundle size, maintenance).
- Do not suggest paid APIs, cloud services, or new hardware.
- If a simpler solution exists (even if less elegant), prefer it and explain why.

### Code quality
- Use TypeScript strictly — no `any` types without a comment explaining why.
- Write JSDoc comments for all exported functions.
- Keep components small and single-responsibility.
- Prefer readable code over clever code.

### Security
- Never hardcode secrets or API keys — use .env files.
- Do not commit .env files — only .env.example.
- Validate all user inputs, even in a family-only app.

### UX awareness
- The app is used by non-technical users on mobile phones.
- UI must be simple, large tap targets, clear status indicators.
- Notifications must be actionable and not annoying (max 1/day per plant).

## Plant Domain Knowledge

| Plant | Water Frequency (summer) | Drought Tolerance | Notes |
|---|---|---|---|
| Palm (small) | Every 2–3 days | Low–Medium | No waterlogging, check soil |
| Lavender (small) | Every 5–7 days | High | Prefers dry, skip after rain |
| Olive Tree (medium) | Every 3–5 days | High | Deep watering preferred |
| Oregano (small) | Every 4–6 days | High | Let soil dry between watering |
| Rosemary (small) | Every 5–7 days | Very High | Almost never overwater |

Reduce all frequencies by ~50% in winter. Skip watering if >5mm rain in last 24h.

## Architecture Decisions (already made — do not re-propose)
- PWA with React + TypeScript + Vite
- Web Push API for notifications (no third-party push service)
- Open-Meteo for weather (free, no key)
- No backend initially — localStorage/IndexedDB for state
- Vercel or GitHub Pages for hosting

## Out of Scope
- Hardware sensors
- Paid services
- Native mobile apps (iOS App Store / Google Play)
- Backend server (unless push notifications require it — discuss first)
```

---

## 📚 Resources

- [Open-Meteo API Docs](https://open-meteo.com/en/docs) — free weather API
- [Web Push Protocol](https://web.dev/articles/push-notifications-overview) — MDN & Google
- [PWA on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — Safari Web Push support
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) — easiest PWA setup for Vite
- [VAPID Key Generator](https://web-push-codelab.glitch.me/) — generate push keys

---

## 🗓️ Suggested Development Phases

**Phase 1 — Foundation (Week 1)**
- Project scaffold, PWA setup, plant database
- Basic dashboard UI with plant cards

**Phase 2 — Smart Scheduling (Week 2)**
- Watering logic per plant type + season
- Open-Meteo weather integration

**Phase 3 — Notifications (Week 3)**
- Web Push setup (VAPID keys, service worker)
- Multi-device subscription (wife's phone)

**Phase 4 — Polish & Deploy (Week 4)**
- UX refinements, offline support
- Deploy to Vercel / GitHub Pages

---

*No new hardware. No subscriptions. Just smarter watering.* 🌿
