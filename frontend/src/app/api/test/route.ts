import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Supabase 연결 테스트
    const { data, error } = await supabase.from('_').select('*').limit(1)
    
    if (error && !error.message.includes('does not exist')) {
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    console.error('Supabase connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Supabase',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}