import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
  try {
    // 페르소나 확인
    const { data: personas, error: personasError } = await supabase
      .from('personas')
      .select('*');
    
    console.log('Personas:', personas);
    if (personasError) console.error('Personas error:', personasError);

    // 이벤트 확인
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        personas (*)
      `);
    
    console.log('Events count:', events?.length || 0);
    console.log('Events:', events);
    if (eventsError) console.error('Events error:', eventsError);

  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkEvents();