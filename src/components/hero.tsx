"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


import { getImageKitUrl } from "@/lib/imagekit";

interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  durationMs: number;
}

const SLIDES: HeroSlide[] = [
  {
    id: "core",
    src: "https://ik.imagekit.io/ysfz8n1no/public/hero-img/core.jpeg",
    alt: "CodeKrafters Core Team",
    durationMs: 3000,
  },
  {
    id: "group3",
    src: "https://ik.imagekit.io/ysfz8n1no/public/hero-img/group3.jpg",
    alt: "CodeKrafters Hackathon Team",
    durationMs: 3000,
  },
  {
    id: "img1501",
    src: "https://ik.imagekit.io/ysfz8n1no/public/hero-img/IMG_1501.DNG",
    alt: "CodeKrafters Launchpad Event",
    durationMs: 1500, // Stays for less time and displayed last
  },
];

const MILESTONES = [
  { value: 7, suffix: "", label: "DOMAINS" },
  { value: 150, suffix: "+", label: "MEMBERS" },
  { value: 10, suffix: "+", label: "EVENTS" },
  { value: 5, suffix: "L+", prefix: "₹", label: "BOUNTIES WON" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [counters, setCounters] = useState(MILESTONES.map(() => 0));
  const codekraftersRef = useRef<HTMLHeadingElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Auto slide progression with per-slide duration
  useEffect(() => {
    if (isPaused) return;
    const currentDuration = SLIDES[currentSlide]?.durationMs || 5000;
    const timer = setTimeout(nextSlide, currentDuration);
    return () => clearTimeout(timer);
  }, [nextSlide, isPaused, currentSlide]);

  // Fast smooth counter animation
  useEffect(() => {
    const duration = 1000;
    const steps = 25;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const factor = 1 - Math.pow(1 - progress, 3);
      setCounters(MILESTONES.map((m) => Math.round(m.value * factor)));
      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Reset all characters strictly back to original position
  const resetChars = useCallback(() => {
    const heading = codekraftersRef.current;
    if (!heading) return;
    const chars = heading.querySelectorAll(".char");
    gsap.killTweensOf(chars);
    gsap.to(chars, {
      y: 0,
      rotation: 0,
      color: "#FFFFFF",
      duration: 0.25,
      stagger: 0.01,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  // CODEKRAFTERS GSAP Character Hover (Desktop only with auto-reset)
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const heading = codekraftersRef.current;
    if (!heading) return;

    const chars = heading.querySelectorAll(".char");

    // Initial character entrance
    gsap.fromTo(
      chars,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.out",
      }
    );

    const enter = () => {
      if (window.innerWidth < 768) return;
      gsap.to(chars, {
        y: -14,
        rotation: gsap.utils.random(-6, 6, 1, true),
        color: "#F9B000",
        stagger: { each: 0.03, from: "center" },
        ease: "back.out(2)",
        duration: 0.35,
        onComplete: () => {
          // Guarantee it returns to position after animation completes
          resetChars();
        },
      });
    };

    heading.addEventListener("mouseenter", enter);
    heading.addEventListener("mouseleave", resetChars);

    return () => {
      heading.removeEventListener("mouseenter", enter);
      heading.removeEventListener("mouseleave", resetChars);
    };
  }, [resetChars]);

  const active = SLIDES[currentSlide];

  /* PREVIOUS BACKGROUND rotation on scroll (Desktop only to prevent mobile lag) */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const yellow = document.querySelector(".bg-layer-yellow");
    const black = document.querySelector(".bg-layer-black");

    if (!yellow || !black) return;

    const ctx = gsap.context(() => {
      gsap.to(yellow, {
        rotation: -8,
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
          fastScrollEnd: true,
        },
      });

      gsap.to(black, {
        rotation: 8,
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
          fastScrollEnd: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-0 sm:min-h-screen bg-[#08080A] text-white flex flex-col items-center justify-start overflow-hidden pt-32 sm:pt-40 pb-4 sm:pb-12 px-4 sm:px-6 lg:px-8 selection:bg-[#F9B000] selection:text-black"
    >
      {/* RESTORED PREVIOUS DYNAMIC ANGLED BACKGROUND WITH SCROLL ROTATION */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="bg-layer-yellow will-change-transform absolute top-[-18%] left-[-10%] w-[140%] h-[58%] bg-[#F9B000] rotate-[5deg] opacity-[0.15]" />
        <div className="bg-layer-black will-change-transform absolute top-[32%] left-[-10%] w-[150%] h-[50%] bg-[#111111] rotate-[-6deg] opacity-[0.45]" />
        {/* Subtle center amber glow to keep title illuminated */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[200px] sm:h-[350px] rounded-full blur-[40px] sm:blur-[130px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, #F9B000 0%, #E69500 50%, transparent 80%)",
          }}
        />
      </div>

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
        {/* TOP PILL BADGE (WITHOUT SRM RAMAPURAM) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-md shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#F9B000] animate-pulse" />
          <span className="text-white/80 font-mono text-[11px] sm:text-xs uppercase tracking-widest">
            CHAPTER 2025-26 • STUDENT DEVELOPER COLLECTIVE
          </span>
        </motion.div>

        {/* GIANT CLUB NAME HEADLINE (CLEAN & AUTO-RESET ON MOBILE TOUCH) */}
        <h1
          ref={codekraftersRef}
          onClick={resetChars}
          onTouchEnd={resetChars}
          onMouseLeave={resetChars}
          className="text-[clamp(2.1rem,8.2vw,8.5rem)] font-black tracking-tight leading-none text-white select-none whitespace-nowrap py-1 overflow-visible cursor-pointer"
          style={{ letterSpacing: "-0.03em" }}
          title="CodeKrafters"
        >
          {"CODEKRAFTERS".split("").map((char, i) => (
            <span
              key={i}
              className="char inline-block will-change-transform transition-colors"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* BIGGER BOLD TAGLINE (MUCH BIGGER FONT FOR BOTH MOBILE & DESKTOP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-1 max-w-3xl px-2 text-center"
        >
          <p className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F9B000] via-[#FFE082] to-[#F9B000] drop-shadow-[0_0_25px_rgba(249,176,0,0.35)] uppercase py-1">
            IT&apos;S MORE THAN A CLUB
          </p>
        </motion.div>
      </div>

      {/* WIDESCREEN CINEMATIC IMAGE CARD WITH TOUCH SWIPE */}
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/15 bg-[#0e0e12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] aspect-[4/4.8] sm:aspect-[16/9] lg:aspect-[21/10] touch-pan-y select-none"
        >
          {/* REAL CLUB SLIDESHOW IMAGES */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* LEFT NAVIGATION BUTTON */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#F9B000] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg active:scale-95 group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* RIGHT NAVIGATION BUTTON */}
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#F9B000] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg active:scale-95 group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>

      {/* MOBILE STATS COUNTER STRIP (7 DOMAINS • 150+ MEMBERS • 10+ EVENTS) */}
      <div className="grid sm:hidden grid-cols-3 gap-2 w-full max-w-sm mx-auto text-center mt-6 px-1">
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-[#FFA500] tracking-tight">
            {counters[0]}
          </div>
          <div className="text-[11px] font-bold tracking-wider text-white/80 uppercase mt-1 font-sans">
            DOMAINS
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-[#FFA500] tracking-tight">
            {counters[1]}+
          </div>
          <div className="text-[11px] font-bold tracking-wider text-white/80 uppercase mt-1 font-sans">
            MEMBERS
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-[#FFA500] tracking-tight">
            {counters[2]}+
          </div>
          <div className="text-[11px] font-bold tracking-wider text-white/80 uppercase mt-1 font-sans">
            EVENTS
          </div>
        </div>
      </div>

      {/* MILESTONES STATS STRIP (TABLET & DESKTOP) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden sm:grid relative z-10 w-full max-w-6xl grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8 sm:mt-12"
      >
        {MILESTONES.map((m, idx) => (
          <div
            key={m.label}
            className="rounded-2xl sm:rounded-3xl bg-[#0f0f12] border border-white/[0.08] hover:border-[#FFA500]/40 py-7 px-4 text-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FFA500] tracking-tight group-hover:scale-105 transition-transform">
              {m.prefix || ""}
              {counters[idx]}
              {m.suffix}
            </div>
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-white/70 uppercase mt-2.5 font-sans">
              {m.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}