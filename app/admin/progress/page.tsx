'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, BarChart3, Users, TrendingUp } from 'lucide-react'

interface ProgramStats {
  program_id: string
  program_title: string
  total_students: number
  average_progress: number
  completed_students: number
  in_progress_students: number
}

interface StudentProgress {
  student_id: string
  student_name: string
  program_title: string
  completion_percentage: number
  lessons_completed: number
  total_lessons: number
}

export default function AdminProgressPage() {
  const [programStats, setProgramStats] = useState<ProgramStats[]>([])
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get program statistics
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          program_id,
          programs:program_id(id, title)
        `)

      if (!enrollmentsData) return

      const programMap = new Map<string, ProgramStats>()

      // Process enrollments to get program stats
      for (const enrollment of enrollmentsData) {
        const key = enrollment.program_id
        if (!programMap.has(key)) {
          programMap.set(key, {
            program_id: key,
            program_title: enrollment.programs?.title || 'Unknown',
            total_students: 0,
            completed_students: 0,
            in_progress_students: 0,
            average_progress: 0,
          })
        }
        const stat = programMap.get(key)!
        stat.total_students++
      }

      // Get progress data
      const { data: progressData } = await supabase
        .from('program_progress')
        .select(`
          program_id,
          completion_percentage,
          student_id,
          students:student_id(full_name)
        `)

      if (progressData) {
        let totalProgress = 0
        for (const prog of progressData) {
          const stat = programMap.get(prog.program_id)
          if (stat) {
            totalProgress += prog.completion_percentage
            if (prog.completion_percentage === 100) {
              stat.completed_students++
            } else if (prog.completion_percentage > 0) {
              stat.in_progress_students++
            }
          }
        }

        for (const stat of programMap.values()) {
          if (stat.total_students > 0) {
            stat.average_progress = Math.round(totalProgress / progressData.filter(p => p.program_id === stat.program_id).length)
          }
        }
      }

      const stats = Array.from(programMap.values())
      setProgramStats(stats)

      // Get student progress details
      const { data: detailedProgress } = await supabase
        .from('program_progress')
        .select(`
          completion_percentage,
          lessons_completed,
          total_lessons,
          student_id,
          program_id,
          students:student_id(full_name),
          programs:program_id(title)
        `)
        .order('completion_percentage', { ascending: false })
        .limit(20)

      if (detailedProgress) {
        const formattedProgress = detailedProgress.map((item: any) => ({
          student_id: item.student_id,
          student_name: item.students?.full_name || 'Unknown',
          program_title: item.programs?.title || 'Unknown',
          completion_percentage: item.completion_percentage,
          lessons_completed: item.lessons_completed,
          total_lessons: item.total_lessons,
        }))
        setStudentProgress(formattedProgress)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const totalStudents = programStats.reduce((sum, p) => sum + p.total_students, 0)
  const totalCompleted = programStats.reduce((sum, p) => sum + p.completed_students, 0)
  const avgProgress =
    studentProgress.length > 0
      ? Math.round(
          studentProgress.reduce((sum, s) => sum + s.completion_percentage, 0) / studentProgress.length
        )
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Progress Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track student progress across all programs</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-primary mt-2">{totalStudents}</p>
            </div>
            <Users className="h-12 w-12 text-primary/40" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{totalCompleted}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500/40" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {totalStudents > 0 ? Math.round((totalCompleted / totalStudents) * 100) : 0}%
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-accent/40" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
              <p className="text-3xl font-bold text-primary mt-2">{avgProgress}%</p>
            </div>
            <BarChart3 className="h-12 w-12 text-primary/40" />
          </div>
        </div>
      </div>

      {/* Program Stats */}
      {loading ? (
        <div className="h-96 bg-card rounded-lg border border-border animate-pulse"></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Programs Overview */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold mb-4">Program Overview</h3>
            <div className="space-y-4">
              {programStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">No program data available</p>
              ) : (
                programStats.map((prog) => (
                  <div key={prog.program_id} className="border-l-4 border-primary pl-4 py-2">
                    <p className="font-medium text-foreground">{prog.program_title}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Students:</span>
                        <span className="font-semibold">{prog.total_students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-semibold text-green-500">{prog.completed_students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">In Progress:</span>
                        <span className="font-semibold text-accent">{prog.in_progress_students}</span>
                      </div>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${prog.average_progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">Avg: {prog.average_progress}%</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Performing Students */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold mb-4">Top Performing Students</h3>
            <div className="space-y-3">
              {studentProgress.length === 0 ? (
                <p className="text-sm text-muted-foreground">No student progress data</p>
              ) : (
                studentProgress.slice(0, 8).map((student, idx) => (
                  <div key={`${student.student_id}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{student.student_name}</p>
                      <p className="text-xs text-muted-foreground">{student.program_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{student.completion_percentage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {student.lessons_completed}/{student.total_lessons}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
