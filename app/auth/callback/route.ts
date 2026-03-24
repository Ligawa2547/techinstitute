import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const program = searchParams.get('program')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  // Redirect to dashboard or program enrollment page
  const redirectUrl = program ? `/dashboard/programs/${program}` : '/dashboard'
  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
