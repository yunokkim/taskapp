import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testGoogleSync() {
  try {
    console.log('Testing Google Calendar sync...');
    
    // Test Google Calendar API connection
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    console.log('Google OAuth client created successfully');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
    console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
    console.log('NextAuth Secret:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing');
    
    // Check if we can access the API without auth (just to test connection)
    try {
      const calendar = google.calendar({ version: 'v3', auth });
      console.log('Google Calendar API client created successfully');
    } catch (error) {
      console.error('Error creating Google Calendar client:', error);
    }

    // Check recent events in database
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('created_at', '2025-08-31T03:00:00Z')
      .order('created_at', { ascending: false })
      .limit(5);

    if (events && events.length > 0) {
      console.log('\n=== Recent Events for Sync Test ===');
      events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   ID: ${event.id}`);
        console.log(`   Google Calendar ID: ${event.google_calendar_id || 'Not synced'}`);
        console.log(`   Created: ${event.created_at}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testGoogleSync();