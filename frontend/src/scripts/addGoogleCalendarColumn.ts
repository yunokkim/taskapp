import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addGoogleCalendarColumn() {
  try {
    // google_calendar_id 컬럼을 events 테이블에 추가
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE events ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;'
    });

    if (error) {
      console.error('Error adding column:', error);
    } else {
      console.log('google_calendar_id column added successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

addGoogleCalendarColumn();