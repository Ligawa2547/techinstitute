'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    token: null,
    isAdmin: false,
  });

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get admin status from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          setState({
            user: session.user,
            loading: false,
            token: session.access_token,
            isAdmin: profile?.is_admin || false,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('[v0] Error initializing auth:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        setState({
          user: session.user,
          loading: false,
          token: session.access_token,
          isAdmin: profile?.is_admin || false,
        });
      } else {
        setState({
          user: null,
          loading: false,
          token: null,
          isAdmin: false,
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return state;
}
