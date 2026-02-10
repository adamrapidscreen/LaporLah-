````
### File 6: epics.md

```markdown
# LaporLah — Epics & Story Map

## Purpose
This document defines the epics (feature groups) for the LaporLah MVP.
The Scrum Master Agent will use this to generate individual story files
and sequence them for the 3-day sprint.

---

## Sprint Overview

| Day | Focus                            | Epics              |
|-----|----------------------------------|---------------------|
| 1   | Foundation + Core CRUD           | E1, E2, E3 (partial)|
| 2   | Core Features + Interactions     | E3, E4, E5, E6      |
| 3   | Gamification + Admin + Polish    | E7, E8, E9, E10     |

---

## Epic 1: Project Setup & Infrastructure
**Priority**: P0 (Day 1, first)
**Description**: Initialize the Next.js project, configure all tooling,
set up Supabase, and deploy a "hello world" to Vercel.

### Stories:
- **E1-S1**: Initialize Next.js 15 project with TypeScript, Tailwind CSS 4,
  and shadcn/ui. Configure ESLint, Prettier, path aliases.
- **E1-S2**: Set up Supabase project (Singapore region). Create all database
  tables, enums, indexes, and RLS policies from architecture.md.
- **E1-S3**: Configure Supabase Auth with Google OAuth provider. Implement
  auth callback route, middleware for session refresh, and Supabase
  client utilities (browser, server, admin).
- **E1-S4**: Configure @serwist/next for PWA. Add manifest.json, app icons,
  service worker entry file.
- **E1-S5**: Set up root layout with Inter + JetBrains Mono fonts, theme
  provider (next-themes), and global CSS tokens from design system.
- **E1-S6**: Deploy to Vercel. Verify build succeeds, PWA installs,
  Google OAuth flow works end-to-end on mobile.

### Acceptance Criteria:
- App deploys to .vercel.app with no build errors
- Google sign-in works and creates a user row in public.users
- PWA is installable on mobile
- Dark mode is default, toggle works

---

## Epic 2: Layout & Navigation
**Priority**: P0 (Day 1)
**Description**: Build the responsive navigation shell that wraps all pages.

### Stories:
- **E2-S1**: Build mobile bottom navigation bar (glassmorphism, 4 tabs:
  Home, Lapor FAB, Notifications, Profile). Active/inactive states.
- **E2-S2**: Build desktop top navigation bar (sticky, glassmorphism,
  logo, nav links, bell icon, avatar dropdown).
- **E2-S3**: Build responsive nav wrapper that switches between bottom
  nav (<768px) and top nav (≥768px).
- **E2-S4**: Build login page with Google sign-in button and branding.
  Redirect to home after auth.

### Acceptance Criteria:
- Bottom nav visible on mobile, top nav on desktop
- Active tab highlighted with primary color
- Center FAB button is elevated and prominent
- Unauthenticated users see login prompt for protected actions

---

## Epic 3: Report CRUD & Feed
**Priority**: P0 (Day 1-2)
**Description**: Core report creation and the public feed.

### Stories:
- **E3-S1**: Build the create report form (Client Component): title input,
  description textarea, category select with bilingual labels.
  Validate with Zod. Wire to createReport server action.
- **E3-S2**: Build photo upload component: file input (JPEG/PNG), 5MB
  client-side validation, auto-compress to ≤1MB via
  browser-image-compression, upload to Supabase Storage, return URL.
- **E3-S3**: Build location picker component: request geolocation
  permission, show Leaflet mini-map with draggable pin, reverse
  geocode via Nominatim, store lat/lng + area_name. Handle
  permission denied with clear error message.
- **E3-S4**: Wire createReport server action: validate, insert report,
  auto-follow creator, award 10 points, update streak, check badges,
  revalidate feed, redirect to report detail.
- **E3-S5**: Build report card component for the feed: photo thumbnail,
  status pill, category tag, title (2 lines max), description
  preview, area name, follower count, creator avatar + name, time ago.
- **E3-S6**: Build home feed page (Server Component): fetch all
  non-hidden reports ordered by newest. Render report card list.
  Add loading skeleton.
- **E3-S7**: Build feed filter bar (Client Component): category dropdown
  and status dropdown. Filter via URL search params. Persist filters
  in URL for shareability.

### Acceptance Criteria:
- User can create a report with all required fields + optional photo
- Location is captured and displayed as map pin + area name
- Report appears in feed immediately after creation
- Feed cards match the design system spec
- Filters work and reflect in URL

---

## Epic 4: Report Detail & Status
**Priority**: P0 (Day 2)
**Description**: Full report detail page with status management.

### Stories:
- **E4-S1**: Build report detail page (Server Component): full photo,
  status stepper, title, category, map with pin, description,
  creator info, created date. Loading skeleton.
- **E4-S2**: Build status stepper component: horizontal progress dots
  with labels (bilingual). Completed = filled + primary color,
  current = pulsing animation, upcoming = hollow + muted.
- **E4-S3**: Build status update UI: creator/admin can advance status
  forward. Any authenticated user can propose "Resolved". Wire to
  updateReportStatus server action with proper authorization.
- **E4-S4**: Implement status change side effects: notify followers,
  set resolved_at timestamp when resolved.

### Acceptance Criteria:
- Detail page renders all report information correctly
- Status stepper visually reflects current status
- Only authorized users can change status
- Followers are notified on status change

---

## Epic 5: Comments System
**Priority**: P0 (Day 2)
**Description**: Comments/updates on report detail pages.

### Stories:
- **E5-S1**: Build comment list component (Server Component): fetch
  comments for report, render chronologically (oldest first).
  Show commenter avatar, name, time ago, content.
- **E5-S2**: Build comment form (Client Component): text input with
  send button. Optimistic update on submit. Wire to addComment
  server action.
- **E5-S3**: Implement comment server action: validate, check not
  banned, check comments not locked, insert comment, award 5 points,
  update streak, check badges, notify followers, revalidate page.

### Acceptance Criteria:
- Comments display correctly in chronological order
- New comment appears immediately (optimistic)
- Points awarded and badges checked after comment
- Locked reports reject new comments with clear message

---

## Epic 6: Follow System & Notifications
**Priority**: P1 (Day 2)
**Description**: Follow/unfollow reports and in-app notifications.

### Stories:
- **E6-S1**: Build follow button (Client Component): toggle
  follow/unfollow with optimistic update. Show follower count.
  Wire to toggleFollow server action.
- **E6-S2**: Implement follow server action: insert/delete follow row,
  award 3 points to report creator on new follow, revalidate.
- **E6-S3**: Build notification bell component (Client Component):
  show unread count badge. Subscribe to Supabase Realtime on
  notifications table for current user.
- **E6-S4**: Build notifications page (Server Component): list all
  notifications for current user, newest first. Unread items
  have highlighted background. Click marks as read and navigates
  to report.
- **E6-S5**: Build "My Followed Reports" page: filtered feed showing
  only reports the user follows.

### Acceptance Criteria:
- Follow/unfollow toggles instantly
- Creator gets 3 points when report is followed
- Bell shows accurate unread count (realtime)
- Notifications page lists all notifications correctly
- Followed reports page shows correct filtered list

---

## Epic 7: Community Confirmation
**Priority**: P1 (Day 2-3)
**Description**: The closure verification voting system.

### Stories:
- **E7-S1**: Build vote panel component (Client Component): appears
  when report status = "resolved". Show 72h countdown timer,
  "Sahkan" / "Belum" vote buttons with counts, helper text.
- **E7-S2**: Implement castVote server action: validate, check one
  vote per user per report, insert confirmation, award 8 points,
  check resolution logic after each vote.
- **E7-S3**: Implement resolution check logic: ≥3 confirmed = close,
  majority not_yet = revert, timeout handling on page load.
  Award 25 pts to creator and 15 pts to resolver on close.
- **E7-S4**: Build countdown timer component: calculate remaining
  time from resolved_at, display as "Xh Ym remaining", update
  every minute.

### Acceptance Criteria:
- Vote panel appears only on resolved reports
- Users can vote once, button disables after voting
- Report auto-closes at 3 confirmations
- Report reverts to in_progress if majority disputes
- 72h timeout logic works correctly on page load
- Points awarded correctly on closure

---

## Epic 8: Gamification & Profile
**Priority**: P1 (Day 3)
**Description**: Points, badges, streaks, and the profile page.

### Stories:
- **E8-S1**: Implement all database functions: award_points,
  check_and_award_badges, update_streak, notify_followers.
  Test each function manually via Supabase SQL editor.
- **E8-S2**: Build profile civic card component: avatar, name,
  join date, streak display, stats grid (points/reports/comments
  in mono font).
- **E8-S3**: Build badge card component: emoji icon, badge name,
  tier indicator with tier color border, flair text, progress bar
  to next tier.
- **E8-S4**: Build profile page: civic card, badges section (3 badges),
  recent activity list, tab switcher for "My Reports" / "Followed".
- **E8-S5**: Build badge unlock toast/animation: when check_badges
  returns a new badge, show a celebratory toast with the badge info.

### Acceptance Criteria:
- Profile displays accurate points, badges, and streak
- Badge tiers upgrade correctly at thresholds
- Progress bar shows accurate progress to next tier
- Badge unlock toast appears on earning a new badge
- Streak increments weekly and resets after inactivity

---

## Epic 9: Admin Dashboard
**Priority**: P2 (Day 3)
**Description**: Lightweight admin panel for content moderation.

### Stories:
- **E9-S1**: Build admin layout with role guard: check user role,
  redirect non-admins. Simple sidebar or tab navigation.
- **E9-S2**: Build admin stats cards: total reports, reports by
  status breakdown, flagged items count.
- **E9-S3**: Build flagged items view: list reports/comments with
  flag count and reasons. Action buttons: view, hide/unhide,
  lock/unlock comments.
- **E9-S4**: Build user management view: list users with report count,
  flag count. Ban/unban toggle button.
- **E9-S5**: Implement admin server actions: hideReport, unhideReport,
  lockComments, unlockComments, banUser, unbanUser. All require
  admin role check.
- **E9-S6**: Build flag button component (shared): modal with reason
  text input, wire to flagReport/flagComment server actions.

### Acceptance Criteria:
- Only admin users can access /admin routes
- Stats display accurate counts
- Hide/unhide, lock/unlock, ban/unban all function correctly
- Flag button works on reports and comments
- Flagged items appear in admin dashboard

---

## Epic 10: Polish & Seed Data
**Priority**: P2 (Day 3, final)
**Description**: Final polish, seed data, README, and submission prep.

### Stories:
- **E10-S1**: Create seed script with 8-10 realistic demo reports
  across all categories and statuses. Include sample comments,
  follows, and confirmations. Create at least one user with badges.
- **E10-S2**: Build all empty state components: no reports in feed,
  no comments on report, no notifications, no followed reports.
  Each with emoji, message, and CTA.
- **E10-S3**: Add loading skeletons (shimmer) to: feed page, report
  detail page, profile page, notifications page, admin dashboard.
- **E10-S4**: Build all toast notifications: report created, comment
  posted, followed/unfollowed, vote cast, badge unlocked, error states.
- **E10-S5**: Mobile responsiveness audit: test all pages at 375px,
  verify touch targets ≥44px, verify bottom nav safe area.
- **E10-S6**: Write README.md: setup steps, feature list, tech stack,
  assumptions, env variables template, screenshots.
- **E10-S7**: Final deployment: run seed script on production Supabase,
  verify all features work on deployed URL, test full judge flow.

### Acceptance Criteria:
- Seeded database shows a realistic, populated app
- All empty states render correctly
- All loading states use skeletons (no spinners)
- App is fully responsive on mobile
- README is clear and complete
- Deployed URL passes full judge flow test

---

## Story Dependencies (Critical Path)
````

E1 (Setup) → E2 (Nav) → E3 (Reports + Feed) → E4 (Detail + Status)\
↓\
E5 (Comments) → E7 (Confirmation)\
↓\
E6 (Follows + Notifs)\
↓\
E8 (Gamification + Profile)\
↓\
E9 (Admin)\
↓\
E10 (Polish + Seed)

```
text

E1 and E2 are sequential blockers — nothing else starts until nav shell works.
E3-E6 have partial parallelism but the detail page (E4) must exist before
comments (E5) and confirmation (E7) can be built.
E8 (gamification) can be partially built in parallel with E5-E7 since the
DB functions are independent, but the profile UI needs badge data flowing.
E9 and E10 are independent of each other and can be parallelized on Day 3.
```
