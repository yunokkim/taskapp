import { getGoogleCalendarClient, getGoogleRecurrence } from './googleCalendar';
import { supabase } from './supabase';
import { Event } from '@/types';

export async function syncEventToGoogle(event: Event, accessToken: string) {
  try {
    const calendar = getGoogleCalendarClient(accessToken);
    
    const googleEvent = {
      summary: event.title,
      description: event.description || '',
      start: {
        dateTime: event.start.toISOString(),
        timeZone: 'Asia/Seoul'
      },
      end: {
        dateTime: event.end?.toISOString() || event.start.toISOString(),
        timeZone: 'Asia/Seoul'
      },
      recurrence: event.repeat !== 'none' ? getGoogleRecurrence(event.repeat || 'none') : undefined
    };

    // Google Calendar에서 이벤트 ID 확인
    const { data: existingEvent } = await supabase
      .from('events')
      .select('google_calendar_id')
      .eq('id', event.id)
      .single();

    if (existingEvent?.google_calendar_id) {
      // 업데이트
      const response = await calendar.events.update({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: existingEvent.google_calendar_id,
        requestBody: googleEvent
      });
      return response.data.id;
    } else {
      // 생성
      const response = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: googleEvent
      });
      
      // Google Calendar ID를 Supabase에 저장
      if (response.data.id) {
        await supabase
          .from('events')
          .update({ google_calendar_id: response.data.id })
          .eq('id', event.id);
      }
      
      return response.data.id;
    }
  } catch (error) {
    console.error('Error syncing event to Google Calendar:', error);
    throw error;
  }
}

export async function deleteEventFromGoogle(eventId: string, accessToken: string) {
  try {
    // Google Calendar ID 조회
    const { data: event } = await supabase
      .from('events')
      .select('google_calendar_id')
      .eq('id', eventId)
      .single();

    if (event?.google_calendar_id) {
      const calendar = getGoogleCalendarClient(accessToken);
      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: event.google_calendar_id
      });
    }
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error);
    throw error;
  }
}