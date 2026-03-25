import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { live_class_id } = await request.json();

    if (!live_class_id) {
      return NextResponse.json({ error: 'Missing live class ID' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the live class and verify it exists
    const { data: liveClass } = await supabase
      .from('live_classes')
      .select('id, program_id, meet_link')
      .eq('id', live_class_id)
      .single();

    if (!liveClass) {
      return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
    }

    // Verify student is enrolled in the program
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('program_id', liveClass.program_id)
      .eq('status', 'active')
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: 'You are not enrolled in this program' }, { status: 403 });
    }

    // Check if student is already enrolled in this class
    const { data: existingEnrollment } = await supabase
      .from('class_enrollments')
      .select('id')
      .eq('live_class_id', live_class_id)
      .eq('student_id', user.id)
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        { success: true, data: { already_joined: true, meet_link: liveClass.meet_link } },
        { status: 200 }
      );
    }

    // Create class enrollment
    const { data, error } = await supabase
      .from('class_enrollments')
      .insert({
        live_class_id,
        student_id: user.id,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error joining live class:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: { ...data, meet_link: liveClass.meet_link } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in join live class route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
