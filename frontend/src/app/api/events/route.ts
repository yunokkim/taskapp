import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { syncEventToGoogle } from '@/lib/googleCalendarSync'
import { authOptions } from '@/lib/auth'

// GET /api/events - 모든 이벤트 조회 (필터링 지원)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const personaIds = searchParams.get('personaIds')?.split(',').filter(Boolean)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const searchText = searchParams.get('searchText')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)

    let query = supabase
      .from('events')
      .select(`
        *,
        personas (*),
        notification_settings (*)
      `)
      .order('start', { ascending: true })

    // 필터링 적용
    if (personaIds && personaIds.length > 0) {
      query = query.in('persona_id', personaIds)
    }

    if (startDate) {
      query = query.gte('start', startDate)
    }

    if (endDate) {
      query = query.lte('start', endDate)
    }

    if (searchText) {
      query = query.or(`title.ilike.%${searchText}%,description.ilike.%${searchText}%`)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data: events, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(events, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - 새 이벤트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      start, 
      end, 
      personaId, 
      tags, 
      repeat,
      notifications 
    } = body

    if (!title || !start || !personaId) {
      return NextResponse.json(
        { error: 'Title, start date, and persona are required' },
        { status: 400 }
      )
    }

    // 페르소나가 존재하는지 확인
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('id')
      .eq('id', personaId)
      .single()

    if (personaError || !persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    // 이벤트 생성
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title,
        description,
        start: new Date(start).toISOString(),
        end: end ? new Date(end).toISOString() : null,
        persona_id: personaId,
        tags: tags || [],
        repeat: repeat || 'NONE',
      })
      .select(`
        *,
        personas (*),
        notification_settings (*)
      `)
      .single()

    if (eventError) {
      throw eventError
    }

    // 알림 설정이 있다면 추가
    if (notifications && notifications.length > 0 && event) {
      const notificationData = notifications.map((notif: { type: string; minutesBefore: number }) => ({
        event_id: event.id,
        type: notif.type.toUpperCase(),
        minutes_before: notif.minutesBefore,
      }))

      const { error: notifError } = await supabase
        .from('notification_settings')
        .insert(notificationData)

      if (notifError) {
        console.error('Error creating notifications:', notifError)
      }
    }

    // Google Calendar 동기화 시도
    try {
      const session = await getServerSession(authOptions);
      if (session?.accessToken && event) {
        await syncEventToGoogle({
          id: event.id,
          title: event.title,
          description: event.description,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
          personaId: event.persona_id,
          tags: event.tags,
          repeat: event.repeat.toLowerCase()
        }, session.accessToken);
      }
    } catch (syncError) {
      console.error('Google Calendar sync failed:', syncError);
      // 동기화 실패해도 이벤트 생성은 성공으로 처리
    }

    return NextResponse.json(event, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create event' },
      { status: 500 }
    )
  }
}