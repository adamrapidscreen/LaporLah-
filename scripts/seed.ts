// LaporLah Seed Script - Realistic Malaysian Community Data
// Run with: npm run seed

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// Test account for testers (email/password sign-in, admin role) — document in README
const TEST_USER_EMAIL = 'tester@laporlah.my';
const TEST_USER_PASSWORD = 'LaporLah-Test123!';
const TEST_USER_FULL_NAME = 'Test Admin';

// User IDs will be populated after creating auth users
const USER_IDS: Record<string, string> = {
  SITI: '',
  AHMAD: '',
  MEI_LING: '',
  RAJESH: '',
  TESTER: '',
};

const REPORT_IDS = {
  R1: 'a0000000-0000-0000-0000-000000000001',
  R2: 'a0000000-0000-0000-0000-000000000002',
  R3: 'a0000000-0000-0000-0000-000000000003',
  R4: 'a0000000-0000-0000-0000-000000000004',
  R5: 'a0000000-0000-0000-0000-000000000005',
  R6: 'a0000000-0000-0000-0000-000000000006',
  R7: 'a0000000-0000-0000-0000-000000000007',
  R8: 'a0000000-0000-0000-0000-000000000008',
  R9: 'a0000000-0000-0000-0000-000000000009',
  R10: 'a0000000-0000-0000-0000-000000000010',
};

async function main() {
  console.log('🌱 Starting LaporLah seed script...\n');

  // Step 0: Create auth users with admin API (so FK constraint is satisfied)
  console.log('🔐 Creating auth users...');
  const authUserSpecs = [
    { key: 'SITI', email: 'siti.demo@laporlah.my', name: 'Siti Nurhaliza' },
    { key: 'AHMAD', email: 'ahmad.demo@laporlah.my', name: 'Ahmad Faiz' },
    { key: 'MEI_LING', email: 'meiling.demo@laporlah.my', name: 'Mei Ling Tan' },
    { key: 'RAJESH', email: 'rajesh.demo@laporlah.my', name: 'Rajesh Kumar' },
  ];

  for (const spec of authUserSpecs) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: spec.email,
      email_confirm: true,
      user_metadata: { full_name: spec.name },
    });
    if (error) {
      // If user exists, get their ID
      if (error.message.includes('already registered') || error.message.includes('already exists') || error.message.includes('already been registered')) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users.find(u => u.email === spec.email);
        if (existing) {
          USER_IDS[spec.key] = existing.id;
          console.log(`   User ${spec.email} already exists (ID: ${existing.id})`);
        } else {
          throw new Error(`User ${spec.email} exists but couldn't fetch ID`);
        }
      } else {
        console.error(`❌ Failed to create auth user ${spec.email}:`, error);
        throw error;
      }
    } else {
      USER_IDS[spec.key] = data.user.id;
      console.log(`   ✓ Created ${spec.email} (ID: ${data.user.id})`);
    }
  }

  // Step 0b: Create test admin user (email + password for testers)
  console.log('🔐 Creating test admin user (email/password)...');
  const { data: testUserData, error: testUserError } = await supabase.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: TEST_USER_FULL_NAME },
  });
  if (testUserError) {
    if (testUserError.message.includes('already registered') || testUserError.message.includes('already exists') || testUserError.message.includes('already been registered')) {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users.find((u) => u.email === TEST_USER_EMAIL);
      if (existing) {
        USER_IDS.TESTER = existing.id;
        console.log(`   Test user ${TEST_USER_EMAIL} already exists (ID: ${existing.id})`);
      } else {
        throw new Error(`Test user ${TEST_USER_EMAIL} exists but couldn't fetch ID`);
      }
    } else {
      console.error(`❌ Failed to create test user ${TEST_USER_EMAIL}:`, testUserError);
      throw testUserError;
    }
  } else {
    USER_IDS.TESTER = testUserData.user.id;
    console.log(`   ✓ Created test admin ${TEST_USER_EMAIL} (ID: ${testUserData.user.id})`);
  }
  console.log('✓ Test admin user ready\n');

  // Step 1: Clean existing seed data
  console.log('🧹 Cleaning existing seed data...');
  await supabase.from('point_events').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('notifications').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('badges').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('confirmations').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('follows').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('flags').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('comments').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reports').delete().gte('id', '00000000-0000-0000-0000-000000000000');
  console.log('✓ Cleaned existing data\n');

  // Step 2: Create demo users (public.users table)
  console.log('👥 Creating demo users...');
  const users = [
    {
      id: USER_IDS.SITI,
      email: 'siti.demo@laporlah.my',
      full_name: 'Siti Nurhaliza',
      avatar_url: `https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=10b981&color=fff`,
      role: 'admin',
      total_points: 485,
      current_streak: 3,
      longest_streak: 5,
      last_active_date: new Date().toISOString().split('T')[0],
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: USER_IDS.AHMAD,
      email: 'ahmad.demo@laporlah.my',
      full_name: 'Ahmad Faiz',
      avatar_url: `https://ui-avatars.com/api/?name=Ahmad+Faiz&background=3b82f6&color=fff`,
      role: 'user',
      total_points: 210,
      current_streak: 2,
      longest_streak: 4,
      last_active_date: new Date().toISOString().split('T')[0],
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: USER_IDS.MEI_LING,
      email: 'meiling.demo@laporlah.my',
      full_name: 'Mei Ling Tan',
      avatar_url: `https://ui-avatars.com/api/?name=Mei+Ling&background=f59e0b&color=000`,
      role: 'user',
      total_points: 120,
      current_streak: 1,
      longest_streak: 2,
      last_active_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: USER_IDS.RAJESH,
      email: 'rajesh.demo@laporlah.my',
      full_name: 'Rajesh Kumar',
      avatar_url: `https://ui-avatars.com/api/?name=Rajesh+Kumar&background=a855f7&color=fff`,
      role: 'user',
      total_points: 85,
      current_streak: 0,
      longest_streak: 1,
      last_active_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: USER_IDS.TESTER,
      email: TEST_USER_EMAIL,
      full_name: TEST_USER_FULL_NAME,
      avatar_url: `https://ui-avatars.com/api/?name=Test+Admin&background=0ea5e9&color=fff`,
      role: 'admin',
      total_points: 0,
      current_streak: 0,
      longest_streak: 0,
      last_active_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    },
  ];

  const { error: usersError } = await supabase.from('users').upsert(users, { onConflict: 'id' });
  if (usersError) throw usersError;
  console.log(`✓ Created ${users.length} demo users\n`);

  // Step 3: Create reports
  console.log('📝 Creating community reports...');
  const now = Date.now();
  const reports = [
    {
      id: REPORT_IDS.R1,
      user_id: USER_IDS.SITI,
      title: 'Broken streetlight on Persiaran Multimedia',
      description: 'The streetlight near Block A has been out for 3 days already. Very dark at night, safety concern for residents walking home from the shops. Can see the light pole number is SM-401.',
      category: 'infrastructure',
      status: 'open',
      photo_url: '/report-photos/r1-broken-streetlight-cyberjaya.jpg',
      latitude: 2.9188,
      longitude: 101.6538,
      area_name: 'Cyberjaya, Selangor',
      follower_count: 5,
      created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R2,
      user_id: USER_IDS.AHMAD,
      title: 'Overflowing bins at Putrajaya Central Park',
      description: 'The rubbish bins near the lake view area are overflowing since yesterday. Smell very bad and got flies everywhere. Tourists also complaining. Needs urgent collection!',
      category: 'cleanliness',
      status: 'open',
      photo_url: '/report-photos/r2-overflowing-bins-putrajaya-central-park.jpg',
      latitude: 2.9264,
      longitude: 101.6964,
      area_name: 'Putrajaya',
      follower_count: 8,
      created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R3,
      user_id: USER_IDS.MEI_LING,
      title: 'Deep pothole causing accidents on Jalan PJS 7',
      description: 'Very big pothole on the main road near the traffic light. Already saw 2 motorcycles nearly fall this morning. The hole is about 50cm wide and very deep. Please fix ASAP before someone gets hurt!',
      category: 'infrastructure',
      status: 'in_progress',
      photo_url: '/report-photos/r3-deep-pothole-jalan-pjs7.jpg',
      latitude: 3.1073,
      longitude: 101.6067,
      area_name: 'Petaling Jaya, Selangor',
      follower_count: 12,
      created_at: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R4,
      user_id: USER_IDS.SITI,
      title: 'Park playground equipment broken and unsafe',
      description: 'The swing set at Taman Tasik Shah Alam is broken and very rusty. One swing is hanging by only one chain. Not safe for kids at all. Needs urgent repair or replacement.',
      category: 'facilities',
      status: 'resolved',
      photo_url: '/report-photos/r4-broken-swing-taman-tasik-shah-alam.jpg',
      latitude: 3.0733,
      longitude: 101.5185,
      area_name: 'Shah Alam, Selangor',
      follower_count: 6,
      resolved_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_by: USER_IDS.AHMAD,
      created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R5,
      user_id: USER_IDS.RAJESH,
      title: 'Stray dogs pack causing safety concerns at park',
      description: 'Got pack of about 5-6 stray dogs roaming near the SS15 park every evening. They bark very aggressive at joggers and cyclists. One uncle almost fell off his bicycle yesterday. Please relocate them safely.',
      category: 'safety',
      status: 'closed',
      photo_url: '/report-photos/r5-stray-dogs-ss15-park.jpg',
      latitude: 3.0565,
      longitude: 101.5853,
      area_name: 'Subang Jaya, Selangor',
      follower_count: 4,
      resolved_at: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_by: USER_IDS.SITI,
      created_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R6,
      user_id: USER_IDS.AHMAD,
      title: 'Illegal dumping behind shophouses',
      description: 'Someone dumping construction waste behind the shophouses on Jalan Gasing. Got broken tiles, cement bags, and furniture. Been there for 2 weeks. Mosquitoes breeding also.',
      category: 'cleanliness',
      status: 'open',
      photo_url: '/report-photos/r6-illegal-dumping-behind-shophouses.jpg',
      latitude: 3.1095,
      longitude: 101.6478,
      area_name: 'Petaling Jaya, Selangor',
      follower_count: 7,
      created_at: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R7,
      user_id: USER_IDS.MEI_LING,
      title: 'Broken traffic light at busy junction',
      description: 'Traffic light at Persiaran Surian junction not working since this morning. All lights stuck on red. Causing massive jam during peak hours. Very dangerous also.',
      category: 'infrastructure',
      status: 'in_progress',
      photo_url: '/report-photos/r7-broken-traffic-light-persiaran-surian.jpg',
      latitude: 3.1932,
      longitude: 101.6092,
      area_name: 'Kota Damansara, Selangor',
      follower_count: 15,
      created_at: new Date(now - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R8,
      user_id: USER_IDS.SITI,
      title: 'Community hall roof leaking badly',
      description: 'The roof at Section 7 community hall is leaking in multiple places. Every time rains, the floor becomes very slippery. Cannot use the hall properly. Need urgent fixing.',
      category: 'facilities',
      status: 'open',
      photo_url: '/report-photos/r8-community-hall-roof-leaking-section7.jpg',
      latitude: 3.0681,
      longitude: 101.5043,
      area_name: 'Shah Alam, Selangor',
      follower_count: 3,
      created_at: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R9,
      user_id: USER_IDS.RAJESH,
      title: 'Suspicious activity at abandoned building',
      description: 'The old abandoned shophouse on Jalan SS2 got people going in and out at night. Looks suspicious. Neighbors worried about safety. Maybe can check or board it up properly?',
      category: 'safety',
      status: 'open',
      photo_url: '/report-photos/r9-suspicious-activity-abandoned-building-ss2.jpg',
      latitude: 3.1176,
      longitude: 101.6176,
      area_name: 'Petaling Jaya, Selangor',
      follower_count: 9,
      created_at: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: REPORT_IDS.R10,
      user_id: USER_IDS.AHMAD,
      title: 'No water supply in Taman Sri Muda',
      description: 'Our area got no water since yesterday evening. Checked with neighbors, everyone same problem. Air Selangor app showing no updates. Very inconvenient, got elderly and small kids here.',
      category: 'other',
      status: 'in_progress',
      photo_url: '/report-photos/r10-no-water-supply-taman-sri-muda.jpg',
      latitude: 3.0166,
      longitude: 101.4826,
      area_name: 'Shah Alam, Selangor',
      follower_count: 20,
      created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const { error: reportsError } = await supabase.from('reports').insert(reports);
  if (reportsError) throw reportsError;
  console.log(`✓ Created ${reports.length} community reports\n`);

  // Step 4: Create comments
  console.log('💬 Adding community comments...');
  const comments = [
    // R1 - Streetlight
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.AHMAD, content: 'Ya lah, I also noticed this! Very dangerous especially for the kids walking home from tuition.', created_at: new Date(now - 2.8 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.MEI_LING, content: 'Thank you for reporting! I stay nearby also, really need this fixed soon.', created_at: new Date(now - 2.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.RAJESH, content: 'Can contact TNB directly also. Sometimes faster. But good to report here so community knows.', created_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R2 - Bins
    { report_id: REPORT_IDS.R2, user_id: USER_IDS.SITI, content: 'Wah this one really urgent. The smell can spread to nearby restaurants also.', created_at: new Date(now - 4.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R2, user_id: USER_IDS.MEI_LING, content: 'I jogged there this morning, can confirm it\'s very bad. Please collect soon!', created_at: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R3 - Pothole
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.AHMAD, content: 'I nearly accident there yesterday! My car tire went in, lucky never puncture.', created_at: new Date(now - 6.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.RAJESH, content: 'UPDATE: Saw JKR workers marking the area this afternoon. Should fix soon 👍', created_at: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.SITI, content: 'Good to hear! Make sure they do proper job, not just patch patch only.', created_at: new Date(now - 5.8 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R4 - Playground (Resolved)
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.AHMAD, content: 'My kids love this playground. Really dangerous if not fixed. Thanks for reporting!', created_at: new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.MEI_LING, content: 'Good news! Council came and fixed everything. New swings also! 🎉', created_at: new Date(now - 1.2 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.SITI, content: 'Alhamdulillah! Will bring my kids there this weekend to check 😊', created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R5 - Stray dogs (Closed)
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.SITI, content: 'DBKL caught the dogs yesterday. They bring to shelter. Area safe now.', created_at: new Date(now - 8.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.AHMAD, content: 'Thank you! Hope they handle the dogs humanely.', created_at: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R6 - Dumping
    { report_id: REPORT_IDS.R6, user_id: USER_IDS.RAJESH, content: 'Aiyo this one always happening here. Need install CCTV to catch the culprit.', created_at: new Date(now - 11.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R6, user_id: USER_IDS.SITI, content: 'Council acknowledged. They say will clear by end of week and investigate.', created_at: new Date(now - 11 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R7 - Traffic light
    { report_id: REPORT_IDS.R7, user_id: USER_IDS.AHMAD, content: 'Wah very urgent this one! That junction always busy. Police should direct traffic first.', created_at: new Date(now - 0.4 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R7, user_id: USER_IDS.RAJESH, content: 'Just passed by, got 2 policemen directing traffic now. Good response!', created_at: new Date(now - 0.3 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R8 - Hall roof
    { report_id: REPORT_IDS.R8, user_id: USER_IDS.AHMAD, content: 'We had event there last week, ceiling dripping everywhere. Very dangerous for electrical equipment.', created_at: new Date(now - 3.5 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R9 - Suspicious activity
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.MEI_LING, content: 'Better report to police also, not just here. Safety issue.', created_at: new Date(now - 5.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.AHMAD, content: 'Yes already made police report. They say will increase patrol.', created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
    
    // R10 - Water supply
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.SITI, content: 'Same here! Damansara area also no water. Air Selangor emergency hotline always busy 😤', created_at: new Date(now - 0.8 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.MEI_LING, content: 'UPDATE: Air Selangor just posted - burst pipe, fixing now. Should restore by tonight.', created_at: new Date(now - 0.5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.RAJESH, content: 'Good lah at least got update. Better than nothing.', created_at: new Date(now - 0.4 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const { error: commentsError } = await supabase.from('comments').insert(comments);
  if (commentsError) throw commentsError;
  console.log(`✓ Added ${comments.length} community comments\n`);

  // Step 5: Create follows
  console.log('❤️  Creating follow relationships...');
  const follows = [
    // R1 - 5 followers
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.RAJESH },
    { report_id: REPORT_IDS.R1, user_id: USER_IDS.SITI },
    
    // R2 - 8 followers
    { report_id: REPORT_IDS.R2, user_id: USER_IDS.SITI },
    { report_id: REPORT_IDS.R2, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R2, user_id: USER_IDS.RAJESH },
    
    // R3 - 12 followers
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.RAJESH },
    { report_id: REPORT_IDS.R3, user_id: USER_IDS.SITI },
    
    // R4 - 6 followers
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.RAJESH },
    
    // R5 - 4 followers
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.MEI_LING },
    
    // R6 - 7 followers
    { report_id: REPORT_IDS.R6, user_id: USER_IDS.SITI },
    { report_id: REPORT_IDS.R6, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R6, user_id: USER_IDS.RAJESH },
    
    // R7 - 15 followers (popular urgent issue)
    { report_id: REPORT_IDS.R7, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R7, user_id: USER_IDS.SITI },
    { report_id: REPORT_IDS.R7, user_id: USER_IDS.RAJESH },
    
    // R8 - 3 followers
    { report_id: REPORT_IDS.R8, user_id: USER_IDS.AHMAD },
    { report_id: REPORT_IDS.R8, user_id: USER_IDS.RAJESH },
    
    // R9 - 9 followers
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.SITI },
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.AHMAD },
    
    // R10 - 20 followers (critical water issue)
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.SITI },
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.MEI_LING },
    { report_id: REPORT_IDS.R10, user_id: USER_IDS.RAJESH },
  ];

  const { error: followsError } = await supabase.from('follows').insert(follows);
  if (followsError) throw followsError;
  console.log(`✓ Created ${follows.length} follow relationships\n`);

  // Step 6: Create confirmation votes
  console.log('🗳️  Creating confirmation votes...');
  const confirmations = [
    // R4 - Playground (resolved, in confirmation voting)
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.AHMAD, vote: 'confirmed' },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.MEI_LING, vote: 'confirmed' },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.RAJESH, vote: 'confirmed' },
    { report_id: REPORT_IDS.R4, user_id: USER_IDS.SITI, vote: 'not_yet' }, // One dissenting vote
    
    // R5 - Stray dogs (closed, had successful confirmation)
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.AHMAD, vote: 'confirmed' },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.MEI_LING, vote: 'confirmed' },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.RAJESH, vote: 'confirmed' },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.SITI, vote: 'confirmed' },
  ];

  const { error: confirmationsError } = await supabase.from('confirmations').insert(confirmations);
  if (confirmationsError) throw confirmationsError;
  console.log(`✓ Created ${confirmations.length} confirmation votes\n`);

  // Step 7: Award badges
  console.log('🏆 Awarding badges...');
  const badges = [
    // Siti - Power user with all badges
    { user_id: USER_IDS.SITI, type: 'spotter', tier: 'gold', awarded_at: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, type: 'kampung_hero', tier: 'gold', awarded_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, type: 'closer', tier: 'silver', awarded_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Ahmad - Active contributor
    { user_id: USER_IDS.AHMAD, type: 'spotter', tier: 'silver', awarded_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, type: 'closer', tier: 'bronze', awarded_at: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Mei Ling - Growing engagement
    { user_id: USER_IDS.MEI_LING, type: 'spotter', tier: 'bronze', awarded_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const { error: badgesError } = await supabase.from('badges').insert(badges);
  if (badgesError) throw badgesError;
  console.log(`✓ Awarded ${badges.length} badges\n`);

  // Step 8: Create point events (must match total_points exactly)
  console.log('⭐ Recording point events...');
  const pointEvents = [
    // Siti - 485 points total
    // Reports created: 4 × 25 = 100
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R1, action: 'report_created', points: 25, created_at: reports[0].created_at },
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R4, action: 'report_created', points: 25, created_at: reports[3].created_at },
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R8, action: 'report_created', points: 25, created_at: reports[7].created_at },
    { user_id: USER_IDS.SITI, action: 'report_created', points: 25, created_at: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Comments: 6 × 5 = 30
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: comments[3].created_at },
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: comments[7].created_at },
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: comments[10].created_at },
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: comments[14].created_at },
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: comments[20].created_at },
    { user_id: USER_IDS.SITI, action: 'comment_posted', points: 5, created_at: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Confirmations: 5 × 10 = 50
    { user_id: USER_IDS.SITI, action: 'confirmation_vote', points: 10, created_at: new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'confirmation_vote', points: 10, created_at: new Date(now - 24 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'confirmation_vote', points: 10, created_at: new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'confirmation_vote', points: 10, created_at: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'confirmation_vote', points: 10, created_at: new Date(now - 28 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Report closed (as creator): 2 × 25 = 50
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R4, action: 'report_closed', points: 25, created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'report_closed', points: 25, created_at: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Resolution confirmed (as resolver): 3 × 15 = 45
    { user_id: USER_IDS.SITI, action: 'resolution_confirmed', points: 15, created_at: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'resolution_confirmed', points: 15, created_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'resolution_confirmed', points: 15, created_at: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Follows: 10 × 5 = 50
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'follow_report', points: 5, created_at: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Badge unlocks: 6 × 10 = 60
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: badges[0].awarded_at },
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: badges[1].awarded_at },
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: badges[2].awarded_at },
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: new Date(now - 28 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'badge_unlocked', points: 10, created_at: new Date(now - 35 * 24 * 60 * 60 * 1000).toISOString() },
    // Total for Siti: 100 + 30 + 50 + 50 + 45 + 50 + 60 = 385 (need 100 more)
    // Additional older activity
    { user_id: USER_IDS.SITI, action: 'report_created', points: 25, created_at: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'report_created', points: 25, created_at: new Date(now - 32 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'report_created', points: 25, created_at: new Date(now - 35 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.SITI, action: 'report_created', points: 25, created_at: new Date(now - 38 * 24 * 60 * 60 * 1000).toISOString() },
    // Now Siti total: 485 ✓
    
    // Ahmad - 210 points total
    // Reports: 3 × 25 = 75
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R2, action: 'report_created', points: 25, created_at: reports[1].created_at },
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R6, action: 'report_created', points: 25, created_at: reports[5].created_at },
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R10, action: 'report_created', points: 25, created_at: reports[9].created_at },
    
    // Comments: 8 × 5 = 40
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[0].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[5].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[8].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[12].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[15].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[17].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: comments[19].created_at },
    { user_id: USER_IDS.AHMAD, action: 'comment_posted', points: 5, created_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Confirmations: 3 × 10 = 30
    { user_id: USER_IDS.AHMAD, action: 'confirmation_vote', points: 10, created_at: new Date(now - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'confirmation_vote', points: 10, created_at: new Date(now - 7.5 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'confirmation_vote', points: 10, created_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Resolution confirmed (as resolver): 1 × 15 = 15
    { user_id: USER_IDS.AHMAD, action: 'resolution_confirmed', points: 15, created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Badge unlocks: 2 × 10 = 20
    { user_id: USER_IDS.AHMAD, action: 'badge_unlocked', points: 10, created_at: badges[3].awarded_at },
    { user_id: USER_IDS.AHMAD, action: 'badge_unlocked', points: 10, created_at: badges[4].awarded_at },
    
    // Follows: 6 × 5 = 30
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, action: 'follow_report', points: 5, created_at: new Date(now - 22 * 24 * 60 * 60 * 1000).toISOString() },
    // Ahmad total: 75 + 40 + 30 + 15 + 20 + 30 = 210 ✓
    
    // Mei Ling - 120 points
    // Reports: 2 × 25 = 50
    { user_id: USER_IDS.MEI_LING, report_id: REPORT_IDS.R3, action: 'report_created', points: 25, created_at: reports[2].created_at },
    { user_id: USER_IDS.MEI_LING, report_id: REPORT_IDS.R7, action: 'report_created', points: 25, created_at: reports[6].created_at },
    
    // Comments: 6 × 5 = 30
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: comments[1].created_at },
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: comments[4].created_at },
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: comments[9].created_at },
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: comments[18].created_at },
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: comments[21].created_at },
    { user_id: USER_IDS.MEI_LING, action: 'comment_posted', points: 5, created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Confirmations: 2 × 10 = 20
    { user_id: USER_IDS.MEI_LING, action: 'confirmation_vote', points: 10, created_at: new Date(now - 1.3 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.MEI_LING, action: 'confirmation_vote', points: 10, created_at: new Date(now - 7.2 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Badge unlock: 1 × 10 = 10
    { user_id: USER_IDS.MEI_LING, action: 'badge_unlocked', points: 10, created_at: badges[5].awarded_at },
    
    // Follows: 2 × 5 = 10
    { user_id: USER_IDS.MEI_LING, action: 'follow_report', points: 5, created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.MEI_LING, action: 'follow_report', points: 5, created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
    // Mei Ling total: 50 + 30 + 20 + 10 + 10 = 120 ✓
    
    // Rajesh - 85 points
    // Reports: 2 × 25 = 50
    { user_id: USER_IDS.RAJESH, report_id: REPORT_IDS.R5, action: 'report_created', points: 25, created_at: reports[4].created_at },
    { user_id: USER_IDS.RAJESH, report_id: REPORT_IDS.R9, action: 'report_created', points: 25, created_at: reports[8].created_at },
    
    // Comments: 5 × 5 = 25
    { user_id: USER_IDS.RAJESH, action: 'comment_posted', points: 5, created_at: comments[2].created_at },
    { user_id: USER_IDS.RAJESH, action: 'comment_posted', points: 5, created_at: comments[6].created_at },
    { user_id: USER_IDS.RAJESH, action: 'comment_posted', points: 5, created_at: comments[13].created_at },
    { user_id: USER_IDS.RAJESH, action: 'comment_posted', points: 5, created_at: comments[16].created_at },
    { user_id: USER_IDS.RAJESH, action: 'comment_posted', points: 5, created_at: comments[22].created_at },
    
    // Confirmations: 2 × 10 = 20 (would be 30 but that exceeds 85, so just 1)
    { user_id: USER_IDS.RAJESH, action: 'confirmation_vote', points: 10, created_at: new Date(now - 1.1 * 24 * 60 * 60 * 1000).toISOString() },
    // Rajesh total: 50 + 25 + 10 = 85 ✓
  ];

  const { error: pointEventsError } = await supabase.from('point_events').insert(pointEvents);
  if (pointEventsError) throw pointEventsError;
  console.log(`✓ Recorded ${pointEvents.length} point events\n`);

  // Step 9: Create notifications
  console.log('🔔 Creating notifications...');
  const notifications = [
    // Status change notifications
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R2, type: 'status_change', actor_id: null, is_read: false, created_at: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.MEI_LING, report_id: REPORT_IDS.R3, type: 'status_change', actor_id: null, is_read: false, created_at: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString() },
    
    // New comment notifications
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R1, type: 'new_comment', actor_id: USER_IDS.AHMAD, is_read: true, created_at: comments[0].created_at },
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R2, type: 'new_comment', actor_id: USER_IDS.SITI, is_read: false, created_at: comments[3].created_at },
    { user_id: USER_IDS.MEI_LING, report_id: REPORT_IDS.R3, type: 'new_comment', actor_id: USER_IDS.RAJESH, is_read: false, created_at: comments[6].created_at },
    
    // Confirmation request notifications
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R4, type: 'confirmation_request', actor_id: null, is_read: false, created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
    
    // Badge earned notifications
    { user_id: USER_IDS.SITI, report_id: null, type: 'badge_earned', actor_id: null, is_read: true, created_at: badges[0].awarded_at },
    { user_id: USER_IDS.SITI, report_id: null, type: 'badge_earned', actor_id: null, is_read: true, created_at: badges[1].awarded_at },
    { user_id: USER_IDS.SITI, report_id: null, type: 'badge_earned', actor_id: null, is_read: false, created_at: badges[2].awarded_at },
    { user_id: USER_IDS.AHMAD, report_id: null, type: 'badge_earned', actor_id: null, is_read: false, created_at: badges[3].awarded_at },
    { user_id: USER_IDS.MEI_LING, report_id: null, type: 'badge_earned', actor_id: null, is_read: false, created_at: badges[5].awarded_at },
    
    // Report followed notifications
    { user_id: USER_IDS.SITI, report_id: REPORT_IDS.R2, type: 'report_followed', actor_id: USER_IDS.MEI_LING, is_read: true, created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { user_id: USER_IDS.AHMAD, report_id: REPORT_IDS.R10, type: 'report_followed', actor_id: USER_IDS.RAJESH, is_read: false, created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const { error: notificationsError } = await supabase.from('notifications').insert(notifications);
  if (notificationsError) throw notificationsError;
  console.log(`✓ Created ${notifications.length} notifications\n`);

  // Step 10: Create a few flags for admin dashboard demo
  console.log('🚩 Creating sample flags...');
  const flags = [
    { report_id: REPORT_IDS.R9, user_id: USER_IDS.MEI_LING, reason: 'This report contains unverified claims about suspicious activity. Should be investigated before taking action.', created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { report_id: REPORT_IDS.R5, user_id: USER_IDS.AHMAD, reason: 'The description could be more specific about the location. Also concerned about the safety of the animals.', created_at: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const { error: flagsError } = await supabase.from('flags').insert(flags);
  if (flagsError) throw flagsError;
  console.log(`✓ Created ${flags.length} flags for admin dashboard\n`);

  // Summary
  console.log('✅ Seed complete!\n');
  console.log('📊 Summary:');
  console.log(`   • ${users.length} users (2 admin including test account, 3 regular demo users)`);
  console.log(`   • ${reports.length} community reports across all categories`);
  console.log(`   • ${comments.length} realistic Malaysian English comments`);
  console.log(`   • ${follows.length} follow relationships`);
  console.log(`   • ${confirmations.length} confirmation votes`);
  console.log(`   • ${badges.length} badges awarded`);
  console.log(`   • ${pointEvents.length} point events recorded`);
  console.log(`   • ${notifications.length} notifications created`);
  console.log(`   • ${flags.length} flagged items for admin dashboard`);
  console.log('\n🎉 Database ready for demo!\n');
  console.log('📝 Demo seed users (Google OAuth):');
  console.log('   Admin: siti.demo@laporlah.my (Siti Nurhaliza)');
  console.log('   User:  ahmad.demo@laporlah.my (Ahmad Faiz)');
  console.log('   User:  meiling.demo@laporlah.my (Mei Ling Tan)');
  console.log('   User:  rajesh.demo@laporlah.my (Rajesh Kumar)');
  console.log('\n🔑 Test account (email/password, admin access — for testers):');
  console.log(`   Email:    ${TEST_USER_EMAIL}`);
  console.log(`   Password: ${TEST_USER_PASSWORD}`);
  console.log('   Use "Sign in with email" on the login page. Full access including admin dashboard.');
  console.log('\n💡 Next steps:');
  console.log('   1. These are demo users with realistic data (reports, comments, badges)');
  console.log('   2. Sign in with your own Google account, or use the test account above for full access');
  console.log('   3. To view a specific demo user profile, visit /profile/[user_id] (e.g., /profile/11111111-1111-1111-1111-111111111111 for Siti)');
}

main().catch((error) => {
  console.error('❌ Seed script failed:');
  console.error(error);
  process.exit(1);
});
