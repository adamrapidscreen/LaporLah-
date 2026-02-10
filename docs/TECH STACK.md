# LaporLah — Tech Stack Document

## Purpose
This document defines ALL approved dependencies for the LaporLah project.
The Developer Agent MUST NOT introduce any dependency not listed here
without explicit approval. This is the single source of truth for what
can be imported, installed, or used.

---

## Core Framework

| Package               | Version    | Purpose                         |
|-----------------------|------------|---------------------------------|
| next                  | ^15.x      | App framework (App Router, RSC) |
| react                 | ^19.x      | UI library                      |
| react-dom             | ^19.x      | React DOM renderer              |
| typescript            | ^5.x       | Type safety                     |

## Backend / Database

| Package                      | Version | Purpose                        |
|------------------------------|---------|--------------------------------|
| @supabase/supabase-js        | ^2.x    | Supabase client SDK            |
| @supabase/ssr                 | ^0.5.x  | Server-side Supabase (cookies) |
| zod                           | ^3.x    | Schema validation              |

## Authentication

| Package               | Version | Purpose                          |
|-----------------------|---------|----------------------------------|
| @supabase/auth-helpers-nextjs | ^0.10.x | Auth helpers (if needed beyond @supabase/ssr) |

Note: Google OAuth is handled entirely by Supabase Auth configuration.
No additional auth libraries (next-auth, clerk, lucia, etc.) are permitted.

## UI / Styling

| Package                | Version | Purpose                          |
|------------------------|---------|----------------------------------|
| tailwindcss            | ^4.x    | Utility-first CSS                |
| @tailwindcss/postcss   | ^4.x    | PostCSS plugin for Tailwind v4   |
| class-variance-authority| ^0.7.x | Component variant management     |
| clsx                   | ^2.x    | Conditional classnames           |
| tailwind-merge         | ^2.x    | Merge Tailwind classes safely    |
| lucide-react           | ^0.4.x  | Icon library (ships with shadcn) |
| next-themes            | ^0.4.x  | Dark/light mode toggle           |

### shadcn/ui Components (installed via CLI, not npm)
Approved components:
button, card, badge, input, textarea, select, dialog, dropdown-menu,
avatar, tabs, progress, toast, separator, sheet, skeleton, popover,
tooltip, toggle, sonner

Install via: `npx shadcn@latest add <component>`
Do NOT install the full shadcn/ui package. Install components individually.

## PWA

| Package         | Version  | Purpose                            |
|-----------------|----------|------------------------------------|
| @serwist/next   | ^9.x     | Next.js PWA integration (config)   |
| serwist         | ^9.x     | Service worker runtime (dev dep)   |

Note: Do NOT use next-pwa, workbox directly, or any other PWA library.

## Maps & Location

| Package             | Version | Purpose                          |
|---------------------|---------|----------------------------------|
| leaflet             | ^1.9.x  | Map rendering engine             |
| react-leaflet       | ^4.x    | React wrapper for Leaflet        |
| @types/leaflet      | ^1.9.x  | TypeScript types                 |

Note: Do NOT use @react-google-maps, mapbox-gl, or any paid map service.
Tile server: OpenStreetMap (https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)
Reverse geocoding: Nominatim API only (no Google Geocoding API).

## Image Processing

| Package                      | Version | Purpose                      |
|------------------------------|---------|------------------------------|
| browser-image-compression     | ^2.x    | Client-side image compression|

Note: No server-side image processing (sharp, jimp, etc.). All compression
happens in the browser before upload.

## Fonts

| Package    | Method              | Purpose            |
|------------|---------------------|--------------------|
| Inter      | next/font/google    | Primary sans-serif |
| JetBrains Mono | next/font/google| Monospace for stats|

Note: Load via next/font/google ONLY. Do NOT use @fontsource or CDN links.

## Utilities

| Package         | Version | Purpose                            |
|-----------------|---------|------------------------------------|
| date-fns        | ^3.x    | Date formatting & relative time    |

Note: Do NOT use moment.js, dayjs, or luxon.

---

## Explicitly Forbidden

The following packages/approaches are NOT permitted in this project:

### Auth
- next-auth / auth.js
- clerk
- lucia
- firebase-auth
- passport

### Database / ORM
- prisma
- drizzle
- knex
- typeorm
- mongoose
- Any direct pg/postgres client (use Supabase SDK only)

### State Management
- redux / @reduxjs/toolkit
- mobx
- jotai
- recoil
- zustand (reconsider only if RSC + useOptimistic proves insufficient)

### CSS
- styled-components
- emotion
- CSS modules
- sass/scss

### UI Libraries
- Material UI / MUI
- Ant Design
- Chakra UI
- Mantine
- Radix primitives directly (use shadcn/ui wrappers only)

### Notifications
- firebase-messaging / FCM
- web-push
- OneSignal

### Testing (out of scope for MVP)
- jest
- vitest
- playwright
- cypress
- testing-library

### Other
- axios (use native fetch)
- lodash (use native JS methods)
- express / fastify (use Next.js API routes / Server Actions)
- socket.io (use Supabase Realtime)
- any AI/ML libraries
- any payment libraries

---

## Development Tools (devDependencies)

| Package         | Version | Purpose                 |
|-----------------|---------|-------------------------|
| eslint          | ^9.x    | Code linting            |
| eslint-config-next | ^15.x | Next.js ESLint rules  |
| prettier        | ^3.x    | Code formatting         |
| @types/node     | ^20.x   | Node.js types           |
| @types/react    | ^19.x   | React types             |

---

## Environment & Runtime

| Tool     | Version    | Notes                              |
|----------|------------|------------------------------------|
| Node.js  | ^20.x      | Required for Next.js 15            |
| npm      | ^10.x      | Package manager (no yarn/pnpm/bun) |
| Git      | latest     | Version control                    |

---

## External Services (No Additional Libraries Required)

| Service              | Access Method    | Rate Limits           |
|----------------------|------------------|-----------------------|
| Supabase             | SDK (listed above)| Free tier: 500MB DB  |
| OpenStreetMap Tiles   | URL in Leaflet   | Fair use policy       |
| Nominatim API         | fetch()          | 1 request/second max  |
| Vercel               | Git deploy       | Free tier: sufficient |
| Google OAuth          | Supabase config  | No direct API calls   |
