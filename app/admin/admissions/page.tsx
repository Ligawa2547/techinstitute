'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Clock, Mail, User, Phone, BookOpen, Loader2 } from 'lucide-react'

interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  program_id: string
  status: 'pending' | 'approved' | 'rejected'
  submission_date: string
  programs?: { title: string }
}

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [filter])

  async function fetchApplications() {
    try {
      const supabase = createClient()
      let query = supabase
        .from('admission_applications')
        .select('*, programs(title)')
        .order('submission_date', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setApplications(data || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(appId: string, email: string, name: string, programTitle: string) {
    setProcessingId(appId)
    try {
      const supabase = createClient()

      // Update status
      const { error: updateError } = await supabase
        .from('admission_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', appId)

      if (updateError) throw updateError

      // Send approval email
      await fetch('/api/admission/send-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          programTitle,
          status: 'approved',
        }),
      })

      // Refresh applications
      fetchApplications()
      setSelectedApp(null)
    } catch (err) {
      console.error('Error approving application:', err)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(appId: string, email: string, name: string, programTitle: string) {
    setProcessingId(appId)
    try {
      const supabase = createClient()

      // Update status
      const { error: updateError } = await supabase
        .from('admission_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', appId)

      if (updateError) throw updateError

      // Send rejection email
      await fetch('/api/admission/send-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          programTitle,
          status: 'rejected',
        }),
      })

      // Refresh applications
      fetchApplications()
      setSelectedApp(null)
    } catch (err) {
      console.error('Error rejecting application:', err)
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Approved
          </div>
        )
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="h-4 w-4" />
            Rejected
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            Pending
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admission Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage student applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab)
              setLoading(true)
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No applications found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {app.first_name} {app.last_name}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {app.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {app.programs?.title}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(app.submission_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{selectedApp.first_name} {selectedApp.last_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium break-all">{selectedApp.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedApp.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{selectedApp.programs?.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(selectedApp.submission_date).toLocaleString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedApp.status === 'pending' && (
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    handleApprove(
                      selectedApp.id,
                      selectedApp.email,
                      `${selectedApp.first_name} ${selectedApp.last_name}`,
                      selectedApp.programs?.title || 'Unknown Course'
                    )
                  }
                  disabled={processingId === selectedApp.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {processingId === selectedApp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() =>
                    handleReject(
                      selectedApp.id,
                      selectedApp.email,
                      `${selectedApp.first_name} ${selectedApp.last_name}`,
                      selectedApp.programs?.title || 'Unknown Course'
                    )
                  }
                  disabled={processingId === selectedApp.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {processingId === selectedApp.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
