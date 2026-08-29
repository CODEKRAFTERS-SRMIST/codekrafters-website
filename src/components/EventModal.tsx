'use client';
import React, { useEffect, useState } from 'react';
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300); // match transition duration
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl bg-[#f9f7e5] border-4 border-[#0D0D0D] rounded-[2rem] p-6 sm:p-10 shadow-[10px_10px_0_#0D0D0D] flex flex-col md:flex-row gap-8 items-center transition-transform duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-black text-white rounded-full font-bold flex items-center justify-center hover:-translate-y-1 hover:shadow-[3px_3px_0_#F2A516] transition-all border-2 border-transparent z-10"
        >
          X
        </button>

        {event && (
          <>
            <div className="w-full md:w-1/2 flex justify-center items-center relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A516]/40 blur-2xl rounded-full -z-10 mix-blend-multiply"></div>
               <img 
                 src={event.image_url} 
                 alt={event.title} 
                 className="w-full max-h-[60vh] object-cover rounded-2xl border-4 border-[#0D0D0D] shadow-[6px_6px_0_#0D0D0D]"
               />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
               <div className="inline-block bg-[#0D0D0D] text-[#F2A516] text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full w-max mb-4 shadow-[3px_3px_0_#F2A516]">
                 {event.category}
               </div>
               <h2 className={`${russoOne.className} text-3xl sm:text-4xl md:text-5xl font-black text-[#0D0D0D] mb-6 uppercase leading-tight`}>
                 {event.title}
               </h2>
               <div className="text-[#333333] text-base sm:text-lg font-medium leading-relaxed max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                 {event.description ? (
                   <p className="whitespace-pre-wrap">{event.description}</p>
                 ) : (
                   <p className="italic opacity-60">No description provided for this event.</p>
                 )}
               </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0D0D0D;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
