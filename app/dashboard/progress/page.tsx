'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, BookOpen, CheckCircle, Award } from 'lucide-react'

interface ProgramProgress {
  id: string
  program_id: string
  student_id: string
  completion_percentage: number
  lessons_completed: number
  total_lessons: number
  last_accessed_at: string
  program?: {
    id: string
    title: string
    duration_weeks: number
  }
}

interface LessonProgress {
  lesson_id: string
  is_completed: boolean
  lesson?: {
    title: string
  }
}

export default function ProgressPage() {
  const [programProgress, setProgramProgress] = useState<ProgramProgress[]>([])
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  useEffect(() => {
    fetchProgress()
  }, [])

  async function fetchProgress() {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get program progress
      const { data: progData, error: progErr } = await supabase
        .from('program_progress')
        .select(`
          *,
          programs:program_id(id, title, duration_weeks)
        `)
        .eq('student_id', user.id)

      if (progErr) throw progErr

      setProgramProgress(progData || [])
      if (progData && progData.length > 0) {
        setSelectedProgram(progData[0].program_id)
      }

      // Get lesson progress for first program
      if (progData && progData.length > 0) {
        const { data: lessonData, error: lessonErr } = await supabase
          .from('lesson_progress')
          .select(`
            lesson_id,
            is_completed,
            lessons:lesson_id(title)
          `)
          .eq('student_id', user.id)

        if (lessonErr) throw lessonErr
        setLessonProgress(lessonData || [])
      }
    } catch (err) {
      console.error('Failed to load progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentProgram = programProgress.find((p) => p.program_id === selectedProgram)
  const totalProgress = programProgress.length > 0
    ? Math.round(programProgress.reduce((sum, p) => sum + p.completion_percentage, 0) / programProgress.length)
    : 0

  const completedPrograms = programProgress.filter((p) => p.completion_percentage === 100).length
  const inProgressPrograms = programProgress.length - completedPrograms

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-3xl font-bold text-primary mt-2">{totalProgress}%</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{totalProgress}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-accent mt-2">{inProgressPrograms}</p>
            </div>
            <BookOpen className="h-12 w-12 text-accent/40" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{completedPrograms}</p>
            </div>
            <Award className="h-12 w-12 text-green-500/40" />
          </div>
        </div>
      </div>

      {/* Program Selection and Details */}
      {loading ? (
        <div className="h-96 bg-card rounded-lg border border-border animate-pulse"></div>
      ) : programProgress.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No enrolled programs yet</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Program List */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {programProgress.map((prog) => (
                <button
                  key={prog.program_id}
                  onClick={() => setSelectedProgram(prog.program_id)}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${
                    selectedProgram === prog.program_id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium truncate">{prog.program?.title || 'Unknown'}</p>
                  <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${prog.completion_percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {prog.completion_percentage}% complete
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Program Details */}
          {currentProgram && (
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {currentProgram.program?.title || 'Unknown Program'}
                </h2>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Course Completion</p>
                    <p className="text-sm font-semibold text-primary">{currentProgram.completion_percentage}%</p>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${currentProgram.completion_percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Lessons Completed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {currentProgram.lessons_completed}/{currentProgram.total_lessons}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Last Accessed</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentProgram.last_accessed_at
                        ? new Date(currentProgram.last_accessed_at).toLocaleDateString()
                        : 'Not yet'}
                    </p>
                  </div>
                </div>

                {currentProgram.completion_percentage === 100 && (
                  <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-700 dark:text-green-400">Course Completed!</p>
                    <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                      View your certificate in the Certificates section
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Breakdown */}
              {lessonProgress.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Lessons</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {lessonProgress.map((lesson) => (
                      <div
                        key={lesson.lesson_id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        {lesson.is_completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />
                        )}
                        <p className={lesson.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                          {lesson.lesson?.title || 'Lesson'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
