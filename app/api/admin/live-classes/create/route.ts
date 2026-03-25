import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { title, description, program_id, module_id, scheduled_at, meet_link, youtube_url } = await request.json();

    // Get the user from the request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user is an admin
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
      return NextResponse.json({ error: 'Only admins can create live classes' }, { status: 403 });
    }

    // Validate module belongs to program
    if (module_id) {
      const { data: moduleCheck, error: moduleError } = await supabase
        .from('modules')
        .select('program_id')
        .eq('id', module_id)
        .single();

      if (moduleError || !moduleCheck || moduleCheck.program_id !== program_id) {
        return NextResponse.json({ error: 'Module must belong to selected program' }, { status: 400 });
      }
    }

    // Create the live class
    const { data, error } = await supabase
      .from('live_classes')
      .insert({
        title,
        description,
        program_id,
        module_id: module_id || null,
        scheduled_at,
        meet_link: meet_link || null,
        youtube_url: youtube_url || null,
        created_by: user.id,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating live class:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error in create live class route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
