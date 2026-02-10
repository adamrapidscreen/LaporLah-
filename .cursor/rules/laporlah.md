---
description: Core project constraints for LaporLah
globs: "**/*"
---

# LaporLah — Project Constraints (Always Active)

## Stack (Locked)
- Next.js 15 (App Router) + TypeScript strict + Tailwind CSS 4 + shadcn/ui
- Supabase (Postgres + Auth + Storage + Realtime)
- @serwist/next for PWA
- Leaflet + React-Leaflet (dynamic import, ssr: false)
- Deploy to Vercel

## Non-Negotiable Rules
- NEVER install packages not listed in /docs/tech-stack.md
- NEVER use `any` type or `@ts-ignore`
- NEVER use `export default` except Next.js page/layout/route files
- NEVER use CSS modules, styled-components, or inline styles
- ALWAYS use Server Components by default
- ALWAYS validate Server Action input with Zod
- ALWAYS check auth + banned status in Server Actions
- ALWAYS use cn() for conditional Tailwind classes
- ALWAYS use design system CSS variable tokens, not hardcoded colors

## Reference Docs (read before implementing)
- /docs/project-brief.md
- /docs/architecture.md
- /docs/design-system.md
- /docs/tech-stack.md
- /docs/coding-standards.md
- /docs/epics.md
