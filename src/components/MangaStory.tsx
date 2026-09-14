"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageKitUrl } from "@/lib/imagekit";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BubbleData {
  id: string;
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
}

interface MangaPageData {
  pageNumber: number;
  baseImage: string;
  bubbles: BubbleData[];
}

const MANGA_TRANSFORM = "tr=f-auto,q-80";

const MANGA_PAGES: MangaPageData[] = [
  {
    pageNumber: 1,
    baseImage: getImageKitUrl("/manga_art/manga_page1.png", MANGA_TRANSFORM),
    bubbles: [
      {
        id: "p1-b1",
        src: getImageKitUrl("/manga_art/cutouts/page1_box1.png", MANGA_TRANSFORM),
        alt: "Who leaves a USB lying around?",
        left: "28.44%",
        top: "10.56%",
        width: "16.72%",
      },
      {
        id: "p1-b2",
        src: getImageKitUrl("/manga_art/cutouts/page1_box2.png", MANGA_TRANSFORM),
        alt: "Okay...",
        left: "16.41%",
        top: "60.42%",
        width: "8.75%",
      },
    ],
  },
  {
    pageNumber: 2,
    baseImage: getImageKitUrl("/manga_art/manga_page2.png", MANGA_TRANSFORM),
    bubbles: [
      {
        id: "p2-b1",
        src: getImageKitUrl("/manga_art/cutouts/page2_box1.png", MANGA_TRANSFORM),
        alt: "Wait... this is actually so much",
        left: "61.25%",
        top: "10.83%",
        width: "9.77%",
      },
      {
        id: "p2-b2",
        src: getImageKitUrl("/manga_art/cutouts/page2_box2.png", MANGA_TRANSFORM),
        alt: "But where??",
        left: "87.73%",
        top: "16.39%",
        width: "9.77%",
      },
      {
        id: "p2-b3",
        src: getImageKitUrl("/manga_art/cutouts/page2_box3.png", MANGA_TRANSFORM),
        alt: "Hope!!! I've found them",
        left: "14.38%",
        top: "67.50%",
        width: "13.98%",
      },
    ],
  },
  {
    pageNumber: 3,
    baseImage: getImageKitUrl("/manga_art/manga_page3.png", MANGA_TRANSFORM),
    bubbles: [
      {
        id: "p3-b1",
        src: getImageKitUrl("/manga_art/cutouts/page3_box1.png", MANGA_TRANSFORM),
        alt: "So, you guys just... learn stuff??",
        left: "11.88%",
        top: "3.89%",
        width: "9.69%",
      },
      {
        id: "p3-b2",
        src: getImageKitUrl("/manga_art/cutouts/page3_box2.png", MANGA_TRANSFORM),
        alt: "Nah.. we build projects, get internships, attend workshop and make friends",
        left: "58.67%",
        top: "2.08%",
        width: "16.95%",
      },
      {
        id: "p3-b3",
        src: getImageKitUrl("/manga_art/cutouts/page3_box3.png", MANGA_TRANSFORM),
        alt: "And a lot more....",
        left: "83.59%",
        top: "10.14%",
        width: "11.17%",
      },
      {
        id: "p3-b4",
        src: getImageKitUrl("/manga_art/cutouts/page4_box4.png", MANGA_TRANSFORM),
        alt: "This feels right. I'm in.",
        left: "45.50%",
        top: "56.50%",
        width: "10.50%",
      },
    ],
  },
  {
    pageNumber: 4,
    baseImage: getImageKitUrl("/manga_art/manga_page4.png", MANGA_TRANSFORM),
    bubbles: [],
  },
];

export default function MangaStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload all base images and speech bubble cutouts into browser cache
    if (typeof window !== "undefined") {
      MANGA_PAGES.forEach((page) => {
        const img = new window.Image();
        img.src = page.baseImage;
        page.bubbles.forEach((b) => {
          const bImg = new window.Image();
          bImg.src = b.src;
        });
      });
    }

    if (!containerRef.current) return;

    // Execute scroll-scrub animations only on desktop viewports (>= 1024px)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const container = containerRef.current;
      if (!container) return;

      const slides = gsap.utils.toArray<HTMLElement>(".manga-slide");
      const allBubbles = gsap.utils.toArray<HTMLElement>(".manga-bubble");

      // Initial state: hide speech bubbles initially
      gsap.set(allBubbles, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });

      // Initial state: slide 0 at yPercent: 0, slides 1-3 positioned down at yPercent: 100
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          yPercent: i === 0 ? 0 : 100,
          opacity: 1,
          visibility: "visible",
        });
      });

      // Master pinned timeline:
      // end: "+=380%" provides snappy, fluid progression
      // scrub: 0.8 smooths out mouse wheel notches
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=380%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let current = 1;
            if (p >= 0.86) current = 4;
            else if (p >= 0.52) current = 3;
            else if (p >= 0.21) current = 2;

            const counter = document.getElementById("manga-page-counter");
            if (counter) counter.innerText = `PAGE ${current} / 4`;

            // Update interactive progress dots
            for (let i = 1; i <= 4; i++) {
              const dot = document.getElementById(`manga-dot-${i}`);
              if (dot) {
                if (i === current) {
                  dot.className = "w-5 h-1.5 rounded-full bg-[#FFA500] transition-all duration-300 shadow-[0_0_8px_#FFA500]";
                } else {
                  dot.className = "w-1.5 h-1.5 rounded-full bg-white/30 transition-all duration-300";
                }
              }
            }
          },
        },
      });

      // ----------------------------------------------------
      // PAGE 1: Speech bubbles pop in snappily
      // ----------------------------------------------------
      tl.to(".manga-bubble-p1-b1", {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      });
      tl.to(
        ".manga-bubble-p1-b2",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      // Brief comfortable hold to read Page 1 dialogue
      tl.to({}, { duration: 0.4 });

      // ----------------------------------------------------
      // SLIDE 1 -> 2: Constant smooth velocity (ease: "none")
      // Direct 1:1 scroll wheel control with no sudden speedups
      // ----------------------------------------------------
      tl.to(
        slides[0],
        {
          yPercent: -100,
          ease: "none",
          duration: 1.0,
        },
        "p1-to-p2"
      );
      tl.to(
        slides[1],
        {
          yPercent: 0,
          ease: "none",
          duration: 1.0,
        },
        "p1-to-p2"
      );

      // ----------------------------------------------------
      // PAGE 2: Speech bubbles pop in
      // ----------------------------------------------------
      tl.to(".manga-bubble-p2-b1", {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      });
      tl.to(
        ".manga-bubble-p2-b2",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      tl.to(
        ".manga-bubble-p2-b3",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      // Brief comfortable hold to read Page 2 dialogue
      tl.to({}, { duration: 0.4 });

      // ----------------------------------------------------
      // SLIDE 2 -> 3: Constant smooth velocity (ease: "none")
      // ----------------------------------------------------
      tl.to(
        slides[1],
        {
          yPercent: -100,
          ease: "none",
          duration: 1.0,
        },
        "p2-to-p3"
      );
      tl.to(
        slides[2],
        {
          yPercent: 0,
          ease: "none",
          duration: 1.0,
        },
        "p2-to-p3"
      );

      // ----------------------------------------------------
      // PAGE 3: Speech bubbles pop in
      // ----------------------------------------------------
      tl.to(".manga-bubble-p3-b1", {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      });
      tl.to(
        ".manga-bubble-p3-b2",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      tl.to(
        ".manga-bubble-p3-b3",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      tl.to(
        ".manga-bubble-p3-b4",
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );
      // Brief comfortable hold to read Page 3 dialogue
      tl.to({}, { duration: 0.4 });

      // ----------------------------------------------------
      // SLIDE 3 -> 4: Constant smooth velocity (ease: "none")
      // ----------------------------------------------------
      tl.to(
        slides[2],
        {
          yPercent: -100,
          ease: "none",
          duration: 1.0,
        },
        "p3-to-p4"
      );
      tl.to(
        slides[3],
        {
          yPercent: 0,
          ease: "none",
          duration: 1.0,
        },
        "p3-to-p4"
      );

      // ----------------------------------------------------
      // PAGE 4: Concise Finale Hold (Sunset Conclusion)
      // Concise hold lets user exit Page 4 quickly into next section
      // ----------------------------------------------------
      tl.to({}, { duration: 0.35 });

      // Refresh ScrollTrigger once DOM layout stabilizes
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(timer);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="manga-story"
      ref={containerRef}
      className="hidden md:block relative w-full h-screen bg-black text-white select-none overflow-hidden"
    >
      <h2 className="sr-only">CodeKrafters Origin Story & Community Mission</h2>

      {/* 4 FULL-SCREEN STACKED MANGA SLIDES */}
      {MANGA_PAGES.map((page, idx) => (
        <div
          key={page.pageNumber}
          className={`manga-slide manga-slide-${idx} absolute inset-0 w-full h-screen bg-black flex items-center justify-center overflow-hidden`}
          style={{
            zIndex: idx + 1,
          }}
        >
          {/* TRUE FULL-SCREEN 16:9 CINEMATIC CANVAS (ZERO BORDERS, ZERO PADDING) */}
          <div
            className="relative overflow-hidden bg-black flex items-center justify-center"
            style={{
              width: "min(100vw, calc(100vh * 16 / 9))",
              height: "min(100vh, calc(100vw * 9 / 16))",
            }}
          >
            {/* MANGA BASE ARTWORK */}
            <Image
              src={page.baseImage}
              alt={`Manga Page ${page.pageNumber}`}
              fill
              priority={false}
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain pointer-events-none select-none"
            />

            {/* INTERACTIVE POP-IN SPEECH BUBBLES */}
            {page.bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className={`manga-bubble manga-bubble-${bubble.id} absolute pointer-events-none select-none will-change-transform drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]`}
                style={{
                  left: bubble.left,
                  top: bubble.top,
                  width: bubble.width,
                  zIndex: 20,
                }}
              >
                <img
                  src={bubble.src}
                  alt={bubble.alt}
                  className="w-full h-auto block object-contain select-none"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SLEEK FLOATING MANGA PAGE INDICATOR WITH ACTIVE DOTS */}
      <div className="absolute bottom-6 right-8 z-50 flex items-center gap-3 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 text-xs font-mono tracking-widest pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <span className="text-[#FFA500] font-bold">MANGA</span>
        <span className="text-white/30">|</span>
        <div className="flex items-center gap-1.5">
          <span id="manga-dot-1" className="w-5 h-1.5 rounded-full bg-[#FFA500] shadow-[0_0_8px_#FFA500]" />
          <span id="manga-dot-2" className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span id="manga-dot-3" className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span id="manga-dot-4" className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
        <span className="text-white/30">|</span>
        <span id="manga-page-counter" className="text-white/90 font-medium">
          PAGE 1 / 4
        </span>
      </div>
    </section>
  );
}
