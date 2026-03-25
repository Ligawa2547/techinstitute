-- Add Google Meet columns to live_classes table
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS google_meet_url TEXT;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS max_participants INT DEFAULT 100;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled';

-- Create lesson_recordings table for storing recording metadata
CREATE TABLE IF NOT EXISTS public.lesson_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  duration_minutes INT,
  file_size_bytes BIGINT,
  recording_provider TEXT DEFAULT 'google_meet',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson_attendance table to track who attended
CREATE TABLE IF NOT EXISTS public.lesson_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(live_class_id, student_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_live_classes_google_meet ON public.live_classes(google_meet_url);
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON public.live_classes(status, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_lesson_recordings_class ON public.lesson_recordings(live_class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_attendance_student ON public.lesson_attendance(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lesson_attendance_class ON public.lesson_attendance(live_class_id);

-- Enable RLS on new tables
ALTER TABLE public.lesson_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_recordings
CREATE POLICY lesson_recordings_student_view ON public.lesson_recordings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments
      WHERE class_enrollments.live_class_id = lesson_recordings.live_class_id
      AND class_enrollments.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY lesson_recordings_admin_all ON public.lesson_recordings
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- RLS Policies for lesson_attendance
CREATE POLICY lesson_attendance_student_view ON public.lesson_attendance
  FOR SELECT
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY lesson_attendance_student_insert ON public.lesson_attendance
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY lesson_attendance_student_update ON public.lesson_attendance
  FOR UPDATE
  USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
