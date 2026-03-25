'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Send, Trash2, Plus } from 'lucide-react'

interface Notification {
  id: string
  recipient_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  recipient_name?: string
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [students, setStudents] = useState<any[]>([])

  const [formData, setFormData] = useState({
    recipient_id: '',
    title: '',
    message: '',
    type: 'info',
  })

  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchStudents()
  }, [])

  async function fetchNotifications() {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error: err } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (err) throw err
      setNotifications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  async function fetchStudents() {
    try {
      const supabase = createClient()

      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, full_name, is_admin')
        .eq('is_admin', false)

      if (err) throw err
      setStudents(data || [])
    } catch (err) {
      console.error('Failed to load students:', err)
    }
  }

  async function sendNotification(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.recipient_id || !formData.title || !formData.message) return

    try {
      setSending(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: formData.recipient_id,
          sender_id: user?.id,
          title: formData.title,
          message: formData.message,
          type: formData.type,
        })

      if (error) throw error

      setFormData({ recipient_id: '', title: '', message: '', type: 'info' })
      setShowForm(false)
      await fetchNotifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  async function deleteNotification(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Send alerts and messages to students</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" /> Send Notification
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Send Notification Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Send New Notification</h3>
          <form onSubmit={sendNotification} className="space-y-4">
            <div>
              <Label htmlFor="recipient" className="text-sm font-medium">
                Select Student
              </Label>
              <select
                id="recipient"
                value={formData.recipient_id}
                onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name || student.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium">
                Notification Type
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="info">Information</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Notification title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                Message
              </Label>
              <textarea
                id="message"
                placeholder="Enter your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Recent Notifications</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications sent yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{notif.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notif.type)}`}>
                      {notif.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNotification(notif.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
