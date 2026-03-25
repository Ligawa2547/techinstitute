import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { live_class_id, joined_at } = body

    // Record attendance
    const { data, error } = await supabase
      .from('lesson_attendance')
      .insert({
        live_class_id,
        student_id: user.id,
        joined_at: joined_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error && !error.message.includes('duplicate')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || { success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { live_class_id, left_at, duration_minutes } = body

    // Update attendance record with exit time
    const { data, error } = await supabase
      .from('lesson_attendance')
      .update({
        left_at: left_at || new Date().toISOString(),
        duration_minutes
      })
      .eq('live_class_id', live_class_id)
      .eq('student_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
