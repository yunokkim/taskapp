import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[id] - 특정 이벤트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        personas (*),
        notification_settings (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(event, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: any) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - 이벤트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // 기존 알림 설정 삭제
    await supabase
      .from('notification_settings')
      .delete()
      .eq('event_id', id)

    // 이벤트 수정
    const { data: event, error: eventError } = await supabase
      .from('events')
      .update({
        title,
        description,
        start: new Date(start).toISOString(),
        end: end ? new Date(end).toISOString() : null,
        persona_id: personaId,
        tags: tags || [],
        repeat: repeat || 'NONE',
      })
      .eq('id', id)
      .select(`
        *,
        personas (*),
        notification_settings (*)
      `)
      .single()

    if (eventError) {
      throw eventError
    }

    // 새 알림 설정 추가
    if (notifications && notifications.length > 0 && event) {
      const notificationData = notifications.map((notif: any) => ({
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

    return NextResponse.json(event, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: any) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - 이벤트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 이벤트와 연결된 알림도 함께 삭제됨 (CASCADE)
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: any) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    )
  }
}