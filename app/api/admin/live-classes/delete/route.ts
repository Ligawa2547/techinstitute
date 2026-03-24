import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

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
      return NextResponse.json({ error: 'Only admins can delete live classes' }, { status: 403 });
    }

    // Verify the admin owns this live class
    const { data: liveClass } = await supabase
      .from('live_classes')
      .select('created_by')
      .eq('id', id)
      .single();

    if (!liveClass || liveClass.created_by !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own live classes' }, { status: 403 });
    }

    // Delete the live class
    const { error } = await supabase
      .from('live_classes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting live class:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Live class deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in delete live class route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
