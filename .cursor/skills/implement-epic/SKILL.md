---
name: implement-epic
description: Implement all stories for a specified epic in sequence. Use this skill when asked to implement, build, or code an epic or a batch of stories.
---


# Epic Implementation

## When to Use
When the user asks to implement an epic, build a feature group,
or code multiple stories in sequence.


## Parallel Execution Strategy
When implementing an epic, evaluate which stories can run in parallel:

- **Database work** (migrations, RLS, functions): spawn the `db-admin` 
  subagent via the task tool
- **UI components** (display-only, no server logic): spawn the `ui-builder` 
  subagent via the task tool  
- **Server Actions & API logic**: spawn the `api-builder` subagent 
  via the task tool
- **Config/setup tasks**: handle directly in the main agent

For stories that touch both UI and API (e.g., a form component + its 
server action), implement the server action FIRST, then the UI component 
that calls it.


## Instructions
1. Read ALL story files for the epic from /docs/stories/
2. Read /docs/architecture.md for schemas, server actions, and component tree
3. Read /docs/design-system.md for all UI specifications
4. Read /docs/coding-standards.md for patterns and conventions

## Execution Flow
For each story in the epic (in order):
1. Read the story file
2. Implement all tasks listed
3. Follow exact patterns from coding-standards.md:
   - Named exports only (except page/layout/route)
   - Import order: React → third-party → ui → components → lib → types
   - Server Components by default, 'use client' only when needed
   - Zod validation on all Server Actions
   - cn() for conditional Tailwind classes
4. Match UI exactly to design-system.md specifications
5. Git commit: `feat(scope): description`

After ALL stories in the epic are complete:
6. Run `npm run build` — fix any errors
7. Run `npm run lint` — fix any errors
8. Report: stories completed, files created/modified, any issues

## Rules
- Do NOT stop between stories to ask for approval
- Do NOT run code review between stories
- Do NOT deviate from tech-stack.md approved packages
- Do NOT skip acceptance criteria items
- If a dependency from a previous epic is missing, note it and continue
  with a TODO comment
