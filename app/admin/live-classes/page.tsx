'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Calendar, Users, Video, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  program_id: string;
  scheduled_at: string;
  meet_link: string;
  is_active: boolean;
  module_id?: string;
  programs: { title: string };
  modules?: { title: string };
  youtube_url?: string;
}

export default function LiveClassesPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [programs, setPrograms] = useState<{ id: string; title: string }[]>([]);
  const [modules, setModules] = useState<{ id: string; title: string; program_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    program_id: '',
    module_id: '',
    scheduled_at: '',
    meet_link: '',
    youtube_url: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const initData = async () => {
      await Promise.all([fetchProgramsAndModules(), fetchLiveClasses()]);
    };

    initData();
  }, [user, authLoading, router]);

  const fetchProgramsAndModules = async () => {
    try {
      const [programResp, moduleResp] = await Promise.all([
        fetch('/api/admin/programs/list'),
        fetch('/api/admin/modules/list'),
      ])

      if (!programResp.ok || !moduleResp.ok) {
        throw new Error('Failed to load programs/modules')
      }

      const programJson = await programResp.json()
      const moduleJson = await moduleResp.json()

      setPrograms(programJson.data || [])
      setModules(moduleJson.data || [])
    } catch (error) {
      console.error('Error fetching programs/modules:', error)
      setPrograms([])
      setModules([])
    }
  };

  const fetchLiveClasses = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/live-classes/list', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? '/api/admin/live-classes/update'
        : '/api/admin/live-classes/create';
      
      const payload = editingId
        ? { ...formData, id: editingId }
        : formData;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          module_id: formData.module_id || null,
          youtube_url: formData.youtube_url || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to save live class');
      
      setFormData({
        title: '',
        description: '',
        program_id: '',
        module_id: '',
        scheduled_at: '',
        meet_link: '',
        youtube_url: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchLiveClasses();
    } catch (error) {
      console.error('Error saving live class:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;
    
    try {
      const response = await fetch('/api/admin/live-classes/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete live class');
      fetchLiveClasses();
    } catch (error) {
      console.error('Error deleting live class:', error);
    }
  };

  const handleEdit = (liveClass: LiveClass) => {
    setEditingId(liveClass.id);
    setFormData({
      title: liveClass.title,
      description: liveClass.description || '',
      program_id: liveClass.program_id,
      module_id: liveClass.module_id || '',
      scheduled_at: liveClass.scheduled_at.slice(0, 16),
      meet_link: liveClass.meet_link || '',
      youtube_url: liveClass.youtube_url || '',
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Live Classes</h1>
          <p className="text-muted-foreground">Schedule and manage live classes for your programs</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', description: '', program_id: '', scheduled_at: '', meet_link: '' }); }} className="gap-2">
          <Plus className="h-4 w-4" />
          New Live Class
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">{editingId ? 'Edit' : 'Create'} Live Class</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="e.g., Week 1 Live Session"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="Brief description of the live class"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program *</label>
              <select
                required
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value, module_id: '' })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Module/Topic *</label>
              <select
                required
                value={formData.module_id}
                onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                disabled={!formData.program_id}
              >
                <option value="">Select a module/topic</option>
                {modules
                  .filter((module) => module.program_id === formData.program_id)
                  .map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Google Meet Link</label>
              <input
                type="url"
                value={formData.meet_link}
                onChange={(e) => setFormData({ ...formData, meet_link: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="default">
                {editingId ? 'Update' : 'Create'} Live Class
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p className="text-muted-foreground">Loading live classes...</p>
        ) : liveClasses.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No live classes scheduled yet</p>
          </div>
        ) : (
          liveClasses.map((liveClass) => (
            <div key={liveClass.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{liveClass.title}</h3>
                  {liveClass.description && (
                    <p className="text-sm text-muted-foreground mt-1">{liveClass.description}</p>
                  )}
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(liveClass.scheduled_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {liveClass.programs?.title}
                    </span>
                    {liveClass.modules?.title && (
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        {liveClass.modules.title}
                      </span>
                    )}
                  </div>
                  {(liveClass.meet_link || liveClass.youtube_url) && (
                    <div className="mt-2 space-y-1">
                      {liveClass.meet_link && (
                        <a href={liveClass.meet_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                          Google Meet Link
                        </a>
                      )}
                      {liveClass.youtube_url && (
                        <a href={liveClass.youtube_url} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline block">
                          YouTube Video Link
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(liveClass)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(liveClass.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
