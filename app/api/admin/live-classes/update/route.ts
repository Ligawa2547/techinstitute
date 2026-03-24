import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, scheduled_at, meet_link, is_active } = await request.json();

    if (!id) {
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Only admins can update live classes' }, { status: 403 });
    }

    // Verify the admin owns this live class
    const { data: liveClass } = await supabase
      .from('live_classes')
      .select('created_by')
      .eq('id', id)
      .single();

    if (!liveClass || liveClass.created_by !== user.id) {
      return NextResponse.json({ error: 'You can only update your own live classes' }, { status: 403 });
    }

    // Update the live class
    const { data, error } = await supabase
      .from('live_classes')
      .update({
        title,
        description,
        scheduled_at,
        meet_link: meet_link || null,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating live class:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in update live class route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
