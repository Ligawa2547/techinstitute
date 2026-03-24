-- Ratego Institute of Technology - Live Classes Feature
-- Migration to create tables for Google Meet integration

-- Create live_classes table for storing scheduled live classes/sessions
CREATE TABLE IF NOT EXISTS public.live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  meet_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_enrollments table to track which students joined which live classes
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(live_class_id, student_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_live_classes_program_scheduled ON public.live_classes(program_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_classes_created_by ON public.live_classes(created_by);
CREATE INDEX IF NOT EXISTS idx_live_classes_active ON public.live_classes(is_active, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student ON public.class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_live_class ON public.class_enrollments(live_class_id);

-- Enable RLS on live_classes
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can create live classes
CREATE POLICY live_classes_admin_create ON public.live_classes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- RLS Policy: Admins can update their own live classes
CREATE POLICY live_classes_admin_update ON public.live_classes
  FOR UPDATE
  USING (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- RLS Policy: Admins can delete their own live classes
CREATE POLICY live_classes_admin_delete ON public.live_classes
  FOR DELETE
  USING (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- RLS Policy: Students can view active live classes for their programs
CREATE POLICY live_classes_students_read ON public.live_classes
  FOR SELECT
  USING (
    is_active = true
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE public.enrollments.student_id = auth.uid()
        AND public.enrollments.program_id = public.live_classes.program_id
        AND public.enrollments.status = 'active'
    )
  );

-- Enable RLS on class_enrollments
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own class enrollments
CREATE POLICY class_enrollments_student_read ON public.class_enrollments
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
        AND public.profiles.is_admin = true
    )
  );

-- RLS Policy: Students can create class enrollments for themselves
CREATE POLICY class_enrollments_student_insert ON public.class_enrollments
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE public.enrollments.student_id = auth.uid()
        AND public.enrollments.program_id = (
          SELECT program_id FROM public.live_classes WHERE id = live_class_id
        )
        AND public.enrollments.status = 'active'
    )
  );

-- RLS Policy: Students can update their own class enrollments
CREATE POLICY class_enrollments_student_update ON public.class_enrollments
  FOR UPDATE
  USING (student_id = auth.uid());
