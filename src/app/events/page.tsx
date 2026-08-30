'use client';

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import { Russo_One, Montserrat } from 'next/font/google';
import EventModal from "@/components/EventModal";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["800", "900"] });

function EventCard({ event, onClick }: { event: any, onClick: (event: any) => void }) {
  return (
    <div 
      className="relative group/card mx-3 sm:mx-4 md:mx-6 flex-shrink-0 cursor-pointer"
      onClick={() => onClick(event)}
    >
      <div className="ck-card bg-[#f9f7e5] border-4 border-[#0D0D0D] rounded-3xl overflow-hidden shadow-[6px_6px_0_#0D0D0D] transition-transform duration-300 group-hover/card:-translate-y-2 group-hover/card:shadow-[10px_10px_0_#F2A516] h-48 sm:h-56 md:h-64 lg:h-72 aspect-[4/3] flex items-center justify-center relative">
        
        {/* Placeholder Glow */}
        <div className="absolute top-0 w-3/4 h-1/2 bg-[#F2A516]/30 blur-2xl rounded-full mix-blend-multiply pointer-events-none" />

        <img
          src={event.image_url || "/placeholder.svg"}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-3">
          <span className={`${russoOne.className} text-white text-lg sm:text-xl md:text-2xl font-black text-center drop-shadow-md tracking-wider uppercase line-clamp-3`}>
            {event.title}
          </span>
          <div className="bg-[#F2A516] text-[#0D0D0D] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[2px_2px_0_#0D0D0D] transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
            Click to explore
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicEventRow({
  events,
  label,
  reverse = false,
  onEventClick
}: {
  events: any[];
  label: string;
  reverse?: boolean;
  onEventClick: (event: any) => void;
}) {
  // If no events, we can show a placeholder or hide the row
  if (events.length === 0) {
    return (
      <section className="w-full py-8 sm:py-12 flex flex-col items-center">
        <h3 className={`${russoOne.className} text-3xl sm:text-4xl text-[#0D0D0D] uppercase mb-8 tracking-widest`}>
          {label}
        </h3>
        <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] shadow-[6px_6px_0_#0D0D0D] rounded-2xl p-6 px-10 text-center">
          <p className="text-[#333333] font-bold text-lg">No events posted yet.</p>
        </div>
      </section>
    );
  }

  // Ensure we have enough items to fill a large screen
  let baseEvents = [...events];
  while (baseEvents.length < 10) {
    baseEvents = [...baseEvents, ...events];
  }
  // Duplicate exactly once more to create a seamless 50% loop
  const scrollSet = [...baseEvents, ...baseEvents];

  return (
    <section className="w-full overflow-hidden py-4 sm:py-6 relative">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className={`${russoOne.className} inline-block bg-[#0D0D0D] text-[#F2A516] px-8 py-3 rounded-full text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest shadow-[6px_6px_0_#F2A516] -rotate-1`}>
          {label}
        </h3>
      </div>

      <div className={`scroll-row ${reverse ? "reverse" : ""} group`}>
        {scrollSet.map((event, i) => (
          <EventCard key={`${event.id}-${i}`} event={event} onClick={onEventClick} />
        ))}
      </div>

      <style jsx>{`
        .scroll-row {
          display: flex;
          width: max-content;     
          animation: scrollX 30s linear infinite;
        }

        .scroll-row.reverse {
          animation-direction: reverse;
        }

        .scroll-row:hover {
          animation-play-state: paused;
        }
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/admin/events');
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const clubEvents = events.filter(e => e.category === 'Club Events');
  const hackathons = events.filter(e => e.category === 'Hackathons');
  const chennaiEvents = events.filter(e => e.category === 'Events around Chennai');

  return (
    <div className="min-h-screen bg-[#FFEFB4] overflow-x-hidden flex flex-col relative z-0">
      <Navbar />

      {/* Paper Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 opacity-10"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
      ></div>

      <main className="flex-grow pt-32 pb-20">
        <div className="text-center px-4 mb-10">
           <h1 className={`${russoOne.className} text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight`}>
             <span className="text-[#0D0D0D]">ALL </span>
             <span className="text-[#F2A516] drop-shadow-[4px_4px_0_#0D0D0D]">EVENTS</span>
           </h1>
           <p className={`${montserrat.className} mt-4 text-[#333333] font-bold max-w-2xl mx-auto text-sm sm:text-base`}>
             Explore the dynamic and tactile universe of CodeKrafters. Snap into the rhythm of our community!
           </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 min-h-[50vh] gap-6">
             <div className="relative w-20 h-20">
               {/* Background Track */}
               <div className="absolute inset-0 border-8 border-[#0D0D0D]/10 rounded-full"></div>
               {/* Spinning Ring */}
               <div className="absolute inset-0 border-8 border-transparent border-t-[#0D0D0D] border-r-[#F2A516] rounded-full animate-spin"></div>
             </div>
             <p className={`${russoOne.className} text-lg font-black uppercase text-[#0D0D0D]/60 tracking-widest animate-pulse`}>Loading Events</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-8">
            <DynamicEventRow 
              label="Club Events" 
              events={clubEvents} 
              onEventClick={setSelectedEvent} 
            />
            
            <DynamicEventRow 
              label="Hackathons" 
              events={hackathons} 
              reverse 
              onEventClick={setSelectedEvent} 
            />

            <DynamicEventRow 
              label="Events Around Chennai" 
              events={chennaiEvents} 
              onEventClick={setSelectedEvent} 
            />
          </div>
        )}
      </main>

      <Footer />

      <EventModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
      />
    </div>
  );
}
