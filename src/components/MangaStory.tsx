"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const MANGA_PAGES: MangaPageData[] = [
  {
    pageNumber: 1,
    baseImage: "/manga_art/Who leaves a USB lying (page1).png",
    bubbles: [
      {
        id: "p1-b1",
        src: "/manga_art/cutouts/page1_box1.png",
        alt: "Who leaves a USB lying around?",
        left: "28.44%",
        top: "10.56%",
        width: "16.72%",
      },
      {
        id: "p1-b2",
        src: "/manga_art/cutouts/page1_box2.png",
        alt: "Okay...",
        left: "16.41%",
        top: "60.42%",
        width: "8.75%",
      },
    ],
  },
  {
    pageNumber: 2,
    baseImage: "/manga_art/page2.png",
    bubbles: [
      {
        id: "p2-b1",
        src: "/manga_art/cutouts/page2_box1.png",
        alt: "Wait... this is actually so much",
        left: "61.25%",
        top: "10.83%",
        width: "9.77%",
      },
      {
        id: "p2-b2",
        src: "/manga_art/cutouts/page2_box2.png",
        alt: "But where??",
        left: "87.73%",
        top: "16.39%",
        width: "9.77%",
      },
      {
        id: "p2-b3",
        src: "/manga_art/cutouts/page2_box3.png",
        alt: "Hope!!! I've found them",
        left: "14.38%",
        top: "67.50%",
        width: "13.98%",
      },
    ],
  },
  {
    pageNumber: 3,
    baseImage: "/manga_art/page3.png",
    bubbles: [
      {
        id: "p3-b1",
        src: "/manga_art/cutouts/page3_box1.png",
        alt: "So, you guys just... learn stuff??",
        left: "11.88%",
        top: "3.89%",
        width: "9.69%",
      },
      {
        id: "p3-b2",
        src: "/manga_art/cutouts/page3_box2.png",
        alt: "Nah.. we build projects, get internships, attend workshop and make friends",
        left: "58.67%",
        top: "2.08%",
        width: "16.95%",
      },
      {
        id: "p3-b3",
        src: "/manga_art/cutouts/page3_box3.png",
        alt: "And a lot more....",
        left: "83.59%",
        top: "10.14%",
        width: "11.17%",
      },
      {
        id: "p3-b4",
        src: "/manga_art/cutouts/page3_box4.png",
        alt: "This feels right. I'm in.",
        left: "45.55%",
        top: "56.81%",
        width: "9.53%",
      },
    ],
  },
  {
    pageNumber: 4,
    baseImage: "/manga_art/page4.png",
    bubbles: [],
  },
];

export default function MangaStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Execute scroll-pinning strictly on desktop viewports (>= 1024px)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const pageWrappers = gsap.utils.toArray<HTMLElement>(".manga-page-wrapper");

      pageWrappers.forEach((wrapper) => {
        const pinContainer = wrapper.querySelector<HTMLElement>(".manga-pin-container");
        const bubbles = wrapper.querySelectorAll<HTMLElement>(".manga-bubble");

        if (!pinContainer) return;

        // Hide speech bubbles initially
        if (bubbles.length > 0) {
          gsap.set(bubbles, {
            scale: 0,
            opacity: 0,
            transformOrigin: "center center",
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "+=120%",
            pin: pinContainer,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Sequence speech bubbles popping in on scroll
        if (bubbles.length > 0) {
          bubbles.forEach((bubble) => {
            tl.to(
              bubble,
              {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(2)",
              },
              "+=0.2"
            );
          });
          // Hold time to comfortably read the completed page before transition
          tl.to({}, { duration: 0.5 });
        } else {
          // Page 4: hold sunset illustration for reading before unpinning
          tl.to({}, { duration: 1.2 });
        }
      });

      // Refresh ScrollTrigger once DOM layout stabilizes
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      return () => clearTimeout(timer);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="manga-story"
      ref={containerRef}
      className="hidden lg:block relative w-full bg-[#070709] text-white select-none overflow-hidden"
    >
      {/* 4 SEQUENTIAL PINNED MANGA PAGES */}
      {MANGA_PAGES.map((page) => (
        <div
          key={page.pageNumber}
          className="manga-page-wrapper relative w-full h-[220vh]"
        >
          {/* PINNED CONTAINER - FILLS VIEWPORT COMPLETELY WITHOUT ANY DISTRACTING HEADERS */}
          <div className="manga-pin-container relative w-full h-screen flex items-center justify-center p-2 sm:p-4 bg-[#070709]">
            {/* ULTRA SCREEN-FITTING 16:9 MANGA FRAME */}
            <div
              className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-[0_12px_60px_rgba(0,0,0,0.95)] border border-white/[0.12] bg-[#030304]"
              style={{
                width: "min(96vw, calc((100vh - 24px) * 16 / 9))",
                height: "min(calc(100vh - 24px), calc(96vw * 9 / 16))",
              }}
            >
              {/* MANGA BASE ARTWORK */}
              <Image
                src={page.baseImage}
                alt={`Manga Page ${page.pageNumber}`}
                fill
                priority={page.pageNumber <= 2}
                sizes="(min-width: 1024px) 1600px, 100vw"
                className="object-cover pointer-events-none select-none"
              />

              {/* OVERLAY SPEECH BUBBLE CUTOUTS */}
              {page.bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className="manga-bubble absolute pointer-events-none select-none will-change-transform drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  style={{
                    left: bubble.left,
                    top: bubble.top,
                    width: bubble.width,
                  }}
                >
                  <img
                    src={bubble.src}
                    alt={bubble.alt}
                    className="w-full h-auto block object-contain select-none"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
