---
name: seed-data
description: Generate realistic seed data for the LaporLah database. Use this skill when asked to create seed data, demo data, or populate the database.
---

# Seed Data Generation

## When to Use
When the user asks to create seed data, demo data, or prepare the
database for demo/judging.

## Instructions
1. Read /docs/architecture.md for table schemas and enum values
2. Generate a seed script at /scripts/seed.ts

## Data Requirements
- 8-10 reports across all 5 categories
- Multiple statuses represented (at least 1 each of open, acknowledged,
  in_progress, resolved, closed)
- 3-4 demo users with Malaysian names and realistic avatars
- 15-20 comments spread across reports
- Follow relationships (each report has 2-8 followers)
- At least 1 report with active confirmation voting
- At least 1 user with all 3 badges at various tiers
- At least 1 user with a 3+ week streak
- Point events that match the point totals on users
- Notifications for various events

## Location Data
Use real coordinates from Malaysian locations:
- Cyberjaya: 2.9188, 101.6538
- Putrajaya: 2.9264, 101.6964
- Petaling Jaya: 3.1073, 101.6067
- Shah Alam: 3.0733, 101.5185
- Subang Jaya: 3.0565, 101.5853

## Content Style
- Report titles: specific, realistic (e.g., "Pothole on Persiaran
  Multimedia, Cyberjaya" not "Test Report 1")
- Descriptions: 2-3 sentences, realistic community reporting tone
- Comments: natural conversational Malaysian English
