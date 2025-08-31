import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/personas/[id] - 특정 페르소나 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: persona, error } = await supabase
      .from('personas')
      .select(`
        *,
        events (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Persona not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(persona, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching persona:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch persona' },
      { status: 500 }
    )
  }
}

// PUT /api/personas/[id] - 페르소나 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, color, description } = body

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      )
    }

    const { data: persona, error } = await supabase
      .from('personas')
      .update({
        name,
        color,
        description,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(persona, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error updating persona:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update persona' },
      { status: 500 }
    )
  }
}

// DELETE /api/personas/[id] - 페르소나 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 페르소나와 연결된 모든 이벤트도 함께 삭제됨 (CASCADE)
    const { error } = await supabase
      .from('personas')
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
  } catch (error: unknown) {
    console.error('Error deleting persona:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete persona' },
      { status: 500 }
    )
  }
}