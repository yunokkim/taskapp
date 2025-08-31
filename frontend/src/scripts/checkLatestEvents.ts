import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestEvents() {
  try {
    // 최근 생성된 이벤트들 조회 (8월 31일 이후)
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        personas (*)
      `)
      .gte('created_at', '2025-08-31T00:00:00Z')
      .order('created_at', { ascending: false });
    
    console.log('Recent events count:', events?.length || 0);
    
    if (events && events.length > 0) {
      console.log('\n=== Recent Events ===');
      events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   Created: ${event.created_at}`);
        console.log(`   Start: ${event.start}`);
        console.log(`   Google Calendar ID: ${event.google_calendar_id || 'Not synced'}`);
        console.log(`   Persona: ${event.personas?.name}`);
        console.log('');
      });
    }

    // Google 동기화 상태 확인
    const { data: syncStatus, error: syncError } = await supabase
      .from('google_sync_status')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (syncStatus && syncStatus.length > 0) {
      console.log('\n=== Sync Status ===');
      syncStatus.forEach((status, index) => {
        console.log(`${index + 1}. Event ID: ${status.event_id}`);
        console.log(`   Status: ${status.sync_status}`);
        console.log(`   Last Sync: ${status.last_sync_at || 'Never'}`);
        console.log(`   Error: ${status.error_message || 'None'}`);
        console.log('');
      });
    } else {
      console.log('No sync status records found');
    }

    if (error) console.error('Events error:', error);
    if (syncError) console.error('Sync status error:', syncError);

  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkLatestEvents();