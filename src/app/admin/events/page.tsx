'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Russo_One, Montserrat } from 'next/font/google';
import { LoginCard } from "@/components/join/LoginCard";
import { UserSession } from "@/types/join";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["800", "900"] });

export default function AdminEventsPage() {
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
    try {
      const rawSession = localStorage.getItem("codekrafters_user_session");
      if (rawSession) {
        const parsed: UserSession = JSON.parse(rawSession);
        if (parsed.role === 'ADMIN') {
          setSession(parsed);
          fetchEvents();
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    try {
      localStorage.setItem("codekrafters_user_session", JSON.stringify(newSession));
    } catch (e) {}

    // Redirect all users (including admins) to homepage after login
    window.location.href = "/";
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem("codekrafters_user_session");
    } catch (e) {}
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
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
        // 1. Upload Image to Supabase Storage
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

      // 2. Save/Update Event to DB
      const method = editingId ? 'PUT' : 'POST';
      const body = {
        id: editingId,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl
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

  if (!session || session.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#FFEFB4] overflow-x-hidden flex flex-col justify-center items-center p-4">
         <div className="w-full max-w-7xl">
           <LoginCard onLoginSuccess={handleLoginSuccess} />
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFEFB4] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${russoOne.className} text-4xl font-black text-[#0D0D0D]`}>Events Admin Portal</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:-translate-y-1 transition-transform">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Event Form */}
          <div className="md:col-span-1 ck-card bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[6px_6px_0_#0D0D0D] h-fit text-[#0D0D0D]">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg bg-white"
                >
                  <option value="Club Events">Club Events</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Events around Chennai">Events around Chennai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg"
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
                  className="w-full border-2 border-[#0D0D0D] p-2 rounded-lg"
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
                      <span className="text-xs font-bold text-[#F2A516] uppercase bg-black px-2 py-1 rounded-md">{event.category}</span>
                      <h3 className="font-bold mt-2 text-lg leading-tight">{event.title}</h3>
                      <div className="mt-2 flex gap-3">
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
