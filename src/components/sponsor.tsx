"use client";

import Image from "next/image";
import React, { useMemo, useRef, useEffect } from "react";

interface CompanyLogo {
  id: number;
  name: string;
  imageUrl: string;
  alt: string;
}

// ---------------------------
// DESKTOP INFINITE SCROLL COL
// ---------------------------
function InfiniteScrollCol({ items, renderItem, reverse = false }: { items: CompanyLogo[], renderItem: (c: CompanyLogo) => React.ReactNode, reverse?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let rafId: number;
    let speed = reverse ? -1 : 1;

    // Start reverse columns in the middle so they can scroll up
    if (reverse) {
      el.scrollTop = el.scrollHeight / 3;
    }

    const animate = () => {
      const contentHeight = el.scrollHeight / 3;
      if (el.scrollTop >= contentHeight * 2) {
        el.scrollTop -= contentHeight;
      } else if (el.scrollTop <= 0) {
        el.scrollTop += contentHeight;
      }
      el.scrollTop += speed;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };
    
    // allow pausing on hover
    const onMouseEnter = () => speed = 0;
    const onMouseLeave = () => speed = reverse ? -1 : 1;

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reverse]);

  return (
    <div ref={scrollRef} className="flex-1 relative overflow-hidden" style={{ height: "700px" }}>
      <div className="flex flex-col">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={item.id + "-" + i} className="mb-6">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------
// MOBILE INFINITE SCROLL ROW
// ---------------------------
function InfiniteScrollRow({ items, renderItem, reverse = false }: { items: CompanyLogo[], renderItem: (c: CompanyLogo) => React.ReactNode, reverse?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let rafId: number;
    let speed = reverse ? -1 : 1;

    if (reverse) {
      el.scrollLeft = el.scrollWidth / 3;
    }

    const animate = () => {
      const contentWidth = el.scrollWidth / 3;
      if (el.scrollLeft >= contentWidth * 2) {
        el.scrollLeft -= contentWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += contentWidth;
      }
      el.scrollLeft += speed;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onWheel = (e: WheelEvent) => {
      // Only capture wheel if scrolling predominantly horizontally or if user wants to scroll it
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
      } else {
        // Also allow vertical scroll to push it horizontally for easier mobile access? 
        // Actually, on mobile, touch will trigger scroll events, but native touch dragging is better.
        // We can just let native touch events handle it by setting overflow-x-auto and hiding scrollbar.
      }
    };
    
    const onTouchStart = () => speed = 0;
    const onTouchEnd = () => speed = reverse ? -1 : 1;

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [reverse]);

  return (
    <div ref={scrollRef} className="w-full relative overflow-x-auto scrollbar-hide flex">
      {[...items, ...items, ...items].map((item, i) => (
        <div key={item.id + "-" + i} className="mx-3 flex-shrink-0">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

const SponsorsComponent: React.FC = () => {
  const companies = useMemo<CompanyLogo[]>(
    () => [
      { id: 1, name: "Coinex", imageUrl: "/sponsor/coin.png", alt: "Coinex Logo" },
      { id: 2, name: "Devfolio", imageUrl: "/sponsor/devfolios.png", alt: "Devfolio Logo" },
      { id: 3, name: "Edu Chain", imageUrl: "/sponsor/educhains.png", alt: "Edu Chain Logo" },
      { id: 4, name: "ETHIndia", imageUrl: "/sponsor/ethin.png", alt: "ETHIndia Logo" },
      { id: 5, name: "Kana Labs", imageUrl: "/sponsor/kanas.png", alt: "Kana Labs Logo" },
      { id: 6, name: "Kanini", imageUrl: "/sponsor/kaninis.png", alt: "Kanini Logo" },
      { id: 7, name: "Polygon", imageUrl: "/sponsor/polygons.png", alt: "Polygon Logo" },
      { id: 8, name: "Qoneqt", imageUrl: "/sponsor/q.png", alt: "Qoneqt Logo" },
      { id: 9, name: "Aptos", imageUrl: "/sponsor/aptoss.png", alt: "Aptos Logo" },
      { id: 10, name: "ICP", imageUrl: "/sponsor/icpss.png", alt: "ICP Logo" },
      { id: 11, name: "Risein", imageUrl: "/sponsor/riseins.png", alt: "Risein Logo" },
      { id: 12, name: "PNB Metlife", imageUrl: "/sponsor/pnb.png", alt: "PNB Metlife Logo" },
    ],
    []
  );

  const column1 = companies.slice(0, 4);
  const column2 = companies.slice(4, 8);
  const column3 = companies.slice(8, 12);

  const renderLogoCard = (company: CompanyLogo) => (
    <div
      className="sponsor-card flex-shrink-0 bg-white/90 rounded-2xl overflow-hidden border-2 border-gray-800/20 group relative"
      style={{
        width: "clamp(140px, 42vw, 320px)",
        height: "clamp(100px, 30vw, 240px)",
        background: "linear-gradient(135deg, #FFEFB3 0%, #FFDA4D 100%)",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4">
        <Image
          src={company.imageUrl}
          alt={company.alt}
          fill
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 220px, 320px"
          className="object-contain p-2 sm:p-4 md:p-8 drop-shadow-lg"
        />
      </div>

      <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center pb-8 pointer-events-none">
        <span className="text-white text-2xl font-bold tracking-wider">
          {company.name}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center justify-center relative py-20"
      style={{ backgroundColor: "#FFEFB3" }}
    >
      <div className="text-center mb-16 px-4 z-10">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="text-[#0b1220]">LOVED BY</span>{" "}
          <span className="text-[#F2B200]">SPONSORS</span>
        </h2>
        <p className="text-[#0b1220]/70 text-sm md:text-base max-w-2xl mx-auto tracking-wide">
          Creators worldwide trust our community for their innovation needs
        </p>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block w-full overflow-hidden relative">
        <div className="flex gap-3 px-6 max-w-[1100px] mx-auto">
          <InfiniteScrollCol items={column1} renderItem={renderLogoCard} />
          <InfiniteScrollCol items={column2} renderItem={renderLogoCard} reverse />
          <InfiniteScrollCol items={column3} renderItem={renderLogoCard} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FFEFB4] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FFEFB4] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* MOBILE */}
      <div className="block md:hidden w-full overflow-hidden relative mt-8 space-y-6">
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#FFEFB4] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#FFEFB4] to-transparent pointer-events-none z-10" />

        <InfiniteScrollRow items={column1} renderItem={renderLogoCard} />
        <InfiniteScrollRow items={column2} renderItem={renderLogoCard} reverse />
        <InfiniteScrollRow items={column3} renderItem={renderLogoCard} />
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .sponsor-card {
            width: 140px !important;
            height: 100px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SponsorsComponent;
