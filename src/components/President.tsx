"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Linkedin } from "lucide-react";

export default function PresidentIntroRetro() {

  return (
    <section
      id="president"
      className="w-full min-h-screen bg-[#FFEFB4] overflow-hidden relative flex flex-col justify-center"
    >
      {/* Stack container */}
      <div 
        className="flex flex-col w-full relative z-10 gap-16 sm:gap-24 py-16 sm:py-24"
      >
        
        {/* President Slide */}
        <div className="w-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
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
                Est. 2026
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

              <div className="flex items-center justify-center md:justify-start gap-3 mx-auto md:mx-0">
                <div className="bg-[#0D0D0D] text-[#FFEFB4] inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516]">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wider">
                    SANJAY
                  </h3>
                </div>
                <a 
                  href="https://www.linkedin.com/in/sanjay-ganesh-k-barade-675b38324/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#0D0D0D] p-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#F2A516] transition-all cursor-pointer"
                  title="Sanjay's LinkedIn"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2A516]" />
                </a>
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
        <div className="w-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
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
                Est. 2026
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

              <div className="flex items-center justify-center md:justify-start gap-3 mx-auto md:mx-0">
                <div className="bg-[#0D0D0D] text-[#FFEFB4] inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516]">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wider">
                    SATYA
                  </h3>
                </div>
                <a 
                  href="https://www.linkedin.com/in/satyalohith455" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#0D0D0D] p-2 rounded-md shadow-[2px_2px_0_#F2A516] sm:shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#F2A516] transition-all cursor-pointer"
                  title="Satya's LinkedIn"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2A516]" />
                </a>
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