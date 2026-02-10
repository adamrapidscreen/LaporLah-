````
# LaporLah — Coding Standards

## Purpose
This document defines the coding conventions, patterns, and rules that
ALL code in the LaporLah project must follow. The Developer Agent must
treat these as non-negotiable constraints. If a standard conflicts with
a desired approach, the standard wins.

---

## 1. TypeScript Rules

### Strict Mode
- `strict: true` in tsconfig.json — no exceptions
- No `any` type — use `unknown` and narrow, or define proper types
- No `@ts-ignore` or `@ts-expect-error` — fix the type instead
- No non-null assertions (`!`) — use proper null checks

### Type Definitions
- All function parameters and return types must be explicitly typed
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and computed types
- Database types: auto-generate from Supabase using
  `supabase gen types typescript` → store in `lib/types/database.ts`
- App-level types: define in `lib/types/index.ts`

### Naming Conventions

| Element               | Convention        | Example                       |
|-----------------------|-------------------|-------------------------------|
| Variables / functions | camelCase         | `reportCount`, `fetchReports` |
| Types / Interfaces    | PascalCase        | `Report`, `UserProfile`       |
| Enums                 | PascalCase        | `ReportStatus`, `BadgeTier`   |
| Enum values           | SCREAMING_SNAKE   | `IN_PROGRESS`, `KAMPUNG_HERO` |
| Constants             | SCREAMING_SNAKE   | `MAX_PHOTO_SIZE`, `POINTS_PER_REPORT` |
| Files (components)    | kebab-case        | `report-card.tsx`, `vote-panel.tsx` |
| Files (utilities)     | kebab-case        | `image-compression.ts`        |
| Files (actions)       | kebab-case        | `reports.ts`, `gamification.ts` |
| CSS custom properties | kebab-case        | `--status-open`, `--tier-gold` |
| Database columns      | snake_case        | `created_at`, `badge_type`    |
| Server Actions        | camelCase         | `createReport`, `castVote`    |

---

## 2. Component Patterns

### Server vs Client Components
- **Default to Server Components** — every component is RSC unless it needs:
  - useState, useEffect, useRef, or other hooks
  - Browser APIs (geolocation, file input, window)
  - Event handlers (onClick, onChange, onSubmit)
  - Third-party client libraries (Leaflet, browser-image-compression)
- Client Components must have `'use client'` directive on line 1
- Keep Client Components as small as possible — extract data fetching
  to parent Server Components and pass via props

### Component Structure (Single File Pattern)

```tsx
// 1. Directive (if client)
'use client';

// 2. Imports — grouped and ordered:
//    a. React/Next.js
//    b. Third-party libraries
//    c. Internal components (ui/ first, then feature components)
//    d. Lib (actions, utils, hooks, types, constants)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createReport } from '@/lib/actions/reports';
import type { Report } from '@/lib/types';

// 3. Types (component-specific, not shared)
interface ReportCardProps {
  report: Report;
  showActions?: boolean;
}

// 4. Component (named export, not default)
export function ReportCard({ report, showActions = true }: ReportCardProps) {
  return (
    // JSX
  );
}
````

## Export Rules

* **Named exports only** — no `export default` anywhere except:

  * `page.tsx` (Next.js requirement)

  * `layout.tsx` (Next.js requirement)

  * `route.ts` (Next.js requirement)

  * `loading.tsx`, `error.tsx`, `not-found.tsx` (Next.js conventions)

* One component per file (exception: small tightly-coupled sub-components)

## Props Pattern

* Destructure props in function signature

* Use `interface` for props (suffix with `Props`)

* Optional props must have default values

* Never pass more than 6 props — if exceeded, group into an object

***

## 3. Server Actions

## Structure

```
tsx
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema at top of file
const createReportSchema = z.object({
  title: z.string().min(5).max(100),
  // ...
});

// Action function
export async function createReport(formData: FormData) {
  // 1. Get authenticated user
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required' };
  }

  // 2. Parse and validate input
  const parsed = createReportSchema.safeParse({
    title: formData.get('title'),
    // ...
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 3. Check authorization (banned, permissions)
  // 4. Database operation
  // 5. Side effects (points, badges, notifications)
  // 6. Revalidate cache
  revalidatePath('/');

  // 7. Return result
  return { id: report.id };
}
```

## Rules

* Every Server Action must validate input with Zod

* Every Server Action must check authentication

* Every Server Action must check if user is banned

* Return `{ error: string }` on failure — never throw from Server Actions

* Return typed success data on success

* Call `revalidatePath()` after mutations

* One action per logical operation (don't bundle unrelated mutations)

***

## 4. Data Fetching

## Server Components

* Fetch data directly using Supabase server client

* No `useEffect` + `fetch` patterns — use RSC

* Handle loading with `loading.tsx` skeletons

* Handle errors with `error.tsx` boundaries

```
tsx
// app/page.tsx (Server Component)
import { createServerClient } from '@/lib/supabase/server';

export default async function FeedPage() {
  const supabase = await createServerClient();

  const { data: reports } = await supabase
    .from('reports')
    .select('*, users(name, avatar_url)')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  return <ReportFeed reports={reports ?? []} />;
}
```

## Client Components (Realtime Only)

* Supabase Realtime subscriptions are the ONLY acceptable reason\
  for client-side data fetching

* Use the `use-realtime.ts` hook for subscriptions

* Cleanup subscriptions in useEffect return

***

## 5. Error Handling

## Pattern

* Server Actions: return error objects, never throw

* Server Components: let errors bubble to `error.tsx` boundaries

* Client Components: try/catch with toast notifications

* Never show raw error messages to users — map to friendly messages

## User-Facing Error Messages

```
typescript
const ERROR_MESSAGES: Record<string, string> = {
  AUTH_REQUIRED: 'Please sign in to continue',
  USER_BANNED: 'Your account has been suspended',
  REPORT_HIDDEN: 'This report is no longer available',
  COMMENTS_LOCKED: 'Comments are locked on this report',
  RATE_LIMITED: 'You\'ve reached the daily report limit. Try again tomorrow.',
  LOCATION_DENIED: 'Location access is required to create a report. Please enable it in your browser settings.',
  PHOTO_TOO_LARGE: 'Photo must be under 5MB',
  GENERIC: 'Something went wrong. Please try again.',
};
```

***

## 6. File & Folder Rules

## Imports

* Always use `@/` path alias (maps to `src/`)

* Never use relative imports that go up more than one level (`../../`)

* Import order (enforced by ESLint):

  1. React / Next.js

  2. Third-party packages

  3. `@/components/ui/*`

  4. `@/components/*`

  5. `@/lib/*`

  6. Types (using `import type`)

## File Organization

* Components: one component per file, filename matches component name\
  (kebab-case file → PascalCase export)

  * `report-card.tsx` exports `ReportCard`

* Colocate test files (if any) next to source: `report-card.test.tsx`

* Constants: group related constants in one file under `lib/constants/`

* Actions: group by domain in `lib/actions/` (reports.ts, comments.ts, etc.)

***

## 7. Styling Rules

## Tailwind CSS Conventions

* Use Tailwind utility classes exclusively — no custom CSS except:

  * CSS custom properties (tokens) in `globals.css`

  * Keyframe animations in `globals.css`

  * Skeleton shimmer animation

* Use `cn()` utility (clsx + tailwind-merge) for conditional classes

* Class order: layout → spacing → sizing → typography → colors → effects

  * Example: `flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card rounded-lg border border-border hover:bg-secondary transition-colors`

* Use design system tokens (CSS variables), not hardcoded colors:

  * ✅ `text-primary`, `bg-card`, `border-border`

  * ❌ `text-emerald-500`, `bg-gray-900`, `border-gray-700`

* Exception: status colors and badge tiers use direct Tailwind colors\
  with opacity modifiers as defined in the design system (e.g., `bg-blue-500/15`)

## Responsive Design

* Mobile-first: write base styles for mobile, add breakpoint overrides

* Breakpoints: `md:` (768px) for tablet/desktop, `lg:` (1024px) for wide

* Test every component at 375px width minimum

***

## 8. Accessibility (A11y)

## Minimum Requirements

* All interactive elements must be keyboard accessible

* All images must have `alt` text (photo uploads: `alt="Report photo"`)

* All form inputs must have associated labels

* Focus states must be visible (use `ring-2 ring-ring ring-offset-2`)

* Color must not be the sole indicator (always pair with text/icon)

* `prefers-reduced-motion`: disable all animations

* Status pills: include text, not just color

* Map components: include text fallback for area name

***

## 9. Performance Rules

* No `useEffect` for data fetching — use RSC

* Dynamic import all Leaflet components with `ssr: false`

* Compress images client-side BEFORE upload (never upload raw)

* Use `loading.tsx` with skeleton components for every route

* Lazy load below-the-fold content (comments section on detail page)

* No barrel exports (`index.ts` re-exporting everything from a folder)

* Limit client-side JavaScript: extract as much as possible to RSC

***

## 10. Git Conventions

## Commit Messages

Format: `type(scope): description`

Types:

* `feat`: New feature

* `fix`: Bug fix

* `style`: Styling/UI changes (no logic change)

* `refactor`: Code restructuring (no behavior change)

* `chore`: Config, deps, tooling

* `docs`: Documentation

Examples:

* `feat(reports): add report creation form with photo upload`

* `fix(auth): handle Google OAuth redirect on mobile Safari`

* `style(feed): update report card to match design system`

* `chore(db): add RLS policies for comments table`

## Branch Strategy (Simple)

* `main` — production (auto-deploys to Vercel)

* `dev` — development branch (work here)

* Feature branches only if needed: `feat/report-creation`

* Merge `dev` → `main` for deployment
