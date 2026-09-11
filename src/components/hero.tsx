"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HeroSlide {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "core",
    src: "/group/core.jpeg",
    title: "Core Leadership 2025-26",
    subtitle: "7 Specialized Engineering & Creative Tracks",
    badge: "CORE TEAM",
    description:
      "The student leaders steering CodeKrafters across Web3, Cybersecurity, Full-Stack Dev, CP, Creatives, PR, and Operations.",
  },
  {
    id: "hackathons",
    src: "/group/group3.jpg",
    title: "Frontier Build Stations",
    subtitle: "EthDelhi & Arbitrum Winners",
    badge: "HACKATHONS",
    description:
      "Building overnight, shipping on stage, and bagging national bounties across major Web3 and open-source hackathons.",
  },
  {
    id: "community",
    src: "/group/CK_group.png",
    title: "150+ Active Krafters",
    subtitle: "United By Code & Culture",
    badge: "COMMUNITY",
    description:
      "Freshers to placement rockstars — collaborating across 7 domains to build production-ready products and open-source tools.",
  },
  {
    id: "bootcamps",
    src: "/group/group4.jpg",
    title: "Engineering Bootcamps",
    subtitle: "Hands-on Technical Sprints",
    badge: "WORKSHOPS",
    description:
      "Peer-led technical bootcamps, zero-to-one dev workshops, and live system design tear-downs to get industry-ready.",
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
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const codekraftersRef = useRef<HTMLHeadingElement | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto slide progression
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide, isPaused]);

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

  /* PREVIOUS BACKGROUND rotation on scroll */
  useEffect(() => {
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
          scrub: 1,
        },
      });

      gsap.to(black, {
        rotation: 8,
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full bg-[#08080A] text-white flex flex-col items-center justify-start overflow-hidden pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 selection:bg-[#F9B000] selection:text-black"
    >
      {/* RESTORED PREVIOUS DYNAMIC ANGLED BACKGROUND WITH SCROLL ROTATION */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="bg-layer-yellow absolute top-[-18%] left-[-10%] w-[140%] h-[58%] bg-[#F9B000] rotate-[5deg] opacity-[0.15]" />
        <div className="bg-layer-black absolute top-[32%] left-[-10%] w-[150%] h-[50%] bg-[#111111] rotate-[-6deg] opacity-[0.45]" />
        {/* Subtle center amber glow to keep title illuminated */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[130px] opacity-20"
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
          className="space-y-2 max-w-3xl px-2 text-center"
        >
          <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#F9B000] via-[#FFE082] to-[#F9B000] drop-shadow-[0_0_25px_rgba(249,176,0,0.35)] uppercase py-1">
            IT&apos;S MORE THAN A CLUB
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/60 font-normal max-w-xl mx-auto leading-relaxed">
            The premier student-led developer collective. 7 specialized domains
            shipping real software, winning national hackathons, and empowering
            the next generation of engineers.
          </p>
        </motion.div>
      </div>

      {/* WIDESCREEN CINEMATIC IMAGE CARD */}
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-white/15 bg-[#0e0e12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] aspect-[16/11] sm:aspect-[16/9] lg:aspect-[21/10]"
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
                alt={active.title}
                fill
                priority
                className="object-cover object-center"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20" />
            </motion.div>
          </AnimatePresence>

          {/* TOP RIGHT: SLIDE SELECTOR PILLS */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === idx
                      ? "w-6 h-2 bg-[#F9B000]"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-white/60 font-mono text-[10px] sm:text-xs ml-1.5">
                0{currentSlide + 1} / 0{SLIDES.length}
              </span>
            </div>

            {/* PREV / NEXT ARROWS */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                aria-label="Previous image"
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#F9B000] text-white hover:text-black border border-white/15 flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next image"
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#F9B000] text-white hover:text-black border border-white/15 flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BOTTOM OVERLAY: TITLE ALONE ON MOBILE (CLEAN & UNCLUTTERED) */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7 lg:p-10 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6">
            {/* EVENT TITLE (NAME OF EVENT ALONE ON MOBILE) */}
            <div className="space-y-1 max-w-lg">
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-[#F9B000]/20 border border-[#F9B000]/40 text-[#F9B000] font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                {active.badge}
              </span>
              <h3 className="text-white font-bold text-sm sm:text-lg md:text-xl drop-shadow-md">
                {active.title}
              </h3>
              <p className="hidden md:block text-white/70 text-xs sm:text-sm font-normal leading-relaxed line-clamp-2">
                {active.description}
              </p>
            </div>

            {/* ACTION BUTTONS (CLEANLY POSITIONED) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white text-black hover:bg-[#F9B000] transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg group"
              >
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span>Join The Squad</span>
              </Link>

              <a
                href="#domains"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all duration-300 font-semibold text-xs sm:text-sm tracking-wide"
              >
                <span>Explore Domains</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#F9B000]" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MILESTONES STATS STRIP (DESKTOP & TABLET ONLY - HIDDEN ON MOBILE AS REQUESTED) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden sm:grid relative z-10 w-full max-w-6xl grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8 sm:mt-12"
      >
        {MILESTONES.map((m, idx) => (
          <div
            key={m.label}
            className="rounded-2xl sm:rounded-3xl bg-[#0f0f12] border border-white/[0.08] hover:border-white/20 py-7 px-4 text-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight group-hover:text-[#F9B000] transition-colors">
              {m.prefix || ""}
              {counters[idx]}
              {m.suffix}
            </div>
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-white/50 uppercase mt-2.5 font-sans">
              {m.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}