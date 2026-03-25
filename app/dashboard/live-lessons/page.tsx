'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Video, Clock, BookOpen, AlertCircle, Users } from 'lucide-react'

interface LiveClass {
  id: string
  title: string
  description: string
  scheduled_at: string
  meet_link?: string
  youtube_url?: string
  google_meet_url?: string
  is_active: boolean
  program_id: string
  program_title?: string
  module_title?: string
  status?: string
}

export default function LiveLessonsPage() {
  const [classes, setClasses] = useState<LiveClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null)
  const [joinedClasses, setJoinedClasses] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchLiveClasses()
  }, [filter])

  async function fetchLiveClasses() {
    try {
      setLoading(true)
      const supabase = createClient()
      const now = new Date().toISOString()

      // Get user's enrolled programs
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('program_id')
        .eq('status', 'active')

      if (!enrollments || enrollments.length === 0) {
        setClasses([])
        return
      }

      const programIds = enrollments.map((e) => e.program_id)

      let query = supabase
        .from('live_classes')
        .select(`id, title, description, scheduled_at, meet_link, youtube_url, google_meet_url, is_active, status, program_id, programs(title), modules(title)`)
        .in('program_id', programIds)

      if (filter === 'upcoming') {
        query = query.gte('scheduled_at', now).order('scheduled_at', { ascending: true })
      } else if (filter === 'past') {
        query = query.lt('scheduled_at', now).order('scheduled_at', { ascending: false })
      } else {
        query = query.order('scheduled_at', { ascending: false })
      }

      const { data, error: err } = await query

      if (err) throw err

      const formattedData = data?.map((item: any) => ({
        ...item,
        program_title: item.programs?.title || 'Unknown Program',
        module_title: item.modules?.title || '',
      })) || []

      setClasses(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load live classes')
    } finally {
      setLoading(false)
    }
  }

  const isLiveNow = (scheduledAt: string) => {
    const eventTime = new Date(scheduledAt)
    const now = new Date()
    const diffMinutes = (eventTime.getTime() - now.getTime()) / (1000 * 60)
    return diffMinutes >= -15 && diffMinutes <= 120
  }

  const getStatusBadge = (scheduledAt: string) => {
    const eventTime = new Date(scheduledAt)
    const now = new Date()
    const diffMinutes = (eventTime.getTime() - now.getTime()) / (1000 * 60)

    if (diffMinutes < -15) return { text: 'Ended', color: 'bg-muted text-muted-foreground' }
    if (diffMinutes >= -15 && diffMinutes <= 120) return { text: 'Live Now', color: 'bg-red-500 text-white animate-pulse' }
    if (diffMinutes <= 60) return { text: 'Starting Soon', color: 'bg-yellow-500 text-white' }
    return { text: 'Upcoming', color: 'bg-primary text-primary-foreground' }
  }

  const handleJoinClass = async (liveClass: LiveClass) => {
    setSelectedClass(liveClass)
    
    // Record attendance
    try {
      await fetch('/api/lessons/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          live_class_id: liveClass.id,
          joined_at: new Date().toISOString()
        })
      })
      setJoinedClasses(new Set([...joinedClasses, liveClass.id]))
    } catch (err) {
      console.error('Failed to record attendance:', err)
    }
  }

  const upcomingCount = classes.filter((c) => new Date(c.scheduled_at) > new Date()).length
  const pastCount = classes.filter((c) => new Date(c.scheduled_at) <= new Date()).length

  // Extract meet URL or YouTube embed URL
  const formatYoutubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
      // Support youtu.be short link
      if (parsed.hostname.includes('youtu.be')) {
        const id = parsed.pathname.slice(1)
        if (id) return `https://www.youtube.com/embed/${id}`
      }
    } catch (err) {
      return ''
    }
    return ''
  }

  const getMeetUrl = (liveClass: LiveClass) => {
    return liveClass.google_meet_url || liveClass.meet_link
  }

  const getVideoUrl = (liveClass: LiveClass) => {
    if (!liveClass.youtube_url) return null
    const embedUrl = formatYoutubeEmbedUrl(liveClass.youtube_url)
    return embedUrl || liveClass.youtube_url
  }

  return (
    <div className="space-y-6">
      {/* Google Meet Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selectedClass.title}</h2>
                <p className="text-xs text-muted-foreground">{selectedClass.program_title}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-black">
              {getVideoUrl(selectedClass) || getMeetUrl(selectedClass) ? (
                <iframe
                  src={getVideoUrl(selectedClass) || getMeetUrl(selectedClass)}
                  className="w-full h-full border-0"
                  allow="camera;microphone;picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No Google Meet or YouTube link available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Lessons</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join live classes with your instructors</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            filter === 'upcoming'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            filter === 'past' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Past ({pastCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            filter === 'all' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          All
        </button>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-card rounded-lg border border-border animate-pulse"></div>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No {filter === 'all' ? '' : filter} live classes available</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((liveClass) => {
            const status = getStatusBadge(liveClass.scheduled_at)
            const classTime = new Date(liveClass.scheduled_at)
            const isLive = isLiveNow(liveClass.scheduled_at)

            return (
              <div key={liveClass.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  <Video className="h-16 w-16 text-primary/40" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    {status.text}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{liveClass.program_title}{liveClass.module_title ? ` · ${liveClass.module_title}` : ''}</p>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">{liveClass.title}</h3>
                    {liveClass.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{liveClass.description}</p>}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {classTime.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {isLive && (liveClass.google_meet_url || liveClass.meet_link) ? (
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleJoinClass(liveClass)}
                    >
                      <Video className="h-4 w-4 mr-2" /> Join Live Class
                    </Button>
                  ) : (liveClass.google_meet_url || liveClass.meet_link) && new Date(liveClass.scheduled_at) > new Date() ? (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled>
                      <Clock className="h-4 w-4 mr-2" /> Class Not Started
                    </Button>
                  ) : !(liveClass.google_meet_url || liveClass.meet_link) ? (
                    <Button className="w-full" variant="outline" disabled>
                      <AlertCircle className="h-4 w-4 mr-2" /> No Link Available
                    </Button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
