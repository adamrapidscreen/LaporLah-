# 🇲🇾 LaporLah!

> Komuniti Pantau, Komuniti Baiki — Community-driven issue reporting for Malaysia

## Features

- **Report Infrastructure Issues** — Submit reports with photos, location, and category
- **Track Report Status** — Follow progress from open to resolved
- **Community Verification** — Vote on resolved reports to confirm fixes
- **Gamification** — Earn points, maintain streaks, and unlock badges
- **Admin Dashboard** — Moderate content and manage users
- **Bilingual Support** — English and Malay (Bahasa Melayu)
- **Mobile-First PWA** — Works offline, installable on mobile devices

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Framework (App Router, RSC) |
| TypeScript | Type safety |
| Supabase | Database, Auth, Storage, Realtime |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI components |
| Leaflet | Maps |
| Zod | Validation |
| @serwist/next | PWA support |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/laporlah.git
   cd laporlah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials (see Environment Variables below).

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Enable Google OAuth in Authentication → Providers
   - Create a Storage bucket named `report-photos`
   - Run the database migrations from `supabase/migrations/` in the SQL Editor
   - Set up Row Level Security (RLS) policies

5. **Seed the database**
   ```bash
   npm run seed
   ```
   This creates sample reports, users, and badges for testing.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See [`.env.local.example`](.env.local.example) for the full list of required variables.

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project" and import your GitHub repository
   - Configure environment variables in Vercel project settings:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL`

3. **Deploy**
   - Click "Deploy" — Vercel will build and deploy your app
   - Your app will be live at `https://your-project.vercel.app`

4. **Seed production database**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
   npx tsx scripts/seed.ts
   ```

## Project Structure

```
laporlah/
├── public/              # Static assets (icons, manifest)
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── admin/      # Admin dashboard
│   │   ├── auth/       # OAuth callback
│   │   ├── login/      # Login page
│   │   ├── profile/    # User profiles
│   │   ├── report/     # Report pages
│   │   └── ...
│   ├── components/      # React components
│   │   ├── admin/      # Admin components
│   │   ├── comments/   # Comment components
│   │   ├── confirmation/ # Vote panel
│   │   ├── gamification/ # Badges, points
│   │   ├── layout/     # Navigation
│   │   ├── map/        # Leaflet maps
│   │   ├── notifications/ # Notifications
│   │   ├── profile/     # Profile components
│   │   ├── reports/     # Report components
│   │   ├── shared/     # Shared components
│   │   └── ui/        # shadcn/ui primitives
│   ├── lib/
│   │   ├── actions/     # Server Actions
│   │   ├── constants/   # Categories, badges, points
│   │   ├── hooks/      # Custom React hooks
│   │   ├── supabase/   # Supabase clients
│   │   ├── types/       # TypeScript types
│   │   └── utils/      # Utility functions
│   └── app/            # Root layout, globals
├── scripts/            # Database seed script
├── supabase/          # Database migrations
└── docs/              # Architecture, design system, stories
```

## Screenshots

### Home Feed
![Home Feed](screenshots/home-feed.png)

### Report Detail
![Report Detail](screenshots/report-detail.png)

### Profile
![Profile](screenshots/profile.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

## Assumptions & Limitations

- **Designed for Malaysian context** — Categories and locations are Malaysia-specific
- **Mobile-first PWA** — Optimized for mobile, functional on desktop
- **Google OAuth only** — No email/password authentication
- **No push notifications** — In-app bell notification only
- **No offline write/creation** — Can view cached content offline, but cannot create reports
- **Location permission mandatory** — Required for report creation
- **72-hour confirmation window** — Resolved reports must be confirmed within 72 hours
- **3 confirmation threshold** — Reports close automatically after 3 confirmations

## Contributing

Contributions are welcome! Please follow the coding standards in `docs/CODING STANDARDS.md`.

## License

MIT License — see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
