import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncEventToGoogle } from '@/lib/googleCalendarSync';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Google authentication required' },
        { status: 401 }
      );
    }

    const { eventId } = await request.json();
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // 이벤트 조회
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Google Calendar에 동기화
    const googleEventId = await syncEventToGoogle({
      id: event.id,
      title: event.title,
      description: event.description,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : undefined,
      personaId: event.persona_id,
      tags: event.tags,
      repeat: event.repeat.toLowerCase()
    }, session.accessToken);

    return NextResponse.json({ 
      success: true, 
      googleEventId 
    });

  } catch (error: unknown) {
    console.error('Error syncing to Google Calendar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync with Google Calendar' },
      { status: 500 }
    );
  }
}