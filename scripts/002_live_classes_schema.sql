-- Ratego Institute of Technology - Live Classes Feature
-- Migration to create tables for Google Meet integration

-- Create live_classes table for storing scheduled live classes/sessions
CREATE TABLE IF NOT EXISTS live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  meet_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_program_scheduled(program_id, scheduled_at),
  INDEX idx_created_by(created_by)
);

-- Create class_enrollments table to track which students joined which live classes
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(live_class_id, student_id),
  INDEX idx_student_classes(student_id, created_at),
  INDEX idx_class_students(live_class_id)
);

-- Enable RLS on live_classes
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can create and manage live classes for their programs
CREATE POLICY live_classes_admin_create ON live_classes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- RLS Policy: Admins can update live classes they created
CREATE POLICY live_classes_admin_update ON live_classes
  FOR UPDATE
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
    AND created_by = auth.uid()
  );

-- RLS Policy: Admins can delete live classes they created
CREATE POLICY live_classes_admin_delete ON live_classes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
    AND created_by = auth.uid()
  );

-- RLS Policy: Anyone can read active live classes for programs they're enrolled in
CREATE POLICY live_classes_students_read ON live_classes
  FOR SELECT
  USING (
    is_active = true
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.student_id = auth.uid()
        AND enrollments.program_id = live_classes.program_id
        AND enrollments.is_active = true
    )
  );

-- Enable RLS on class_enrollments
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own class enrollments
CREATE POLICY class_enrollments_student_read ON class_enrollments
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- RLS Policy: Students can create class enrollments for themselves
CREATE POLICY class_enrollments_student_insert ON class_enrollments
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.student_id = auth.uid()
        AND enrollments.program_id = (
          SELECT program_id FROM live_classes WHERE id = live_class_id
        )
        AND enrollments.is_active = true
    )
  );

-- RLS Policy: Students can update their own class enrollments (join/leave times)
CREATE POLICY class_enrollments_student_update ON class_enrollments
  FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Create index on live_classes for faster queries
CREATE INDEX IF NOT EXISTS idx_live_classes_active ON live_classes(is_active, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_classes_program ON live_classes(program_id);
