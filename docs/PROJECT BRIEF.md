# Project Brief: LaporLah — Community Problem Reporter

## Project Overview
LaporLah is a mobile-first Progressive Web App (PWA) that enables Malaysian 
community members to report local neighborhood issues, follow their progress, 
and collectively verify when problems are resolved. It features a civic 
gamification system called "Civic Reputation" that rewards meaningful community 
participation over volume.

Tagline: "Komuniti Pantau, Komuniti Baiki" — Community watches, community fixes.

This is an MVP submission for a RM500 bounty with a hard deadline.
Timeline: 3 days. Priority is working, deployed, judge-ready product.

## Problem Statement
Local community issues (potholes, broken streetlights, illegal dumping, 
damaged facilities) go unreported or untracked because there is no lightweight, 
accessible tool for residents to report, follow, and verify resolutions. 
Existing channels (local council hotlines, social media groups) lack 
structured tracking, status visibility, and community accountability.

## Target Users
Malaysian community members (18–45, mobile-first, urban/suburban) who want 
to report and track local neighborhood issues. Secondary users: community 
leaders and local administrators who monitor and moderate content.

## Success Criteria
A judge can sign in with Google, create a report with photo and location, 
see it appear in the public feed, follow it, comment on it, propose closure, 
have another user confirm the closure, and see a badge unlock — all in under 
3 minutes on a mobile device.

---

## Core Requirements (Must-Have)

### 1. PWA
- Built with @serwist/next for service worker and caching
- Installable on mobile (manifest.json with 192px + 512px icons)
- Offline: cache app shell + previously viewed pages for offline reading
- No offline write/creation (no IndexedDB sync queue)

### 2. Google Sign-In (OAuth)
- Implemented via Supabase Auth (Google provider)
- Public read access: unauthenticated users can browse the feed and view 
  report details
- Authentication required for: creating reports, commenting, following, 
  confirming resolutions, flagging
- User profile page displaying: name, avatar (from Google), points total, 
  badges (with tier), activity streak, report count, comment count, 
  recent activity list

### 3. Create a Report
- Fields: title (required, max 100 chars), description (required, max 2000 
  chars), category (required, select from fixed list)
- Categories (dual-display EN/BM):
  - Infrastructure / Infrastruktur
  - Cleanliness / Kebersihan
  - Safety / Keselamatan
  - Facilities / Kemudahan
  - Other / Lain-lain
- Photo: optional, max 1 photo per report, accept JPEG/PNG up to 5MB input, 
  auto-compress client-side to ≤1MB using browser-image-compression 
  (maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, 
  fileType: 'image/jpeg') before uploading to Supabase Storage. 
  Reject files >5MB client-side before compression.
- Location: MANDATORY — capture via browser navigator.geolocation API, 
  store as lat/lng, display as Leaflet/OpenStreetMap map pin on detail page, 
  reverse geocode to approximate area name using Nominatim free API 
  (no API key required). User must grant location permission to submit 
  a report. Show a clear prompt/error if permission is denied.
- On creation: report status = "Open", creator is auto-followed, 
  creator receives 10 points

### 4. Public Feed + Report Detail Page
- **Public Feed (Home)**:
  - Chronological list of all reports (newest first)
  - Each card shows: title, category badge (bilingual), status badge 
    (bilingual), photo thumbnail (if any), area name, follower count, 
    time ago, creator avatar+name
  - Filter by: category (dropdown), status (dropdown)
  - No pagination required for MVP (load all, or simple "load more")
  
- **Report Detail Page**:
  - Full report info: title, description, category, photo (full size), 
    map pin with area name, creator info, created date
  - Status flow displayed as visual stepper/progress bar:
    Open / Dibuka → Acknowledged / Diakui → In Progress / Dalam Proses 
    → Resolved / Diselesaikan → Closed (Verified) / Ditutup (Disahkan)
  - Status change rules:
    - Creator + Admin can move status forward 
      (Open → Acknowledged → In Progress)
    - ANY authenticated user can propose "Resolved" 
      (triggers confirmation window)
    - "Closed (Verified)" is reached via community confirmation (see below)
  - Comments/updates section (chronological, newest at bottom)
  - Follow/unfollow toggle button with follower count
  - Flag button (report inappropriate content)

### 5. Follow System
- Users can follow/unfollow any report (toggle button)
- Report creators are auto-followed on their own reports
- "My Followed Reports" filtered view accessible from profile/nav
- Follower count displayed on feed cards and detail page
- Notification: in-app only — bell icon with unread badge counter in nav
  - Notify followers when: status changes, new comment posted, 
    confirmation window opens
  - Notification stored in a notifications table, marked read on click
  - NO push notifications (no VAPID/FCM)

### 6. Gamification — "Civic Reputation" System

#### Points (weighted by community impact):
| Action                                    | Points |
|-------------------------------------------|--------|
| Create a report                           | 10     |
| Post a comment/update                     | 5      |
| Your report gains a new follower          | 3      |
| Confirm someone else's resolution         | 8      |
| Your report reaches Closed (Verified)     | 25     |
| Your resolution proposal gets confirmed   | 15     |

#### 3 Badges (each with bronze/silver/gold tiers):
- **🔦 Spotter** — Earned for creating reports
  - Bronze: 1 report, Silver: 5 reports, Gold: 15 reports
  - Flair: "First to shine a light"
- **🤝 Kampung Hero** — Earned for posting comments/updates on OTHER 
  people's reports
  - Bronze: 5 comments, Silver: 15 comments, Gold: 50 comments
  - Flair: "Stronger together"
- **✅ Closer** — Earned when your resolution proposals get community-confirmed
  - Bronze: 2 confirmed, Silver: 5 confirmed, Gold: 15 confirmed
  - Flair: "Gets things done"

#### Weekly Activity Streak:
- "🔥 X-week streak" displayed on profile
- Increments if user posts or comments at least once per calendar week
- Resets if a week is missed
- Stored as: streak_count (int) + last_active_week (date)

#### Badge Check Logic:
- Single function `checkAndAwardBadges(userId)` called after any 
  point-awarding action
- Checks counts, inserts/upgrades badge rows as needed
- Implemented as a Supabase database function or API-side logic

### 7. Community Confirmation (Closure Verification)
- When any user proposes status = "Resolved":
  - A 72-hour confirmation window opens on the report
  - All followers receive a notification: "Has this been fixed?"
  - Users can vote: ✅ Sahkan (Confirmed) / ❌ Belum (Not Yet)
  - Each user gets one vote per confirmation window
  - If ≥3 "Confirmed" votes (or majority of voters), status → 
    "Closed (Verified)"
  - If majority vote "Not Yet", status reverts to "In Progress" 
    with a "Community Disputed" tag
  - If 72h passes with ≥1 confirmation and no disputes, auto-close
  - If 72h passes with 0 votes, revert to "In Progress"
- Reopening: Creator or Admin can reopen a Closed report 
  (reverts to "In Progress")

---

## Nice-to-Have Features (only if time permits after all must-haves)
- Search reports by keyword
- "Nearby" filter using geolocation proximity
- Duplicate report handling (mark as duplicate, redirect to original)
- Rate limiting: max 5 reports per user per day (API-level guard)
- Flag button on reports + comments (with reason field)

---

## Admin Dashboard (Lightweight)
- Protected route `/admin`, accessible only to users with role = "admin"
- Admin seeding: hardcode project owner's Google UID as admin via 
  Supabase dashboard or seed script (no admin invite flow)
- Dashboard features:
  - View all flagged reports and comments (with flag count + reasons)
  - Hide/unhide reports (soft delete via `is_hidden` boolean)
  - Lock/unlock comments on a report (prevents new comments)
  - Ban/unban users (banned users cannot create reports or comments)
  - Simple stats: total reports, reports by status, reports by category

---

## Language & Localization
- Primary language: English
- No i18n framework or locale routing (out of scope for MVP)
- Strategic Malay localization applied to:
  - App name and branding: "LaporLah"
  - Tagline: "Komuniti Pantau, Komuniti Baiki"
  - Category labels: dual display (EN / BM)
  - Status labels: dual display (EN / BM)
  - Key CTA buttons: Malay primary text
    - "Lapor Sekarang" (Report Now)
    - "Sahkan" (Confirm)
    - "Ikuti" (Follow)
    - "Kongsi" (Share)
  - Confirmation votes: "Sahkan" / "Belum"
  - Badge names retain bilingual flavor (Kampung Hero, etc.)
  - Empty states and onboarding copy: bilingual where natural
- All system messages, error handling, form validation, admin 
  dashboard, and long-form content remain English-only
- Future consideration: full i18n with next-intl can be added 
  post-MVP without architectural changes

---

## Technical Decisions (Locked)

| Layer           | Choice                                           |
|-----------------|--------------------------------------------------|
| Framework       | Next.js 15 (App Router, TypeScript, RSC)         |
| Backend/DB      | Supabase (Postgres + Auth + Storage + Realtime)   |
| UI              | Tailwind CSS 4 + shadcn/ui                        |
| PWA             | @serwist/next + serwist                           |
| Maps            | Leaflet + React-Leaflet + OpenStreetMap tiles     |
| Reverse Geocode | Nominatim API (free, no key)                      |
| Image Compress  | browser-image-compression (client-side)           |
| State Mgmt      | React Server Components + useOptimistic / Zustand |
| Deployment      | Vercel (free tier), .vercel.app domain             |
| Auth            | Supabase Auth (Google OAuth provider)             |

---

## Database Schema (Reference)

### Tables:
- **users** — id (uuid, PK), google_id, email, name, avatar_url, 
  points (int, default 0), role (enum: user/admin), streak_count (int), 
  last_active_week (date), is_banned (bool), created_at
- **reports** — id (uuid, PK), user_id (FK→users), title, description, 
  category (enum: infrastructure/cleanliness/safety/facilities/other), 
  photo_url (nullable), lat (float, required), lng (float, required), 
  area_name (text), status (enum: open/acknowledged/in_progress/resolved/closed), 
  is_hidden (bool), comments_locked (bool), resolved_at (timestamp, nullable),
  created_at, updated_at
- **comments** — id (uuid, PK), report_id (FK→reports), user_id (FK→users), 
  content (text), created_at
- **follows** — id (uuid, PK), user_id (FK→users), report_id (FK→reports), 
  created_at, UNIQUE(user_id, report_id)
- **confirmations** — id (uuid, PK), report_id (FK→reports), user_id (FK→users), 
  vote (enum: confirmed/not_yet), created_at, UNIQUE(user_id, report_id)
- **badges** — id (uuid, PK), user_id (FK→users), badge_type 
  (enum: spotter/kampung_hero/closer), tier (enum: bronze/silver/gold), 
  awarded_at, UNIQUE(user_id, badge_type)
- **notifications** — id (uuid, PK), user_id (FK→users), report_id (FK→reports), 
  type (enum: status_change/new_comment/confirmation_request), message (text), 
  is_read (bool, default false), created_at
- **flags** — id (uuid, PK), report_id (FK→reports, nullable), 
  comment_id (FK→comments, nullable), user_id (FK→users), reason (text), 
  created_at
- **point_events** — id (uuid, PK), user_id (FK→users), action (text), 
  points (int), report_id (FK→reports, nullable), created_at

### RLS Policies:
- All tables: public read (SELECT) for non-hidden, non-banned content
- INSERT/UPDATE/DELETE: require auth, user can only modify own records
- Admin: bypass RLS or separate admin-only policies
- reports.is_hidden = true: hidden from public, visible to admin

---

## Seed Data
- Pre-populate database with 8–10 realistic demo reports before submission
- Reports should span all 5 categories and multiple statuses
- Include at least 2 reports with comments and followers
- Include at least 1 report in "Closed (Verified)" status with confirmations
- Include at least 1 user with badges to showcase the gamification system
- Seed script stored in `/scripts/seed.ts` or equivalent

---

## Constraints & Assumptions
- 3-day development timeline (hard deadline)
- Solo developer using BMAD Method v6 + Cursor AI
- No budget for paid APIs — all services must be free tier
- Supabase free tier limits: 500MB database, 1GB storage, 
  50K monthly active users (more than sufficient)
- Vercel free tier: sufficient for bounty demo
- Mobile-first design, but must be functional on desktop
- No email notifications, no SMS, no push notifications
- No real-time collaborative editing
- Location permission is mandatory for report creation — if denied, 
  user cannot submit a report (show clear guidance to enable)

---

## Key Risks & Mitigations
| Risk                                      | Mitigation                                                |
|-------------------------------------------|-----------------------------------------------------------|
| Scope creep on nice-to-haves              | All nice-to-haves blocked until must-haves pass           |
| Serwist config issues                     | Fallback: manual SW registration per Next.js docs         |
| Google OAuth redirect issues on mobile    | Test early Day 1, Supabase handles most edge cases        |
| Leaflet SSR crash (window undefined)      | Dynamic import with `ssr: false` in Next.js               |
| Image compression slow on older phones    | Show progress indicator, useWebWorker: true, cap at 1920px|
| 72h confirmation timer                    | Use resolved_at timestamp comparison, no cron — check on page load |
| Nominatim rate limits (1 req/sec)         | Cache area_name on report creation, no repeated lookups   |
| Location permission denied                | Clear UI prompt explaining why location is required       |
