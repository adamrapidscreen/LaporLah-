LaporLah Design System Specification
Here's your complete design system — built for dark-first, premium, techy aesthetics using shadcn/ui + Tailwind CSS 4. Use 
tweakcn.com
 to preview and fine-tune these tokens visually before committing.
​

Design Philosophy
"Civic tech that feels like fintech." — Dark, confident, information-dense, with a single vibrant accent that cuts through the darkness. Think Linear meets Grab's reporting features. Every pixel should feel intentional.

Principles:

Dark-first with light mode support (system preference toggle)

High contrast — WCAG AA minimum on all text (4.5:1 ratio)
​

Depth through layering — background → surface → card → elevated card (no flat design)

One hero accent — electric emerald — used sparingly for maximum punch

Generous whitespace — let the content breathe on mobile

Color Tokens
Dark Mode (Default)
css
:root {
  /* === Base Surfaces (layered depth system) === */
  --background: oklch(0.13 0.005 260);         /* #0C0D12 - deepest layer */
  --foreground: oklch(0.97 0.005 260);         /* #F4F4F6 - primary text */
  
  /* === Surfaces (progressively lighter) === */
  --card: oklch(0.17 0.008 260);               /* #15161D - card/panel bg */
  --card-foreground: oklch(0.95 0.005 260);    /* #EDEDF0 */
  --popover: oklch(0.19 0.01 260);             /* #1A1B24 - dropdowns/modals */
  --popover-foreground: oklch(0.95 0.005 260);
  
  /* === Primary — Electric Emerald === */
  --primary: oklch(0.75 0.18 165);             /* #10B981 → brighter emerald */
  --primary-foreground: oklch(0.13 0.03 165);  /* dark text on primary */
  
  /* === Secondary — Muted Blue-Gray === */
  --secondary: oklch(0.22 0.015 260);          /* #1E1F2A */
  --secondary-foreground: oklch(0.85 0.01 260);/* #C8C9CF */
  
  /* === Accent — Warm Amber (for highlights/gamification) === */
  --accent: oklch(0.78 0.16 75);               /* #F59E0B - badges, streaks */
  --accent-foreground: oklch(0.15 0.03 75);
  
  /* === Muted === */
  --muted: oklch(0.20 0.01 260);               /* #191A23 */
  --muted-foreground: oklch(0.55 0.015 260);   /* #6B6D7B - secondary text */
  
  /* === Borders & Input === */
  --border: oklch(0.25 0.01 260);              /* #2A2B36 - subtle dividers */
  --input: oklch(0.22 0.012 260);              /* #1E1F2B - form inputs */
  --ring: oklch(0.75 0.18 165);                /* matches primary for focus */
  
  /* === Semantic / Status Colors === */
  --destructive: oklch(0.65 0.22 25);          /* #EF4444 - errors, bans */
  --destructive-foreground: oklch(0.97 0.01 25);
  
  /* === Status-Specific (custom tokens) === */
  --status-open: oklch(0.70 0.15 250);         /* #3B82F6 - blue */
  --status-acknowledged: oklch(0.72 0.16 300); /* #A855F7 - purple */
  --status-in-progress: oklch(0.78 0.16 75);   /* #F59E0B - amber */
  --status-resolved: oklch(0.75 0.18 165);     /* #10B981 - emerald */
  --status-closed: oklch(0.55 0.015 260);      /* #6B6D7B - gray */
  --status-disputed: oklch(0.65 0.22 25);      /* #EF4444 - red */
  
  /* === Badge Tiers === */
  --tier-bronze: oklch(0.65 0.12 55);          /* #CD7F32 */
  --tier-silver: oklch(0.78 0.01 260);         /* #C0C0C0 */
  --tier-gold: oklch(0.82 0.16 85);            /* #FFD700 */
  
  /* === Layout === */
  --radius: 0.75rem;
  --sidebar-background: oklch(0.15 0.008 260);
  --sidebar-foreground: oklch(0.85 0.01 260);
  --sidebar-border: oklch(0.25 0.01 260);
}
Light Mode (Override)
css
.light {
  --background: oklch(0.985 0.002 260);        /* #FAFAFE */
  --foreground: oklch(0.13 0.02 260);          /* #111218 */
  --card: oklch(1.0 0 0);                      /* #FFFFFF */
  --card-foreground: oklch(0.13 0.02 260);
  --popover: oklch(1.0 0 0);
  --popover-foreground: oklch(0.25 0.02 260);
  --primary: oklch(0.65 0.2 165);              /* slightly deeper emerald */
  --primary-foreground: oklch(0.99 0.005 165);
  --secondary: oklch(0.96 0.005 260);          /* #F1F1F5 */
  --secondary-foreground: oklch(0.25 0.02 260);
  --accent: oklch(0.75 0.16 75);
  --accent-foreground: oklch(0.15 0.03 75);
  --muted: oklch(0.95 0.005 260);              /* #EBEBEF */
  --muted-foreground: oklch(0.45 0.02 260);    /* #5F6170 */
  --border: oklch(0.90 0.005 260);             /* #E2E2E8 */
  --input: oklch(0.96 0.005 260);
  --ring: oklch(0.65 0.2 165);
  --destructive: oklch(0.55 0.25 25);
  --destructive-foreground: oklch(0.98 0.01 25);
}
Typography
Use Inter as the primary font — it's the industry standard for techy UIs, has excellent readability at small sizes, and is available on Google Fonts for free.
​

css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace; /* for stats/numbers */
Type Scale (Mobile-First)
Token	Size	Weight	Use
display	28px / 1.75rem	700 (bold)	Page titles ("Public Feed")
h1	24px / 1.5rem	700	Section headers
h2	20px / 1.25rem	600 (semibold)	Card titles, report titles
h3	16px / 1rem	600	Sub-headers, category labels
body	14px / 0.875rem	400 (regular)	Default text, descriptions
body-sm	13px / 0.8125rem	400	Comments, secondary info
caption	12px / 0.75rem	500 (medium)	Timestamps, metadata, badges
stat	20px / 1.25rem	700, mono	Point counts, numbers
Text Hierarchy Rules
Primary text: foreground — titles, body, interactive labels

Secondary text: muted-foreground — timestamps, metadata, helper text

Accent text: primary — links, interactive elements, point values

All caps + letter-spacing: only for status badges and category tags (text-xs font-semibold uppercase tracking-wider)

Spacing & Layout
Spacing Scale
text
4px  → gap between icon and label
8px  → inner padding (badges, tags)
12px → card inner padding (mobile)
16px → standard content padding
20px → card inner padding (desktop)
24px → section spacing
32px → between major sections
48px → page top/bottom safe area
Mobile Layout Grid
Max content width: 640px (centered on larger screens)

Side padding: 16px

Bottom nav height: 64px (with safe area inset)

Card gap in feed: 12px

No sidebar on mobile — bottom tab navigation only

Desktop Behavior
Content centered, max 1024px

Optional sidebar for filters at 768px+

Feed becomes 2-column grid at 1024px+

Bottom nav → top nav at 768px+

Component Patterns
Report Card (Feed)
text
┌────────────────────────────────────┐
│ [Photo Thumbnail]                  │  ← 16:9 aspect, rounded-lg
│                                    │
│ ┌──────────┐ ┌───────────────┐     │
│ │ 🟢 Open  │ │ Infrastructure│     │  ← status pill + category pill
│ └──────────┘ └───────────────┘     │
│                                    │
│ Pothole on Jalan Cyberjaya 5       │  ← h2, font-semibold, max 2 lines
│ Large pothole near the bus stop... │  ← body-sm, muted-foreground, 2 lines
│                                    │
│ 📍 Cyberjaya · 👁 12 followers     │  ← caption, muted-foreground
│                                    │
│ [Avatar] Ahmad · 2h ago            │  ← caption row
└────────────────────────────────────┘
Visual rules:

Card background: card token with border 1px solid

Hover/tap: subtle border glow using ring color at 20% opacity

Photo thumbnail: object-cover, rounded-t-lg

No shadows in dark mode — use borders for elevation
​

Light mode: subtle shadow-sm on cards

Status Pills
Each status gets its own color and a subtle background fill:

tsx
const statusConfig = {
  open:         { bg: 'bg-blue-500/15',   text: 'text-blue-400',   label: 'Open / Dibuka' },
  acknowledged: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Acknowledged / Diakui' },
  in_progress:  { bg: 'bg-amber-500/15',  text: 'text-amber-400',  label: 'In Progress / Dalam Proses' },
  resolved:     { bg: 'bg-emerald-500/15',text: 'text-emerald-400',label: 'Resolved / Diselesaikan' },
  closed:       { bg: 'bg-gray-500/15',   text: 'text-gray-400',   label: 'Closed / Ditutup' },
  disputed:     { bg: 'bg-red-500/15',    text: 'text-red-400',    label: 'Disputed / Dipertikaikan' },
};
Pill shape: rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider

Status Stepper (Detail Page)
A horizontal progress bar with dots for each stage:

text
● ─────── ● ─────── ◐ ─────── ○ ─────── ○
Open    Ack'd    In Progress  Resolved  Closed
Completed: filled dot + solid line in primary

Current: pulsing dot with glow ring animation

Upcoming: hollow dot + dashed line in muted

Category Tags
text
rounded-md px-2 py-1 text-xs font-medium
bg-secondary text-secondary-foreground border border-border
Badge Component (Profile)
text
┌─────────────────────────────────────┐
│  🔦                                 │
│  Spotter                            │  ← badge name, font-semibold
│  ★★★☆☆  Gold                        │  ← tier indicator
│  "First to shine a light"           │  ← flair, italic, muted-foreground
│                                     │
│  ▓▓▓▓▓▓▓▓▓░░  12/15 reports        │  ← progress to next tier
└─────────────────────────────────────┘
Border: 2px solid using tier color token (tier-bronze, tier-silver, tier-gold)

Background: tier color at 10% opacity

Progress bar: primary fill on muted track, rounded-full h-1.5

Profile Civic Card
text
┌──────────────────────────────────────────┐
│  ┌──────┐                                │
│  │Avatar│  Ahmad bin Hassan              │  ← h1
│  │      │  @ahmad · Joined Jan 2026      │  ← caption, muted
│  └──────┘  🔥 3-week streak              │  ← accent color
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │   340   │ │   12    │ │   28    │    │
│  │ points  │ │ reports │ │comments │    │  ← stat (mono, large)
│  └─────────┘ └─────────┘ └─────────┘    │
│                                          │
│  [🔦 Spotter Gold] [🤝 Hero Silver]     │  ← badge pills
│  [✅ Closer Bronze]                      │
└──────────────────────────────────────────┘
Stat numbers: font-mono text-xl font-bold text-primary

Stat labels: text-xs text-muted-foreground uppercase tracking-wider

Card: gradient border using primary at 30% opacity for premium feel

Micro-Interactions & Motion
Keep animations subtle and fast — nothing over 300ms:
​

Element	Animation	Duration	Easing
Page transitions	Fade + slide up 8px	200ms	ease-out
Card tap/hover	Border glow pulse	150ms	ease-in-out
Status pill change	Color morph + scale bounce	250ms	spring
Badge unlock	Scale from 0 → 1 + confetti burst (CSS only)	400ms	spring
Follow button toggle	Heart/bookmark fill animation	200ms	ease-out
Points counter	Number count-up (animated)	300ms	ease-out
Confirmation vote buttons	Ripple effect on tap	150ms	ease-out
Bell notification	Subtle shake + badge pop	200ms	ease-in-out
Pull-to-refresh (feed)	Emerald spinner	-	-
CSS Utility Classes
css
/* Glow effect for interactive cards */
.card-glow {
  transition: box-shadow 150ms ease-in-out;
}
.card-glow:hover {
  box-shadow: 0 0 0 1px oklch(0.75 0.18 165 / 0.3),
              0 0 20px oklch(0.75 0.18 165 / 0.08);
}

/* Pulse for current status dot */
@keyframes status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.3); }
}
.status-current {
  animation: status-pulse 2s ease-in-out infinite;
}
Navigation (Mobile-First)
Bottom Tab Bar (Mobile < 768px)
text
┌─────────────────────────────────────────┐
│  🏠 Home    📝 Report    🔔 Alerts    👤 │
│  Feed      Lapor       Notif      Profile│
└─────────────────────────────────────────┘
Height: 64px + safe area inset

Background: card with border-t border-border

Active tab: primary icon + label; inactive: muted-foreground

"Report" (center): elevated emerald FAB-style button — bg-primary rounded-full w-12 h-12 -mt-4 shadow-lg

Glassmorphism: backdrop-blur-xl bg-card/80

Top Nav (Desktop ≥ 768px)
Sticky top bar, same glassmorphism effect

Logo left, nav links center, bell + avatar right

No hamburger menu — all links visible

Key Page Wireframes
Home Feed
text
┌─ Status Bar ──────────────────────────┐
│ LaporLah                    🔔 [Ava] │  ← top bar
├───────────────────────────────────────┤
│ [Category Filter ▼] [Status Filter ▼]│  ← sticky filter bar
├───────────────────────────────────────┤
│ ┌─ Report Card ────────────────────┐  │
│ │ ...                              │  │
│ └──────────────────────────────────┘  │
│ ┌─ Report Card ────────────────────┐  │
│ │ ...                              │  │
│ └──────────────────────────────────┘  │
│                                       │
│          [Load More]                  │
├───────────────────────────────────────┤
│  🏠     📝(FAB)    🔔     👤          │  ← bottom nav
└───────────────────────────────────────┘
Report Detail
text
┌─ ← Back          Report #47    ⚑ Flag ┐
├───────────────────────────────────────┤
│ [Full Photo - 16:9]                    │
├───────────────────────────────────────┤
│ ● ──── ● ──── ◐ ──── ○ ──── ○        │  ← status stepper
│ Open  Ack'd  InProg  Rslvd  Closed    │
├───────────────────────────────────────┤
│ Pothole on Jalan Cyberjaya 5           │  ← h1
│ Infrastructure / Infrastruktur         │  ← category pill
│                                        │
│ [Leaflet Map Pin - 200px height]       │
│ 📍 Cyberjaya, Selangor                 │
│                                        │
│ Description text here...               │
│                                        │
│ [👁 12 Ikuti]  [✏️ Update Status]      │  ← action buttons
├───────────────────────────────────────┤
│ 💬 Comments (8)                        │
│ ┌─ Comment ────────────────────────┐   │
│ │ [Ava] Sarah · 1h ago            │   │
│ │ I passed by today, still there   │   │
│ └──────────────────────────────────┘   │
│ ...                                    │
│ ┌──────────────────────── [Send] ──┐   │
│ │ Write a comment...               │   │
│ └──────────────────────────────────┘   │
└───────────────────────────────────────┘
Implementation Shortcuts
Use 
tweakcn.com
 to visually preview and export your CSS variables — it supports Tailwind v4 and OKLCH format natively
​

shadcn/ui components to install: button, card, badge, input, textarea, select, dialog, dropdown-menu, avatar, tabs, progress, toast, separator, sheet (mobile drawer)

Dark mode toggle: use next-themes (3 lines of setup) with shadcn/ui's built-in dark mode support
​

Inter font: add via next/font/google — zero layout shift, auto-optimized

Quick Reference: The "Premium" Checklist
What separates a premium-feeling PWA from a bootcamp project:

✅ Consistent 16px side padding everywhere on mobile

✅ No pure black (#000) — always dark gray with slight blue undertone

✅ Border-based elevation in dark mode, not shadows
​

✅ One accent color used for interactive elements only — never for decoration

✅ Mono font for numbers/stats (makes them feel like a dashboard)

✅ Uppercase + letter-spacing on small labels (status, category, metadata)

✅ Glassmorphism nav bars (backdrop-blur-xl bg-card/80)

✅ Smooth 200ms transitions on everything interactive

✅ Loading skeletons (not spinners) for async content

✅ Empty states with illustration + CTA ("No reports yet. Be the first to Lapor!")

This design system is ready to drop into your BMAD brief as a companion document. Want me to compile it into a single copy-paste markdown block like the project brief?

Prepared using Claude Opus 4.6 Thinking
yes please
Here's the full design system specification — single block, copy-paste ready:

text
# LaporLah — Design System Specification

## Design Philosophy
"Civic tech that feels like fintech." Dark-first, confident, information-dense,
with a single vibrant accent (electric emerald) that cuts through the darkness.
Every pixel should feel intentional.

### Principles
- Dark-first with light mode support (system preference toggle via next-themes)
- High contrast — WCAG AA minimum on all text (4.5:1 ratio)
- Depth through layering — background → surface → card → elevated card
- One hero accent (emerald) used sparingly for maximum punch
- Generous whitespace — let content breathe on mobile
- Border-based elevation in dark mode, not shadows
- Loading skeletons (not spinners) for async content

---

## Color Tokens

### Dark Mode (Default)

```css
:root {
  /* === Base Surfaces (layered depth system) === */
  --background: oklch(0.13 0.005 260);         /* #0C0D12 - deepest layer */
  --foreground: oklch(0.97 0.005 260);         /* #F4F4F6 - primary text */

  /* === Surfaces (progressively lighter) === */
  --card: oklch(0.17 0.008 260);               /* #15161D - card/panel bg */
  --card-foreground: oklch(0.95 0.005 260);    /* #EDEDF0 */
  --popover: oklch(0.19 0.01 260);             /* #1A1B24 - dropdowns/modals */
  --popover-foreground: oklch(0.95 0.005 260);

  /* === Primary — Electric Emerald === */
  --primary: oklch(0.75 0.18 165);             /* #10B981 */
  --primary-foreground: oklch(0.13 0.03 165);  /* dark text on primary */

  /* === Secondary — Muted Blue-Gray === */
  --secondary: oklch(0.22 0.015 260);          /* #1E1F2A */
  --secondary-foreground: oklch(0.85 0.01 260);/* #C8C9CF */

  /* === Accent — Warm Amber (highlights/gamification) === */
  --accent: oklch(0.78 0.16 75);               /* #F59E0B */
  --accent-foreground: oklch(0.15 0.03 75);

  /* === Muted === */
  --muted: oklch(0.20 0.01 260);               /* #191A23 */
  --muted-foreground: oklch(0.55 0.015 260);   /* #6B6D7B - secondary text */

  /* === Borders & Input === */
  --border: oklch(0.25 0.01 260);              /* #2A2B36 */
  --input: oklch(0.22 0.012 260);              /* #1E1F2B */
  --ring: oklch(0.75 0.18 165);                /* matches primary for focus */

  /* === Semantic === */
  --destructive: oklch(0.65 0.22 25);          /* #EF4444 */
  --destructive-foreground: oklch(0.97 0.01 25);

  /* === Status Colors === */
  --status-open: oklch(0.70 0.15 250);         /* blue */
  --status-acknowledged: oklch(0.72 0.16 300); /* purple */
  --status-in-progress: oklch(0.78 0.16 75);   /* amber */
  --status-resolved: oklch(0.75 0.18 165);     /* emerald */
  --status-closed: oklch(0.55 0.015 260);      /* gray */
  --status-disputed: oklch(0.65 0.22 25);      /* red */

  /* === Badge Tiers === */
  --tier-bronze: oklch(0.65 0.12 55);          /* #CD7F32 */
  --tier-silver: oklch(0.78 0.01 260);         /* #C0C0C0 */
  --tier-gold: oklch(0.82 0.16 85);            /* #FFD700 */

  /* === Layout === */
  --radius: 0.75rem;
  --sidebar-background: oklch(0.15 0.008 260);
  --sidebar-foreground: oklch(0.85 0.01 260);
  --sidebar-border: oklch(0.25 0.01 260);
}
Light Mode (Override)
css
.light {
  --background: oklch(0.985 0.002 260);        /* #FAFAFE */
  --foreground: oklch(0.13 0.02 260);          /* #111218 */
  --card: oklch(1.0 0 0);                      /* #FFFFFF */
  --card-foreground: oklch(0.13 0.02 260);
  --popover: oklch(1.0 0 0);
  --popover-foreground: oklch(0.25 0.02 260);
  --primary: oklch(0.65 0.2 165);              /* deeper emerald */
  --primary-foreground: oklch(0.99 0.005 165);
  --secondary: oklch(0.96 0.005 260);          /* #F1F1F5 */
  --secondary-foreground: oklch(0.25 0.02 260);
  --accent: oklch(0.75 0.16 75);
  --accent-foreground: oklch(0.15 0.03 75);
  --muted: oklch(0.95 0.005 260);              /* #EBEBEF */
  --muted-foreground: oklch(0.45 0.02 260);    /* #5F6170 */
  --border: oklch(0.90 0.005 260);             /* #E2E2E8 */
  --input: oklch(0.96 0.005 260);
  --ring: oklch(0.65 0.2 165);
  --destructive: oklch(0.55 0.25 25);
  --destructive-foreground: oklch(0.98 0.01 25);
}
Typography
Font Stack
Primary: 'Inter', ui-sans-serif, system-ui, sans-serif

Load via next/font/google for zero layout shift

Monospace: 'JetBrains Mono', ui-monospace, monospace

Used for stats, point values, and numeric displays

Type Scale (Mobile-First)
Token	Size	Weight	Usage
display	28px / 1.75rem	700 (bold)	Page titles ("Public Feed")
h1	24px / 1.5rem	700 (bold)	Section headers
h2	20px / 1.25rem	600 (semibold)	Card titles, report titles
h3	16px / 1rem	600 (semibold)	Sub-headers, category labels
body	14px / 0.875rem	400 (regular)	Default text, descriptions
body-sm	13px / 0.8125rem	400 (regular)	Comments, secondary info
caption	12px / 0.75rem	500 (medium)	Timestamps, metadata, badge labels
stat	20px / 1.25rem	700, mono	Point counts, numeric displays
Text Color Hierarchy
Primary text: var(--foreground) — titles, body, interactive labels

Secondary text: var(--muted-foreground) — timestamps, metadata, helper text

Accent text: var(--primary) — links, interactive elements, point values

Uppercase + letter-spacing: status badges and category tags only
(text-xs font-semibold uppercase tracking-wider)

Spacing & Layout
Spacing Scale
Value	Usage
4px	Gap between icon and label
8px	Inner padding (badges, tags, pills)
12px	Card inner padding (mobile)
16px	Standard content padding, side gutters
20px	Card inner padding (desktop)
24px	Section spacing
32px	Between major sections
48px	Page top/bottom safe area
Mobile Layout Grid
Max content width: 640px (centered on larger screens)

Side padding: 16px

Bottom nav height: 64px (+ safe area inset)

Card gap in feed: 12px

No sidebar on mobile — bottom tab navigation only

Desktop Breakpoints
< 768px: Mobile layout (bottom nav, single column)

≥ 768px: Top nav replaces bottom nav, optional filter sidebar

≥ 1024px: Feed becomes 2-column grid, max width 1024px centered

Component Patterns
Report Card (Feed Item)
text
┌────────────────────────────────────┐
│ [Photo Thumbnail - 16:9]           │  ← object-cover, rounded-t-lg
│                                    │
│ ┌──────────┐ ┌───────────────┐     │
│ │ 🟢 Open  │ │ Infrastructure│     │  ← status pill + category pill
│ └──────────┘ └───────────────┘     │
│                                    │
│ Pothole on Jalan Cyberjaya 5       │  ← h2, font-semibold, max 2 lines
│ Large pothole near the bus stop... │  ← body-sm, muted-foreground, 2 lines
│                                    │
│ 📍 Cyberjaya · 👁 12 followers     │  ← caption, muted-foreground
│                                    │
│ [Avatar] Ahmad · 2h ago            │  ← caption row
└────────────────────────────────────┘
Visual rules:

Background: var(--card) with 1px solid var(--border)

Hover/tap: subtle glow using var(--ring) at 20% opacity

Photo thumbnail: object-cover, rounded-t-lg, 16:9 aspect ratio

No shadows in dark mode — use borders for elevation

Light mode: shadow-sm on cards

Corner radius: var(--radius) (0.75rem)

Status Pills
tsx
const statusConfig = {
  open:         { bg: 'bg-blue-500/15',    text: 'text-blue-400',    label: 'Open / Dibuka' },
  acknowledged: { bg: 'bg-purple-500/15',  text: 'text-purple-400',  label: 'Diakui / Ack\'d' },
  in_progress:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   label: 'Dalam Proses' },
  resolved:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Diselesaikan' },
  closed:       { bg: 'bg-gray-500/15',    text: 'text-gray-400',    label: 'Ditutup ✓' },
  disputed:     { bg: 'bg-red-500/15',     text: 'text-red-400',     label: 'Dipertikaikan' },
};
Pill shape: rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider

Category Tags
Shape: rounded-md px-2 py-1 text-xs font-medium
Colors: bg-secondary text-secondary-foreground border border-border

Status Stepper (Report Detail Page)
text
● ─────── ● ─────── ◐ ─────── ○ ─────── ○
Open    Ack'd    In Prog   Resolved  Closed
Completed stages: filled dot + solid line in var(--primary)

Current stage: pulsing dot with glow ring animation (status-pulse)

Upcoming stages: hollow dot + dashed line in var(--muted)

Horizontal layout, full width, labels below each dot

Badge Component (Profile Page)
text
┌─────────────────────────────────────┐
│  🔦                                 │
│  Spotter                            │  ← badge name, font-semibold
│  ★★★☆☆  Gold                        │  ← tier indicator
│  "First to shine a light"           │  ← flair, italic, muted-foreground
│                                     │
│  ▓▓▓▓▓▓▓▓▓░░  12/15 reports        │  ← progress bar to next tier
└─────────────────────────────────────┘
Border: 2px solid using tier color (--tier-bronze/silver/gold)

Background: tier color at 10% opacity

Progress bar: var(--primary) fill on var(--muted) track, rounded-full h-1.5

Profile Civic Card
text
┌──────────────────────────────────────────┐
│  ┌──────┐                                │
│  │Avatar│  Ahmad bin Hassan              │  ← h1
│  │ 64px │  @ahmad · Joined Jan 2026      │  ← caption, muted
│  └──────┘  🔥 3-week streak              │  ← accent color
│                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │   340   │ │   12    │ │   28    │    │
│  │ points  │ │ reports │ │comments │    │  ← stat (mono, large)
│  └─────────┘ └─────────┘ └─────────┘    │
│                                          │
│  [🔦 Spotter Gold] [🤝 Hero Silver]     │  ← badge pills inline
│  [✅ Closer Bronze]                      │
└──────────────────────────────────────────┘
Stat numbers: font-mono text-xl font-bold text-primary

Stat labels: text-xs text-muted-foreground uppercase tracking-wider

Card border: gradient border using var(--primary) at 30% opacity

Avatar: 64px, rounded-full, ring-2 ring-primary/30

Confirmation Vote UI (Report Detail)
text
┌─────────────────────────────────────────┐
│  🗳 Community Verification              │
│  "Has this issue been resolved?"        │
│                                         │
│  ⏱ 47h 23m remaining                   │  ← countdown, caption, amber
│                                         │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │ ✅ Sahkan (8)    │ │ ❌ Belum (2)  │  │  ← vote buttons
│  └─────────────────┘ └───────────────┘  │
│                                         │
│  Needs 3 confirmations to close         │  ← helper text
└─────────────────────────────────────────┘
Container: bg-primary/5 border border-primary/20 rounded-lg p-4

Active vote button: filled with respective color

Already voted: disabled state, show user's selection highlighted

Comment Bubble
text
┌──────────────────────────────────────┐
│ [Ava] Sarah · 1h ago                │  ← avatar 28px + name + time
│ I passed by today, pothole is still  │
│ there but they placed a cone.        │  ← body-sm
└──────────────────────────────────────┘
Background: var(--secondary)

Border: none (background differentiation is enough)

Border-radius: rounded-lg

Padding: px-3 py-2.5

Empty States
All empty states follow this pattern:

Centered layout

Muted emoji or simple SVG illustration (64px)

Title in h3, foreground

Subtitle in body-sm, muted-foreground

CTA button in primary

Example:

text
        📝
  No reports yet
  Be the first to spotlight
  an issue in your area.

  [ Lapor Sekarang ]
Navigation
Bottom Tab Bar (Mobile < 768px)
text
┌─────────────────────────────────────────┐
│  🏠 Home    📝 Lapor    🔔 Notif    👤  │
│  Feed       Report     Alerts    Profile │
└─────────────────────────────────────────┘
Height: 64px + env(safe-area-inset-bottom)

Background: backdrop-blur-xl bg-card/80 (glassmorphism)

Border: border-t border-border

Active tab: text-primary, icon filled

Inactive tab: text-muted-foreground, icon outlined

Center "Lapor" button: elevated FAB style

bg-primary rounded-full w-12 h-12 -mt-4 shadow-lg shadow-primary/25

Icon: plus sign, text-primary-foreground

Top Nav Bar (Desktop ≥ 768px)
Position: sticky top-0 z-50

Background: backdrop-blur-xl bg-background/80

Border: border-b border-border

Layout: logo left, nav links center, bell icon + avatar right

Height: 56px

No hamburger menu — all links visible at desktop breakpoint

Micro-Interactions & Motion
Transition Standards
Default duration: 200ms

Default easing: ease-out

Max duration for any animation: 400ms (badge unlock only)

Respect prefers-reduced-motion: disable all animations

Animation Catalog
Element	Animation	Duration	Easing
Page transitions	Fade + slide up 8px	200ms	ease-out
Card hover/tap	Border glow pulse	150ms	ease-in-out
Status pill change	Color morph + subtle scale bounce	250ms	spring
Badge unlock	Scale 0→1 + CSS confetti burst	400ms	spring
Follow button toggle	Heart/bookmark fill animation	200ms	ease-out
Points counter	Number count-up (animated)	300ms	ease-out
Confirmation vote	Ripple effect on tap	150ms	ease-out
Bell notification	Subtle shake + badge counter pop	200ms	ease-in-out
Skeleton loading	Shimmer sweep left→right	1.5s	linear loop
Pull-to-refresh	Emerald spinner	-	-
CSS Utilities
css
/* Glow effect for interactive cards */
.card-glow {
  transition: box-shadow 150ms ease-in-out;
}
.card-glow:hover {
  box-shadow: 0 0 0 1px oklch(0.75 0.18 165 / 0.3),
              0 0 20px oklch(0.75 0.18 165 / 0.08);
}

/* Pulse for current status step */
@keyframes status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.3); }
}
.status-current {
  animation: status-pulse 2s ease-in-out infinite;
}

/* Shimmer for skeleton loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--secondary) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
  border-radius: var(--radius);
}
Page Wireframes
Home Feed
text
┌─ Status Bar ──────────────────────────┐
│ LaporLah                    🔔 [Ava] │  ← top area (mobile: minimal)
├───────────────────────────────────────┤
│ [Category ▼]  [Status ▼]             │  ← sticky filter bar below header
├───────────────────────────────────────┤
│ ┌─ Report Card ────────────────────┐  │
│ │ [Photo]                          │  │
│ │ [Open] [Infrastructure]          │  │
│ │ Title...                         │  │
│ │ Description preview...           │  │
│ │ 📍 Area · 👁 12                  │  │
│ │ [Ava] Name · 2h ago             │  │
│ └──────────────────────────────────┘  │
│                12px gap               │
│ ┌─ Report Card ────────────────────┐  │
│ │ ...                              │  │
│ └──────────────────────────────────┘  │
│                                       │
│          [ Load More ]                │
│                                       │
│           48px bottom safe            │
├───────────────────────────────────────┤
│  🏠      📝(FAB)     🔔      👤      │  ← bottom nav
└───────────────────────────────────────┘
Create Report
text
┌─ ← Back           Lapor Sekarang     ┐
├───────────────────────────────────────┤
│                                       │
│  Title *                              │
│  ┌─────────────────────────────────┐  │
│  │ What's the issue?               │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Category *                           │
│  ┌─────────────────────────── ▼ ──┐   │
│  │ Select category                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Description *                        │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │ Describe the issue in detail... │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  📸 Photo (optional)                  │
│  ┌─────────────────────────────────┐  │
│  │      + Tap to add photo         │  │  ← dashed border, muted
│  │      Max 5MB, JPEG/PNG          │  │
│  └─────────────────────────────────┘  │
│                                       │
│  📍 Location *                        │
│  ┌─────────────────────────────────┐  │
│  │ [Map preview - current loc]     │  │  ← Leaflet mini map 150px
│  │ 📍 Cyberjaya, Selangor          │  │
│  │ (Tap to adjust pin)             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │        Hantar Laporan           │  │  ← primary button, full width
│  └─────────────────────────────────┘  │
│                                       │
└───────────────────────────────────────┘
Report Detail
text
┌─ ← Back          Report #47    ⚑ Flag┐
├───────────────────────────────────────┤
│ [Full Photo - 16:9 aspect]            │
├───────────────────────────────────────┤
│ ● ──── ● ──── ◐ ──── ○ ──── ○       │
│ Open  Ack'd  InProg  Rslvd  Closed   │
├───────────────────────────────────────┤
│ Pothole on Jalan Cyberjaya 5          │
│ ┌──────────────┐                      │
│ │Infrastructure│                      │
│ └──────────────┘                      │
│                                       │
│ [Leaflet Map - 180px height]          │
│ 📍 Cyberjaya, Selangor                │
│                                       │
│ Description text paragraph here,      │
│ explaining the issue in detail...     │
│                                       │
│ [Avatar] Ahmad · Created 2 days ago   │
│                                       │
│ ┌──────────┐ ┌────────────────────┐   │
│ │ 👁 Ikuti │ │ ✏️ Update Status   │   │
│ │   (12)   │ │                    │   │
│ └──────────┘ └────────────────────┘   │
├───────────────────────────────────────┤
│ (If resolved — show Confirmation UI)  │
│ ┌─────────────────────────────────┐   │
│ │ 🗳 Community Verification       │   │
│ │ "Has this been resolved?"       │   │
│ │ ⏱ 47h 23m remaining            │   │
│ │ [✅ Sahkan (8)] [❌ Belum (2)]  │   │
│ │ Needs 3 confirmations           │   │
│ └─────────────────────────────────┘   │
├───────────────────────────────────────┤
│ 💬 Comments (8)                       │
│ ┌──────────────────────────────────┐  │
│ │ [Ava] Sarah · 1h ago            │  │
│ │ Still there, cone was placed.    │  │
│ └──────────────────────────────────┘  │
│ ┌──────────────────────────────────┐  │
│ │ [Ava] Ali · 30m ago             │  │
│ │ JKR team spotted on site!        │  │
│ └──────────────────────────────────┘  │
│                                       │
│ ┌──────────────────────── [Send]──┐   │
│ │ Write a comment...               │  │
│ └──────────────────────────────────┘  │
└───────────────────────────────────────┘
Profile Page
text
┌─ ← Back              Settings ⚙      ┐
├───────────────────────────────────────┤
│                                       │
│         ┌──────────┐                  │
│         │  Avatar   │                 │
│         │   64px    │                 │
│         └──────────┘                  │
│        Ahmad bin Hassan               │  ← h1, centered
│     @ahmad · Joined Jan 2026         │  ← caption, muted, centered
│         🔥 3-week streak             │  ← accent, centered
│                                       │
│  ┌──────────┐┌──────────┐┌─────────┐ │
│  │   340    ││    12    ││   28    │ │
│  │  Points  ││ Reports  ││Comments │ │  ← stat grid, 3 columns
│  └──────────┘└──────────┘└─────────┘ │
│                                       │
├───────────────────────────────────────┤
│  Badges                               │
│  ┌─ Badge Card ────────────────────┐  │
│  │ 🔦 Spotter · Gold              │  │
│  │ "First to shine a light"       │  │
│  │ ▓▓▓▓▓▓▓▓▓░░ 12/15             │  │
│  └─────────────────────────────────┘  │
│  ┌─ Badge Card ────────────────────┐  │
│  │ 🤝 Kampung Hero · Silver       │  │
│  │ "Stronger together"            │  │
│  │ ▓▓▓▓▓▓▓░░░░ 11/15             │  │
│  └─────────────────────────────────┘  │
│  ┌─ Badge Card ────────────────────┐  │
│  │ ✅ Closer · Bronze             │  │
│  │ "Gets things done"             │  │
│  │ ▓▓▓░░░░░░░░ 1/2               │  │
│  └─────────────────────────────────┘  │
│                                       │
├───────────────────────────────────────┤
│  Recent Activity                      │
│  · Created "Pothole on..." — 2h ago  │
│  · Commented on "Broken..." — 1d ago │
│  · 🏅 Earned Spotter Gold — 3d ago  │
│                                       │
├───────────────────────────────────────┤
│  [My Reports]  [Followed Reports]     │  ← tab switcher
│  ┌─ Report Card (compact) ─────────┐  │
│  │ ...                             │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
Notifications Page
text
┌─ Notifications           Mark all read┐
├───────────────────────────────────────┤
│  ┌─────────────────────────────────┐  │
│  │ 🟢 Status Update · 2h ago      │  │  ← unread: bg-primary/5
│  │ "Pothole on Jalan..." moved     │  │
│  │ to In Progress                  │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ 💬 New Comment · 5h ago        │  │
│  │ Sarah commented on "Broken..."  │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ 🗳 Verify · 1d ago (read)      │  │  ← read: default bg
│  │ "Drain clog on..." needs your   │  │
│  │ confirmation                    │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
Admin Dashboard
text
┌─ Admin Dashboard                      ┐
├───────────────────────────────────────┤
│                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐    │
│  │  156   │ │   23   │ │    4   │    │
│  │Reports │ │  Open  │ │Flagged │    │  ← stat cards, mono
│  └────────┘ └────────┘ └────────┘    │
│                                       │
├─ Tabs ────────────────────────────────┤
│  [Flagged] [Reports] [Users]          │
├───────────────────────────────────────┤
│  Flagged Items                        │
│  ┌─────────────────────────────────┐  │
│  │ ⚑ Report: "Bad road near..."   │  │
│  │ Flagged 3x · Reason: Spam      │  │
│  │ [View] [Hide] [Lock Comments]   │  │  ← action buttons
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ ⚑ User: spammer123             │  │
│  │ 5 flags across 3 reports       │  │
│  │ [View Profile] [Ban User]      │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
shadcn/ui Components to Install
button, card, badge, input, textarea, select, dialog, dropdown-menu,
avatar, tabs, progress, toast, separator, sheet (mobile drawer),
skeleton, popover, tooltip, toggle

Icon System
Library: Lucide React (ships with shadcn/ui)

Style: outline (1.5px stroke) for inactive, filled for active states

Size: 20px default (nav), 16px small (inline), 24px large (empty states)

Color: inherits from text color (currentColor)

Dark Mode Implementation
Library: next-themes

Strategy: class-based (class="dark" on <html>)

Default: system preference (prefers-color-scheme)

Toggle: sun/moon icon in nav settings area

Persist: localStorage via next-themes (automatic)

Premium Polish Checklist
 Consistent 16px side padding everywhere on mobile

 No pure black (#000) — always dark gray with blue undertone

 Border-based elevation in dark mode, shadow-sm in light mode

 One accent color (emerald) for interactive elements only

 Mono font (JetBrains Mono) for all numbers/stats

 Uppercase + tracking-wider on status/category labels

 Glassmorphism nav bars (backdrop-blur-xl bg-card/80)

 200ms transitions on all interactive elements

 Loading skeletons with shimmer on all async content

 Empty states with emoji + CTA on every empty view

 Focus ring (ring-2 ring-ring ring-offset-2) on all interactive elements

 prefers-reduced-motion respected on all animations

 Smooth scroll behavior on comment threads

 Toast notifications for actions (report created, badge unlocked, etc.)