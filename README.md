# Balcony Plant Watering

A progressive web app for balcony plants with smart watering reminders, weather-aware scheduling, and an accessible dashboard.

## Project structure

- `public/` — PWA assets, manifest, service worker, icons
- `src/` — React app, plant profiles, scheduler, weather service, dashboard components
- `.env.example` — Example environment variables for weather coordinates
- `package.json` — Build and development scripts
- `tsconfig.json` — TypeScript configuration
- `vite.config.ts` — Vite configuration

## Features included

- Plant dashboard with watering status per plant
- Smart scheduler by plant type and season
- Open-Meteo weather integration for rain-aware reminders
- Installable PWA with service worker caching
- LocalStorage persistence for last-watered history

## Setup

```bash
cd "Plant Pulse"
npm install
cp .env.example .env
# Fill VITE_WEATHER_LAT and VITE_WEATHER_LON in .env
npm run dev
```

## Environment variables

```env
VITE_APP_NAME=Balcony Plant Watering
VITE_WEATHER_LAT=51.5072
VITE_WEATHER_LON=-0.1276
VITE_PUSH_PUBLIC_KEY=
```

## Notes

- This version is intentionally software-only. It does not require hardware sensors.
- Push notification support is scaffolded, but a backend push subscription endpoint is not included.
- Weather data is fetched from Open-Meteo and used to skip reminders after recent rain.
