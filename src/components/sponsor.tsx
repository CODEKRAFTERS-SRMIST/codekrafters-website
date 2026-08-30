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
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let rafId: number;
    let isVisible = false;
    let paused = false;
    let pos = 0;
    let loopHeight = 0;
    const spd = 0.6; // px per frame

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    observer.observe(wrap);

    const onMouseEnter = () => { paused = true; };
    const onMouseLeave = () => { paused = false; };
    wrap.addEventListener('mouseenter', onMouseEnter);
    wrap.addEventListener('mouseleave', onMouseLeave);

    // Wait one frame for layout to settle, then read height once
    rafId = requestAnimationFrame(() => {
      loopHeight = track.offsetHeight / 3;
      // Reverse starts mid-way so it can animate upward
      if (reverse) pos = loopHeight;

      const animate = () => {
        if (isVisible && !paused) {
          pos += reverse ? -spd : spd;
          if (!reverse && pos >= loopHeight) pos -= loopHeight;
          if (reverse && pos <= 0) pos += loopHeight;
          track.style.transform = `translateY(-${pos}px)`;
        }
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      wrap.removeEventListener('mouseenter', onMouseEnter);
      wrap.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reverse]);

  return (
    <div ref={wrapRef} className="flex-1 relative overflow-hidden" style={{ height: "700px" }}>
      <div ref={trackRef} className="flex flex-col h-max" style={{ willChange: 'transform' }}>
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let rafId: number;
    let isVisible = false;
    let paused = false;
    let pos = 0;
    let loopWidth = 0;
    const spd = 0.6;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    observer.observe(wrap);

    const onTouchStart = () => { paused = true; };
    const onTouchEnd = () => { paused = false; };
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });

    rafId = requestAnimationFrame(() => {
      loopWidth = track.offsetWidth / 3;
      if (reverse) pos = loopWidth;

      const animate = () => {
        if (isVisible && !paused) {
          pos += reverse ? -spd : spd;
          if (!reverse && pos >= loopWidth) pos -= loopWidth;
          if (reverse && pos <= 0) pos += loopWidth;
          track.style.transform = `translateX(-${pos}px)`;
        }
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchend', onTouchEnd);
    };
  }, [reverse]);

  return (
    <div ref={wrapRef} className="w-full relative overflow-hidden">
      <div ref={trackRef} className="flex w-max" style={{ willChange: 'transform' }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={item.id + "-" + i} className="mx-3 flex-shrink-0">
            {renderItem(item)}
          </div>
        ))}
      </div>
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
