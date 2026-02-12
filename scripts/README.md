# Seed Data Guide

## Overview
The LaporLah seed script populates your database with realistic Malaysian community reporting data to showcase the full app functionality.

## What Gets Created

### 👥 4 Demo Users
- **Siti Nurhaliza** (admin@laporlah.my) - Admin user with 485 points, 3-week streak, all badges
- **Ahmad Faiz** (ahmad@laporlah.my) - Active user with 210 points, multiple badges
- **Mei Ling Tan** (mei.ling@laporlah.my) - Growing user with 120 points, 1 badge
- **Rajesh Kumar** (raj@laporlah.my) - Casual user with 85 points

### 📝 10 Community Reports
Realistic reports across all 5 categories with real Malaysian locations:
- **Infrastructure**: Broken streetlights, potholes, traffic lights (Cyberjaya, PJ, Kota Damansara)
- **Cleanliness**: Overflowing bins, illegal dumping (Putrajaya, PJ)
- **Safety**: Stray dogs, suspicious activity (Subang Jaya, PJ)
- **Facilities**: Broken playground, leaking community hall (Shah Alam)
- **Other**: Water supply issues (Shah Alam)

All 6 status states represented:
- Open (3 reports)
- Acknowledged (3 reports)
- In Progress (3 reports)
- Resolved (1 report - in confirmation voting)
- Closed (1 report - fully resolved)

### 💬 23 Natural Comments
Comments in conversational Malaysian English style:
- "Ya lah, I also noticed this!"
- "Wah this one really urgent..."
- "Aiyo why so long to fix?"
- "Good news! Just saw the workers there this morning 👍"

### ❤️ 30 Follow Relationships
Each report has 3-20 followers showing community engagement

### 🗳️ 8 Confirmation Votes
- R4 (Playground): 3 confirmed, 1 not_yet (active voting)
- R5 (Stray dogs): 4 confirmed (led to closure)

### 🏆 6 Badges Awarded
- Siti: Gold Spotter, Gold Kampung Hero, Silver Closer
- Ahmad: Silver Spotter, Bronze Closer
- Mei Ling: Bronze Spotter

### ⭐ 100+ Point Events
All points match user totals exactly:
- Report creation: 25 points
- Comments: 5 points
- Confirmations: 10 points
- Report closures: 25 points
- Resolution bonuses: 15 points
- Badge unlocks: 10 points
- Follows: 5 points

### 🔔 13 Notifications
Mix of status changes, new comments, confirmation requests, badge unlocks, and follows

### 🚩 2 Flagged Items
Sample flags for admin dashboard demo

## Prerequisites

1. **Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Database Migrations**
   Run all migrations first:
   ```bash
   npx supabase db reset
   # or
   npx supabase migration up
   ```

3. **tsx Package**
   Already installed as dev dependency

## Running the Seed Script

```bash
# Option 1: Using npm script (recommended)
npm run seed

# Option 2: Direct execution
npx tsx scripts/seed.ts
```

## Script Output

```
🌱 Starting LaporLah seed script...

🧹 Cleaning existing seed data...
✓ Cleaned existing data

👥 Creating demo users...
✓ Created 4 demo users

📝 Creating community reports...
✓ Created 10 community reports

💬 Adding community comments...
✓ Added 23 community comments

❤️  Creating follow relationships...
✓ Created 30 follow relationships

🗳️  Creating confirmation votes...
✓ Created 8 confirmation votes

🏆 Awarding badges...
✓ Awarded 6 badges

⭐ Recording point events...
✓ Recorded 100+ point events

🔔 Creating notifications...
✓ Created 13 notifications

🚩 Creating sample flags...
✓ Created 2 flags for admin dashboard

✅ Seed complete!

📊 Summary:
   • 4 demo users (1 admin, 3 regular users)
   • 10 community reports across all categories
   • 23 realistic Malaysian English comments
   • 30 follow relationships
   • 8 confirmation votes
   • 6 badges awarded
   • 100+ point events recorded
   • 13 notifications created
   • 2 flagged items for admin dashboard

🎉 Database ready for demo!

📝 Test accounts:
   Admin: admin@laporlah.my (Siti Nurhaliza)
   User:  ahmad@laporlah.my (Ahmad Faiz)
   User:  mei.ling@laporlah.my (Mei Ling Tan)
   User:  raj@laporlah.my (Rajesh Kumar)

💡 Next steps:
   1. Sign in with Google OAuth using any of the above emails
   2. Admin user can access /admin dashboard
   3. Explore feed, reports, profile pages, and gamification
```

## Using Seed Data

### For Testers
1. Sign in with Google using one of the test emails above
2. First sign-in creates your profile in the database
3. Seed script will populate your account with activity
4. Explore:
   - **Feed** (/) - See all 10 reports
   - **Report Detail** - Click any report to see comments, votes, status
   - **Profile** (/profile) - View points, badges, streak, activity
   - **Notifications** (/notifications) - See alerts and updates
   - **Admin** (/admin) - Admin user only, view stats and moderation tools

### For Judges
The seed data showcases:
- ✅ All 5 report categories
- ✅ All 6 status workflow states
- ✅ Community engagement (comments, follows)
- ✅ Gamification system (points, badges, streaks)
- ✅ Confirmation voting mechanic
- ✅ Admin moderation features
- ✅ Real Malaysian locations and natural language
- ✅ Notification system
- ✅ Mobile-first responsive design

## Idempotency

The script can be run multiple times safely:
- Cleans existing seed data on each run
- Uses fixed UUIDs for consistency
- Upserts users to avoid conflicts

## Troubleshooting

### Missing environment variables
```
❌ Missing environment variables
   NEXT_PUBLIC_SUPABASE_URL: ✗
   SUPABASE_SERVICE_ROLE_KEY: ✗
```
**Fix**: Add variables to `.env.local`

### Permission denied
**Issue**: Service role key not set correctly
**Fix**: Use the service_role key from Supabase dashboard, not the anon key

### Table doesn't exist
**Issue**: Migrations not run
**Fix**: Run `npx supabase db reset` or `npx supabase migration up`

## Customizing Seed Data

Edit `scripts/seed.ts` to:
- Add more reports (update `reports` array)
- Change user profiles (update `users` array)
- Modify point totals (adjust `pointEvents` array)
- Add more comments (update `comments` array)

Remember to keep point events matching user `total_points` exactly!
