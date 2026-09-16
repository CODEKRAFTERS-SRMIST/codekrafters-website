'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Russo_One, Montserrat } from 'next/font/google';
import { LoginCard } from "@/components/join/LoginCard";
import { UserSession } from "@/types/join";
import { ArrowLeft } from "lucide-react";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["800", "900"] });

export default function AdminEventsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<UserSession | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Club Events',
    description: '',
    image: null as File | null,
    existingImageUrl: '',
  });

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          const parsed: UserSession = data.user;
          if (parsed.role === 'PRESIDENT' || parsed.role === 'VICE_PRESIDENT' || parsed.role === 'DOMAIN_ADMIN') {
            setSession(parsed);
            fetchEvents();
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    window.location.href = "/admin/events";
  };

  const handleLogout = async () => {
    setSession(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    window.dispatchEvent(new Event("auth_change"));
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/admin/events`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/events`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchEvents();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      category: event.category,
      description: event.description || '',
      image: null,
      existingImageUrl: event.image_url,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!formData.image && !formData.existingImageUrl) || !formData.title || !formData.category) {
      alert("Please fill all required fields and ensure an image is selected.");
      return;
    }

    setIsUploading(true);
    
    try {
      let imageUrl = formData.existingImageUrl;

      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${formData.category.replace(/\s+/g, '-').toLowerCase()}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, formData.image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const method = editingId ? 'PUT' : 'POST';
      const body = {
        id: editingId,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
      };

      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setFormData({ title: '', category: 'Club Events', description: '', image: null, existingImageUrl: '' });
        setEditingId(null);
        fetchEvents();
      } else {
        const errorData = await res.json();
        alert(`Failed to save event: ${errorData.error}`);
      }
      
    } catch (error: any) {
      console.error('Upload Error:', error);
      alert(`Error saving event: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFEFB4] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
      </div>
    );
  }

  if (!session || (session.role !== 'PRESIDENT' && session.role !== 'VICE_PRESIDENT' && session.role !== 'DOMAIN_ADMIN')) {
    return (
      <div className="min-h-screen bg-[#FFEFB4] overflow-x-hidden flex flex-col justify-center items-center p-4">
         <div className="w-full max-w-7xl">
           <LoginCard onLoginSuccess={handleLoginSuccess} />
         </div>
      </div>
    );
  }

  const domainNorm = (session.domain_id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const canCreate = session.role === 'PRESIDENT' || session.role === 'VICE_PRESIDENT' || (session.role === 'DOMAIN_ADMIN' && ['content', 'creatives', 'prmanagement'].includes(domainNorm));

  return (
    <div className="min-h-screen bg-[#FFEFB4] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {/* Back to Profile */}
            <button
              onClick={() => (window.location.href = "/profile")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0D0D] text-[#FFEFB4] text-xs font-black uppercase tracking-wider border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] hover:text-[#F2A516] hover:translate-y-[-1px] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Profile
            </button>
            <div>
              <h1 className={`${russoOne.className} text-4xl font-black text-[#0D0D0D]`}>Events Admin Portal</h1>
              <p className="text-[#333333] font-bold mt-2">
                Role: <span className="bg-[#0D0D0D] text-[#FFEFB4] px-2 py-0.5 rounded text-xs">{session.role}</span>
                {session.domain_id && <span className="ml-2 bg-[#F2A516] text-[#0D0D0D] px-2 py-0.5 rounded text-xs">{session.domain_id}</span>}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:-translate-y-1 transition-transform">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Event Form */}
          {canCreate ? (
            <div className="md:col-span-1 ck-card bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[6px_6px_0_#0D0D0D] h-fit text-[#0D0D0D]">
              <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
              <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg bg-white text-black font-medium"
                    style={{ colorScheme: "light", color: "#000000" }}
                  >
                    <option value="Club Events" className="text-black bg-white">Club Events</option>
                    <option value="Hackathons" className="text-black bg-white">Hackathons</option>
                    <option value="Events around Chennai" className="text-black bg-white">Events around Chennai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg bg-white text-black font-medium"
                    style={{ colorScheme: "light", color: "#000000" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Image</label>
                  <div 
                    className={`w-full border-2 border-dashed border-[#0D0D0D] p-6 rounded-lg bg-white text-center cursor-pointer transition-colors ${dragActive ? 'bg-[#FFEFB4]' : 'hover:bg-gray-50'}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setFormData({...formData, image: e.dataTransfer.files[0]});
                      }
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <p className="text-sm font-bold text-[#333333]">
                      {formData.image 
                        ? formData.image.name 
                        : formData.existingImageUrl
                          ? 'Image already uploaded. Drag and drop to replace'
                          : 'Drag and drop an image, or click to browse'}
                    </p>
                    <input 
                      id="file-upload"
                      type="file" 
                      accept="image/*"
                      onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})}
                      className="hidden"
                      required={!formData.image && !formData.existingImageUrl}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Description (shown on click)</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg bg-white text-black font-medium"
                    style={{ colorScheme: "light", color: "#000000" }}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-[#F2A516] text-[#0D0D0D] font-bold py-3 border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] rounded-full hover:-translate-y-1 transition-all disabled:opacity-50"
                  >
                    {isUploading ? 'Saving...' : (editingId ? 'Update Event' : 'Add Event')}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', category: 'Club Events', description: '', image: null, existingImageUrl: '' });
                      }}
                      className="bg-gray-300 text-[#0D0D0D] font-bold py-3 px-6 border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] rounded-full hover:-translate-y-1 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="md:col-span-1 ck-card bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[6px_6px_0_#0D0D0D] h-fit text-[#0D0D0D]">
              <h2 className="text-xl font-bold mb-4 text-gray-500">Event Creation Disabled</h2>
              <p className="font-bold text-sm">Only Content, Creatives, and PR Management domains can create events.</p>
            </div>
          )}

          {/* Events List */}
          <div className="md:col-span-2 space-y-6 text-[#0D0D0D]">
            <h2 className="text-2xl font-bold mb-4">Current Events</h2>
            {events.length === 0 ? (
              <p className="text-[#333333]">No events found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map(event => (
                  <div key={event.id} className="bg-white border-2 border-[#0D0D0D] rounded-xl p-4 flex gap-4 shadow-[4px_4px_0_#0D0D0D]">
                    <img src={event.image_url} alt={event.title} className="w-24 h-24 object-cover rounded-lg border-2 border-[#0D0D0D]" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[#F2A516] uppercase bg-black px-2 py-1 rounded-md">{event.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border border-[#0D0D0D] ${
                          event.status === 'APPROVED' ? 'bg-green-200' : event.status === 'REJECTED' ? 'bg-red-200' : 'bg-yellow-200'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-bold mt-2 text-lg leading-tight">{event.title}</h3>
                      <div className="mt-2 flex gap-3 flex-wrap">
                        {canCreate && (
                          <>
                            <button 
                              onClick={() => handleEdit(event)}
                              className="text-sm text-blue-600 font-bold hover:underline"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(event.id)}
                              className="text-sm text-red-500 font-bold hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {(session.role === 'PRESIDENT' || session.role === 'VICE_PRESIDENT') && event.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(event.id, 'APPROVED')}
                              className="text-sm text-green-600 font-bold hover:underline ml-auto"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(event.id, 'REJECTED')}
                              className="text-sm text-red-600 font-bold hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
