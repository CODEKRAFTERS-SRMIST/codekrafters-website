"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function PresidentIntroRetro() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Horizontal Scroll Wheel Support
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only capture if they are scrolling predominantly vertically, translating it to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Prevent default vertical scrolling to allow horizontal snap
        // Note: Doing e.preventDefault() here can sometimes trap the user,
        // so we'll just let native snap scrolling handle it unless they are exactly inside it.
        // Actually, native touch/trackpad will scroll it fine horizontally. Let's just let CSS snap handle it.
      }
    };
    
    // Using standard CSS scroll snap is often better for a11y, but we can track active index
    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({
      left: container.clientWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="president"
      className="w-full min-h-screen bg-[#FFEFB4] overflow-hidden relative flex flex-col justify-center"
    >
      {/* Scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-row w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide relative z-10"
      >
        
        {/* President Slide */}
        <div className="w-screen flex-shrink-0 snap-center flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 min-h-screen">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative group w-full md:w-auto flex justify-center md:flex-shrink-0"
            >
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-[#0D0D0D] bg-[#FFF6D0] shadow-[4px_4px_0_#0D0D0D] sm:shadow-[8px_8px_0_#0D0D0D] transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-[6px_6px_0_#0D0D0D] sm:group-hover:shadow-[12px_12px_0_#0D0D0D] w-[85%] sm:w-[320px] md:w-[360px] lg:w-[400px]">
                <div className="relative w-full h-0 pb-[120%]">
                  <Image
                    src="/domain_pics/pres/Sanjay.jpeg" 
                    alt="Club President"
                    fill
                    className="object-cover rounded-xl sm:rounded-2xl saturate-90 contrast-110 brightness-95"
                  />
                </div>
              </div>

              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-6 bg-[#0D0D0D] text-[#FFEFB4] text-[9px] sm:text-xs px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider font-semibold rotate-6">
                Est. 2025
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-xl text-[#0D0D0D] space-y-4 sm:space-y-5 md:space-y-6 text-center md:text-left w-full"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight">
                Meet Our{" "}
                <span className="text-[#F2A516] underline decoration-[#0D0D0D] decoration-2 sm:decoration-3 md:decoration-4 underline-offset-2 sm:underline-offset-3 md:underline-offset-4">
                  President
                </span>
              </h2>

              <div className="bg-[#0D0D0D] text-[#FFEFB4] inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516] mx-auto md:mx-0">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wider">
                  SANJAY
                </h3>
              </div>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
                Guiding CodeKrafters with clarity, creativity, and conviction —{" "}
                <span className="text-[#F2A516] font-semibold">Sanjay</span> has shaped
                our community into one of SRM's most dynamic tech forces. From
                hackathons to innovation tracks, his retro-meets-modern leadership
                style defines our club's culture.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Vice President Slide */}
        <div className="w-screen flex-shrink-0 snap-center flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 min-h-screen">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative group w-full md:w-auto flex justify-center md:flex-shrink-0"
            >
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-[#0D0D0D] bg-[#FFF6D0] shadow-[4px_4px_0_#0D0D0D] sm:shadow-[8px_8px_0_#0D0D0D] transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-[6px_6px_0_#0D0D0D] sm:group-hover:shadow-[12px_12px_0_#0D0D0D] w-[85%] sm:w-[320px] md:w-[360px] lg:w-[400px]">
                <div className="relative w-full h-0 pb-[120%]">
                  <Image
                    src="/domain_pics/vp/Satya VP.png" 
                    alt="Club Vice President"
                    fill
                    className="object-cover rounded-xl sm:rounded-2xl saturate-90 contrast-110 brightness-95"
                  />
                </div>
              </div>

              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-6 bg-[#0D0D0D] text-[#FFEFB4] text-[9px] sm:text-xs px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider font-semibold -rotate-6">
                Est. 2025
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-xl text-[#0D0D0D] space-y-4 sm:space-y-5 md:space-y-6 text-center md:text-left w-full"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight">
                Meet Our{" "}
                <span className="text-[#F2A516] underline decoration-[#0D0D0D] decoration-2 sm:decoration-3 md:decoration-4 underline-offset-2 sm:underline-offset-3 md:underline-offset-4">
                  Vice President
                </span>
              </h2>

              <div className="bg-[#0D0D0D] text-[#FFEFB4] inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516] mx-auto md:mx-0">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wider">
                  SATYA
                </h3>
              </div>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
                Driving CodeKrafters' operations and strategy with dedication and foresight —{" "}
                <span className="text-[#F2A516] font-semibold">Satya</span> helps orchestrate 
                our success and scales our impact across the tech community, ensuring every 
                initiative reaches its highest potential.
              </p>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-[#0D0D0D] transition-all duration-300 ${
              activeIndex === index ? "bg-[#F2A516] scale-125" : "bg-[#FFF6D0] hover:bg-[#F2A516]/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        section {
          background: radial-gradient(
            circle at bottom right,
            #ffeeb0 0%,
            #ffe9a0 30%,
            #ffeeb4 100%
          );
          position: relative;
        }

        section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/paper-fibers.png");
          opacity: 0.25;
          pointer-events: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}