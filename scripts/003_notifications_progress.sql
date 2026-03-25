-- Create notifications table for user alerts and messages
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create program_progress table to track student advancement
CREATE TABLE IF NOT EXISTS public.program_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  completion_percentage INT DEFAULT 0,
  lessons_completed INT DEFAULT 0,
  quizzes_passed INT DEFAULT 0,
  total_lessons INT DEFAULT 0,
  total_quizzes INT DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, program_id)
);

-- Create lesson_progress table for granular tracking
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  time_spent_minutes INT DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Create calendar_events table for class schedules
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location_or_link TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_progress_student ON public.program_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_program_progress_program ON public.program_progress(program_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_program ON public.calendar_events(program_id, start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON public.calendar_events(event_type, start_time);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications - Students can view their own notifications
CREATE POLICY notifications_user_read ON public.notifications
  FOR SELECT
  USING (
    recipient_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- RLS Policies for notifications - Admins can create notifications
CREATE POLICY notifications_admin_insert ON public.notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- Enable RLS on program_progress
ALTER TABLE public.program_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for program_progress - Students can view their own progress
CREATE POLICY program_progress_user_read ON public.program_progress
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- Enable RLS on lesson_progress
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_progress - Students can view their own progress
CREATE POLICY lesson_progress_user_read ON public.lesson_progress
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- Enable RLS on calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_events - Everyone can view events for their programs
CREATE POLICY calendar_events_read ON public.calendar_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE public.enrollments.student_id = auth.uid()
        AND public.enrollments.program_id = public.calendar_events.program_id
        AND public.enrollments.status = 'active'
    )
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );
