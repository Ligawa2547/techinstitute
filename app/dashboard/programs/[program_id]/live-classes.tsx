'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Video, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  meet_link?: string;
  youtube_url?: string;
  is_active: boolean;
  module_id?: string;
  programs?: { title: string };
  modules?: { title: string };
  profiles: { full_name: string };
}

interface LiveClassesProps {
  programId: string;
}

export function LiveClasses({ programId }: LiveClassesProps) {
  const { user, token, loading: authLoading } = useAuth();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || authLoading) return;
    if (!user && !authLoading) {
      window.location.href = '/auth/login';
      return;
    }
    fetchLiveClasses();
  }, [programId, token, user, authLoading]);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/live-classes/list?program_id=${programId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch live classes');
      const { data } = await response.json();
      setLiveClasses(data || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (liveClassId: string) => {
    try {
      setJoiningId(liveClassId);
      const response = await fetch('/api/student/live-classes/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ live_class_id: liveClassId }),
      });

      if (!response.ok) throw new Error('Failed to join live class');
      const { data } = await response.json();

      if (data.meet_link) {
        window.open(data.meet_link, '_blank');
      }
    } catch (error) {
      console.error('Error joining live class:', error);
      alert('Failed to join live class. Please try again.');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading live classes...</div>;
  }

  if (liveClasses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No live classes scheduled for this program</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Live Classes</h2>
      <div className="grid gap-4">
        {liveClasses.map((liveClass) => {
          const scheduledDate = new Date(liveClass.scheduled_at);
          const isUpcoming = scheduledDate > new Date();

          return (
            <div key={liveClass.id} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{liveClass.title}</h3>
                    {isUpcoming && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
                  {liveClass.description && (
                    <p className="text-sm text-muted-foreground mb-3">{liveClass.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(scheduledDate, 'MMM dd, yyyy HH:mm')}
                    </span>
                    {liveClass.profiles?.full_name && (
                      <span>Instructor: {liveClass.profiles.full_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {liveClass.meet_link && (
                    <Button
                      onClick={() => handleJoinClass(liveClass.id)}
                      disabled={joiningId === liveClass.id}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Video className="h-4 w-4" />
                      {joiningId === liveClass.id ? 'Joining...' : 'Join via Meet'}
                    </Button>
                  )}
                  {liveClass.youtube_url && (
                    <Button
                      variant="outline"
                      asChild
                      className="gap-2 whitespace-nowrap"
                    >
                      <a href={liveClass.youtube_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> Watch on YouTube
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
