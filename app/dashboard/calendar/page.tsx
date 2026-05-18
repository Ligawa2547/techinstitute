'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Video, AlertCircle } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  event_type: string
  start_time: string
  end_time: string
  location_or_link: string
  program_id: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'term' | 'session'>('month')

  const getRange = (base: Date) => {
    if (viewMode === 'term') {
      const termStart = new Date(base.getFullYear(), Math.floor(base.getMonth() / 3) * 3, 1)
      return {
        start: termStart,
        end: new Date(termStart.getFullYear(), termStart.getMonth() + 3, 1),
      }
    }

    if (viewMode === 'session') {
      const sessionStart = new Date(base.getFullYear(), 0, 1)
      return {
        start: sessionStart,
        end: new Date(sessionStart.getFullYear() + 1, 0, 1),
      }
    }

    // month
    return {
      start: new Date(base.getFullYear(), base.getMonth(), 1),
      end: new Date(base.getFullYear(), base.getMonth() + 1, 1),
    }
  }

  const getGoogleCalendarUrl = (event: CalendarEvent) => {
    const start = new Date(event.start_time)
    const end = event.end_time ? new Date(event.end_time) : new Date(new Date(event.start_time).getTime() + 60 * 60 * 1000)
    const formatDt = (d: Date) => d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(event.description || '')
    const location = encodeURIComponent(event.location_or_link || '')

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDt(start)}/${formatDt(end)}&details=${details}&location=${location}&sprop=&sprop=name:`
  }

  useEffect(() => {
    fetchEvents()
  }, [selectedMonth])

  async function fetchEvents() {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get user's enrolled programs first
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('program_id')
        .eq('status', 'active')

      if (!enrollments || enrollments.length === 0) {
        setEvents([])
        return
      }

      const programIds = enrollments.map((e) => e.program_id)
      const range = getRange(selectedMonth)

      // Get calendar events for enrolled programs
      const { data: calendarData, error: calendarError } = await supabase
        .from('calendar_events')
        .select('*')
        .in('program_id', programIds)
        .gte('start_time', range.start.toISOString())
        .lt('start_time', range.end.toISOString())
        .order('start_time', { ascending: true })

      if (calendarError) throw calendarError

      // Also include scheduled live classes
      const { data: liveClassesData, error: liveError } = await supabase
        .from('live_classes')
        .select('id, title, description, scheduled_at, meet_link, youtube_url, program_id, programs(title), modules(title)')
        .in('program_id', programIds)
        .gte('scheduled_at', range.start.toISOString())
        .lt('scheduled_at', range.end.toISOString())
        .eq('is_active', true)
        .order('scheduled_at', { ascending: true })

      if (liveError) throw liveError

      const liveEvents = (liveClassesData || []).map((item: any) => ({
        id: item.id,
        title: `${item.title} (${item.programs?.title || 'Program'})`,
        description: item.description || '',
        start_time: item.scheduled_at,
        end_time: new Date(new Date(item.scheduled_at).getTime() + 60 * 60 * 1000).toISOString(),
        location_or_link: item.youtube_url || item.meet_link || '',
        program_id: item.program_id,
        event_type: 'live_class',
        google_link: item.youtube_url || item.meet_link || '',
        module_title: item.modules?.title,
      }))

      const composedEvents = [
        ...(calendarData || []).map((ev: any) => ({ ...ev, event_type: ev.event_type || 'calendar' })),
        ...liveEvents,
      ]

      setEvents(composedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysArray = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1)
  const firstDayOffset = getFirstDayOfMonth(selectedMonth)
  const previousDays = Array.from({ length: firstDayOffset }, (_, i) => null)

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toDateString()
    return events.filter((e) => new Date(e.start_time).toDateString() === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear()
    )
  }

  const nextMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  const prevMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))

  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">View your live classes and important dates</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Next
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {previousDays.map((_, i) => (
              <div key={`prev-${i}`} className="h-24 bg-muted/30 rounded"></div>
            ))}
            {daysArray.map((day) => {
              const dayEvents = getEventsForDay(day)
              const today = isToday(day)
              return (
                <div
                  key={day}
                  className={`h-24 rounded border p-1 cursor-pointer transition-colors ${
                    today
                      ? 'border-primary bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-card hover:bg-accent/5'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 ${today ? 'text-primary' : 'text-foreground'}`}>
                    {day}
                    {today && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                  </div>
                  {dayEvents.length > 0 ? (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded truncate">
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">-</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Upcoming Events</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 10).map((event) => (
                <div key={event.id} className="border-l-2 border-primary pl-3 py-2">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {event.event_type === 'live_class' && event.location_or_link && (
                    <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                      <a href={event.location_or_link} target="_blank" rel="noopener noreferrer">
                        <Video className="h-3 w-3 mr-1" /> Join Class
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
