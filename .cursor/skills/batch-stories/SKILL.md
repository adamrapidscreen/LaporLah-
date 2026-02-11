---
name: batch-stories
description: Generate all story files for one or more epics from the epics document. Use this skill when asked to create stories, plan stories, or generate story files.
---

# Batch Story Generation

## When to Use
When the user asks to generate, create, or plan stories for one or more epics.

## Instructions
1. Read /docs/epics.md for epic definitions and story outlines
2. Read /docs/architecture.md for technical implementation details
3. Read /docs/coding-standards.md for naming and file conventions
4. Read /docs/design-system.md for UI component patterns

For each story, generate a markdown file at /docs/stories/[epic]-[story].md

## Story File Format

```md
# [Epic ID]-[Story ID]: [Title]

## Description
[What this story delivers]

## Dependencies
- Stories: [list prerequisite stories]
- Files: [list files that must exist]

## Tasks
1. [Specific file to create/modify]: [What to do]
2. [Specific file to create/modify]: [What to do]
...

## Implementation Notes
[Relevant code snippets, patterns from architecture.md, 
component specs from design-system.md]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
...
Rules
Generate ALL stories for the requested epic(s) in a single pass

Do not pause between stories for approval

Do not ask clarifying questions — all context is in the docs

Each story must reference specific file paths from architecture.md

Include relevant code snippets for complex implementations

# E3-S1: Report Creation Form

## Description
Build the create report form as a Client Component with title,
description, and category fields.

## Files to Create
- src/components/reports/report-form.tsx

## Implementation Notes

Component pattern (from coding-standards.md):
- 'use client' directive
- Named export: ReportForm
- Props interface: ReportFormProps
- Validate with Zod on submit

Category options (from constants):
- infrastructure / Infrastruktur
- cleanliness / Kebersihan
- safety / Keselamatan
- facilities / Kemudahan
- other / Lain-lain

Form fields:
- title: Input, required, max 100 chars
- description: Textarea, required, max 2000 chars
- category: Select from CATEGORIES constant

Design (from design-system.md):
- Full width form, 16px side padding
- Input: bg-input, border-border, rounded-[var(--radius)]
- Submit button: "Hantar Laporan", full width, bg-primary

## Acceptance Criteria
- [ ] Form renders with all 3 fields
- [ ] Category shows bilingual labels
- [ ] Client-side validation shows errors
- [ ] Submits via createReport server action
- [ ] Redirects to report detail on success
