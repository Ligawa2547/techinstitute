'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Program {
  id: string
  title: string
  description: string
}

export default function AdmissionApplicationPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    program_id: '',
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('programs')
        .select('id, title, description')
        .eq('is_active', true)
        .order('title')

      if (error) throw error
      setPrograms(data || [])
    } catch (err) {
      console.error('Error fetching programs:', err)
      setError('Failed to load available programs')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const supabase = createClient()

      // Check if email already has a pending application
      const { data: existingApp } = await supabase
        .from('admission_applications')
        .select('id')
        .eq('email', formData.email)
        .eq('program_id', formData.program_id)
        .eq('status', 'pending')
        .maybeSingle()

      if (existingApp) {
        setError('You already have a pending application for this program')
        setSubmitting(false)
        return
      }

      // Submit application
      const { error: submitError } = await supabase
        .from('admission_applications')
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            program_id: formData.program_id,
            status: 'pending'
          },
        ])

      if (submitError) throw submitError

      // Send confirmation email
      await fetch('/api/admission/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.first_name} ${formData.last_name}`,
          programId: formData.program_id,
        }),
      })

      setSuccess(true)
      setFormData({ first_name: '', last_name: '', email: '', phone: '', program_id: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying. We've sent a confirmation email. Our team will review your application and contact you within 3-5 business days.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="mx-auto max-w-2xl px-6">
          <Link href="/" className="flex items-center gap-2 mb-4 w-fit hover:opacity-80">
            <Image src="/logo.png" alt="Ratego" width={40} height={40} className="rounded-lg" />
            <span className="font-bold">Ratego</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Apply to Ratego</h1>
          <p className="mt-2 text-primary-foreground/90">Start your skill-based learning journey today</p>
        </div>
      </div>

      {/* Application Form */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Names */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium">First Name *</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-sm font-medium">Last Name *</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Row 2: Email and Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Program Selection */}
            <div>
              <Label htmlFor="program" className="text-sm font-medium">Select Course *</Label>
              <select
                id="program"
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                required
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Choose a course...</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>

            {/* Already a student? */}
            <p className="text-sm text-muted-foreground text-center">
              Already a student?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </form>
        </div>

        {/* Course List Preview */}
        {programs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Courses</h2>
            <div className="grid gap-4">
              {programs.map((program) => (
                <div key={program.id} className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                  <h3 className="font-semibold text-foreground">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
