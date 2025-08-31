import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/personas - 모든 페르소나 조회
export async function GET() {
  try {
    const { data: personas, error } = await supabase
      .from('personas')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      throw error
    }
    
    return NextResponse.json(personas, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching personas:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch personas' },
      { status: 500 }
    )
  }
}

// POST /api/personas - 새 페르소나 생성
export async function POST(request: NextRequest) {
  try {
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
      .insert({
        name,
        color,
        description,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(persona, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error: unknown) {
    console.error('Error creating persona:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create persona' },
      { status: 500 }
    )
  }
}