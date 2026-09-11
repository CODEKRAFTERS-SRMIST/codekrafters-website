"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Shield, Cpu, Code2, Sparkles, Globe, Users } from "lucide-react";

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

const DOMAINS_PILLS = [
  { name: "Web3 & Blockchain", icon: Globe },
  { name: "AI & Machine Learning", icon: Cpu },
  { name: "Cybersecurity", icon: Shield },
  { name: "Competitive Programming", icon: Code2 },
  { name: "Creatives & UI/UX", icon: Sparkles },
  { name: "Public Relations", icon: Users },
  { name: "Operations", icon: Terminal },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const allWords = gsap.utils.toArray<HTMLElement>(".about-word");

      gsap.fromTo(
        allWords,
        { opacity: 0.25, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "center 45%",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#070709] text-white py-24 sm:py-32 px-5 sm:px-10 lg:px-16 overflow-hidden border-t border-b border-white/[0.06]"
    >
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] rounded-full blur-[160px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(249,176,0,0.7) 0%, rgba(242,165,22,0.15) 50%, transparent 80%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col space-y-8 sm:space-y-12">
        {/* TOP BADGE */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F9B000] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/90 font-bold">
              ABOUT CODEKRAFTERS
            </span>
          </div>

          <span className="font-mono text-xs sm:text-sm text-white/50 tracking-wider hidden sm:inline">
            STUDENT DEVELOPER COLLECTIVE
          </span>
        </div>

        {/* HERO MANIFESTO TEXT */}
        <div className="w-full">
          <p
            ref={textRef}
            className="flex flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-2.5 sm:gap-y-4 text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.5rem] font-black tracking-tight leading-[1.2] sm:leading-[1.15]"
          >
            {PARAGRAPH_WORDS.map((w, idx) => (
              <span
                key={`${w.text}-${idx}`}
                className={`about-word inline-block will-change-transform ${
                  w.highlight
                    ? "text-[#F9B000] font-black drop-shadow-[0_0_25px_rgba(249,176,0,0.5)]"
                    : "text-white font-extrabold"
                }`}
              >
                {w.text}
              </span>
            ))}
          </p>
        </div>

        {/* 7 DOMAINS QUICK PILLS */}
        <div className="pt-4 sm:pt-6">
          <div className="text-white/40 font-mono text-xs uppercase tracking-widest mb-3">
            SPECIALIZED DOMAINS
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {DOMAINS_PILLS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#F9B000]/40 transition-all duration-300 text-xs sm:text-sm text-white/80 font-medium"
                >
                  <Icon className="w-3.5 h-3.5 text-[#F9B000]" />
                  <span>{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
