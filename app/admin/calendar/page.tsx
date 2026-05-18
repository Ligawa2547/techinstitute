'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, AlertCircle, Edit2, Trash2 } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  event_type: string
  start_time: string
  end_time: string
  location_or_link: string
  program_id: string
  created_by: string
  program_title?: string
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [programs, setPrograms] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'class',
    program_id: '',
    start_time: '',
    end_time: '',
    location_or_link: '',
  })

  useEffect(() => {
    fetchData()
  }, [selectedMonth])

  async function fetchData() {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get all programs
      const { data: progData } = await supabase
        .from('programs')
        .select('id, title')

      setPrograms(progData || [])

      // Get calendar events
      const { data: eventData, error: err } = await supabase
        .from('calendar_events')
        .select(`
          *,
          programs:program_id(title)
        `)
        .gte('start_time', new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString())
        .lt('start_time', new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1).toISOString())
        .order('start_time', { ascending: true })

      if (err) throw err

      const formattedEvents = eventData?.map((item: any) => ({
        ...item,
        program_title: item.programs?.title || 'Unknown Program',
      })) || []

      setEvents(formattedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar')
    } finally {
      setLoading(false)
    }
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (!formData.title || !formData.program_id || !formData.start_time || !formData.end_time) {
        setError('Please fill in all required fields')
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Not authenticated')
        return
      }

      const { data, error: err } = await supabase
        .from('calendar_events')
        .insert({
          title: formData.title,
          description: formData.description || null,
          event_type: formData.event_type,
          program_id: formData.program_id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          location_or_link: formData.location_or_link || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (err) throw err

      setFormData({
        title: '',
        description: '',
        event_type: 'class',
        program_id: '',
        start_time: '',
        end_time: '',
        location_or_link: '',
      })
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    }
  }

  async function deleteEvent(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
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

  const nextMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  const prevMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))

  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Schedule and manage all events and live classes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Create Event
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="rounded-lg bg-card border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
          <form onSubmit={createEvent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Type *</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="class">Class</option>
                  <option value="exam">Exam</option>
                  <option value="deadline">Deadline</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Program *</label>
              <select
                required
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a program</option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="Event description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location or Link</label>
              <input
                type="text"
                value={formData.location_or_link}
                onChange={(e) => setFormData({ ...formData, location_or_link: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="Room number or meeting link"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Event
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
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
              return (
                <div
                  key={day}
                  className="h-24 rounded border border-border p-1 bg-card hover:bg-accent/5 cursor-pointer transition-colors"
                >
                  <div className="text-xs font-semibold text-foreground mb-1">{day}</div>
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

        {/* All Events */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">All Events</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="border-l-2 border-primary pl-3 py-2">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.program_title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-destructive"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
