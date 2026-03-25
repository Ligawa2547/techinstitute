import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtime(channel: string) {
  useEffect(() => {
    const supabase = createClient()
    
    const subscription = supabase.channel(channel)
      .on('postgres_changes', { event: '*', schema: 'public', table: channel }, (payload) => {
        console.log('[Realtime]', channel, payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [channel])

  const supabase = createClient()
  return supabase.channel(channel)
}
