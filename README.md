# LaporLah!

**Komuniti Pantau, Komuniti Baiki** — Community-driven civic issue reporting for Malaysia.

Report neighbourhood issues, track their progress, and earn rewards as your community gets things fixed.

---

## What is LaporLah?

LaporLah lets citizens report infrastructure and community issues—potholes, broken streetlights, illegal dumping, safety concerns, and more—with a photo and location. Reports move through clear statuses (Open → In Progress → Resolved → Closed). The community can follow reports, comment, and verify when a fix is done. Built for Malaysian communities as a mobile-first Progressive Web App.

- **Report with photo and location** — Take or attach a photo, add a pin, choose a category. Reports go live instantly.
- **Follow and track status** — Follow reports that matter to you; get updates as status changes.
- **Community verification** — When a report is marked resolved, followers can vote to confirm. After enough confirmations, the report closes and contributors earn points.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Backend | Supabase (Auth, PostgreSQL, Storage, Realtime) |
| Styling | Tailwind CSS 4, shadcn/ui |
| Maps | Leaflet, react-leaflet |
| PWA | Serwist (@serwist/next) |
| Validation | Zod |

---

## Gamification

**Points** — Earn points for actions (approximate values):

| Action | Points |
|--------|--------|
| Create report | 10 |
| Comment | 5 |
| Follow a report | 3 |
| Confirmation vote | 8 |
| Report closed (as creator) | 25 |
| Resolution confirmed (as resolver) | 15 |

**Badges** — Three badge types with Bronze, Silver, and Gold tiers:

| Badge | Metric | Bronze | Silver | Gold |
|-------|--------|--------|--------|------|
| Spotter | Reports created | 1 | 3 | 8 |
| Kampung Hero | Comments on others' reports | 3 | 10 | 25 |
| Closer | Confirmed resolutions | 1 | 3 | 10 |

**Streaks** — Daily activity is tracked; maintain streaks to build consistency and visibility (e.g. Top Contributors on the admin dashboard).

---

## Special Features

**Share from gallery to report** — With LaporLah installed as a PWA, it appears in your device share sheet. Share a photo (and optionally title or description) from your gallery or camera; the app opens the new-report form with the photo and any text pre-filled. Quick way to turn a snapshot into a report without leaving your photos app.

**Bilingual** — English and Bahasa Melayu across the app.

**PWA** — Installable on phones and desktops. Cached content is viewable offline; creating reports requires a connection.

**Admin dashboard** — Manage flagged content, lock comments, hide reports, ban users, and view reports and top contributors. Accessible from Settings for admin accounts.

---

## Test Account (for testers)

Use this account to sign in with **email and password** (no Google required). It has **full admin access** including the admin dashboard.

```
Email:    tester@laporlah.my
Password: LaporLah-Test123!
```

1. Open the login page and use **Sign in with email**.
2. Enter the credentials above.

This account is created by the seed script (`npm run seed`). For testing only; do not use in production.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier)

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/your-username/laporlah.git
   cd laporlah
   npm install
   ```

2. **Environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase URL, anon key, service role key, and app URL. See [.env.local.example](.env.local.example) for the full list.

3. **Supabase setup**
   - Create a project at [supabase.com](https://supabase.com).
   - **Authentication:** Enable Google OAuth and Email providers. For email sign-in without confirmation, disable "Confirm email" in the Email provider.
   - **Storage:** Create a bucket named `report-photos`.
   - **Database:** Run the migrations in `supabase/migrations/` in order (e.g. in the SQL Editor). Migration `006_align_badge_thresholds.sql` is required for badge unlocks.
   - **Google OAuth:** In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → OAuth consent screen, set the **Application name** to **LaporLah** so it appears on the sign-in screen.

4. **Seed and run**
   ```bash
   npm run seed
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Sign in with the test account above or with Google.

---

## Deployment

**Vercel**

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), add a new project and import the repository.
3. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL` (your Vercel URL).
4. Deploy. The app will be available at your project URL.

To seed the production database (optional):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npx tsx scripts/seed.ts
```

---

## Project Structure

```
laporlah/
├── public/           # Static assets, icons, manifest
├── src/
│   ├── app/         # App Router (feed, report, profile, admin, auth, login)
│   ├── components/  # UI (layout, reports, gamification, admin, shared)
│   └── lib/         # Actions, constants, hooks, supabase, types, validations
├── scripts/        # Database seed
├── supabase/       # Migrations
└── docs/           # Architecture, stories
```

---

## Assumptions and Limitations

- **Malaysian context** — Categories and copy are tailored for Malaysia.
- **Mobile-first PWA** — Best experience on mobile; functional on desktop.
- **Auth** — Google OAuth and email/password (test account for testers).
- **Notifications** — In-app only; no push notifications.
- **Offline** — Cached pages viewable offline; report creation requires connectivity.
- **Location** — Required for creating reports.
- **Confirmation** — Resolved reports can be confirmed by followers; 72-hour window and threshold (e.g. 3 confirmations) for closing.

---

## Contributing

Contributions are welcome. See `docs/CODING STANDARDS.md` for conventions.

## License

MIT — see [LICENSE](LICENSE).

## Support

Open an issue on GitHub for bugs or questions.
