"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WordToken {
  text: string;
  highlight?: boolean;
}

const PARAGRAPH_WORDS: WordToken[] = [
  { text: "We", highlight: true },
  { text: "are", highlight: true },
  { text: "not", highlight: true },
  { text: "just", highlight: true },
  { text: "another", highlight: true },
  { text: "college", highlight: true },
  { text: "club.", highlight: true },
  { text: "CodeKrafters" },
  { text: "is" },
  { text: "a" },
  { text: "student-led", highlight: true },
  { text: "developer", highlight: true },
  { text: "collective" },
  { text: "powering" },
  { text: "7", highlight: true },
  { text: "specialized", highlight: true },
  { text: "domains" },
  { text: "—" },
  { text: "shipping", highlight: true },
  { text: "real-world", highlight: true },
  { text: "software,", highlight: true },
  { text: "winning", highlight: true },
  { text: "national", highlight: true },
  { text: "hackathons,", highlight: true },
  { text: "and" },
  { text: "fostering" },
  { text: "engineering" },
  { text: "excellence." },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".about-word");

      // Set initial dimmed state for all words (composite-only, 60fps+)
      gsap.set(words, {
        opacity: 0.2,
        y: 6,
      });

      // Smooth scroll-driven illumination WITHOUT pinning/scroll-locking
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center 45%",
          scrub: 0.3,
          fastScrollEnd: true,
        },
      });

      // Words light up one by one smoothly as the user scrolls into view
      tl.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "power1.out",
      });

      // Subtle top progress bar tracking scroll progression through the section
      if (progressBarRef.current) {
        tl.to(
          progressBarRef.current,
          {
            scaleX: 1,
            ease: "none",
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-[75vh] py-20 sm:py-28 bg-[#070709] text-white flex flex-col justify-center items-center overflow-hidden border-t border-b border-white/[0.06] selection:bg-[#F9B000] selection:text-black"
    >
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[1100px] h-[250px] sm:h-[600px] rounded-full blur-[40px] sm:blur-[160px] opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(249,176,0,0.8) 0%, rgba(242,165,22,0.18) 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }}
        />
      </div>

      {/* TOP SCROLL PROGRESS STRIP */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 z-30">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[#F9B000] via-[#FFE082] to-[#F9B000] origin-left scale-x-0 shadow-[0_0_12px_rgba(249,176,0,0.8)]"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-10 lg:px-16 flex flex-col justify-center">
        {/* TOP BADGE */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 sm:pb-4 mb-6 sm:mb-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F9B000] animate-pulse shadow-[0_0_10px_#F9B000]" />
            <h2 className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#F9B000] font-bold m-0 p-0 inline">
              ABOUT CODEKRAFTERS
            </h2>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-white/50 tracking-wider hidden sm:inline">
            STUDENT DEVELOPER COLLECTIVE • SRMIST
          </span>
        </div>

        {/* HERO MANIFESTO TEXT — BIG TYPOGRAPHY FOR BOTH PC & MOBILE */}
        <div className="w-full">
          <p
            ref={textRef}
            className="flex flex-wrap gap-x-2.5 sm:gap-x-4 md:gap-x-6 gap-y-2 sm:gap-y-3.5 md:gap-y-5 text-2xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] font-black tracking-tight leading-[1.25] sm:leading-[1.12]"
          >
            {PARAGRAPH_WORDS.map((w, idx) => (
              <span
                key={`${w.text}-${idx}`}
                className={`about-word inline-block transition-colors ${
                  w.highlight
                    ? "text-[#F9B000] font-black drop-shadow-[0_0_28px_rgba(249,176,0,0.55)]"
                    : "text-white font-extrabold"
                }`}
              >
                {w.text}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
