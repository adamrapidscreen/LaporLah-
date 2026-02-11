---
name: checkpoint-review
description: Quick review of recent changes focusing only on critical issues. Use this skill when asked to review, check, or validate recent code changes.
---

# Checkpoint Review

## When to Use
When the user asks to review code, check changes, or validate an epic
after implementation. This is NOT a full code review — it's a fast
pass for critical issues only.

## Instructions
1. Review all uncommitted changes and recent commits
2. Cross-reference against story acceptance criteria in /docs/stories/
3. Check against /docs/coding-standards.md patterns

## Check ONLY For
1. **Build breakers**: Missing imports, type errors, syntax errors
2. **Missing features**: Acceptance criteria not met
3. **Security holes**: Missing auth checks in Server Actions, exposed
   service_role key, missing RLS references, SQL injection vectors
4. **Design violations**: Hardcoded colors instead of design tokens,
   missing dark mode support, broken mobile layout

## Explicitly IGNORE
- Style preferences or "better" approaches
- Performance optimizations
- Edge case error handling
- Refactoring suggestions
- Test coverage
- Code comments quality

## Output Format
Checkpoint Review: [Epic Name]
MUST-FIX (blocks deployment)
file: [issue] → [fix]

...

WARNINGS (fix if time permits)
...

✅ PASSED (if no must-fix items)
Stories completed: X/Y
Ready for deployment: Yes/No

text
undefined