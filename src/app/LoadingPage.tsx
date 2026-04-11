"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const scanLines = Array.from({ length: 10 }, (_, index) => ({
  id: `scan-line-${index}`,
  top: `${12 + index * 7}%`,
  delay: index * 0.14,
  width: `${64 + (index % 3) * 8}%`,
}));

const satellites = [
  { id: "sat-1", x: [0, 88, 0, -88, 0], y: [-88, 0, 88, 0, -88], delay: 0 },
  { id: "sat-2", x: [0, -88, 0, 88, 0], y: [88, 0, -88, 0, 88], delay: 0.5 },
  { id: "sat-3", x: [0, 68, 0, -68, 0], y: [68, 0, -68, 0, 68], delay: 0.25 },
  { id: "sat-4", x: [0, -68, 0, 68, 0], y: [-68, 0, 68, 0, -68], delay: 0.75 },
];

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#060606]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(242,178,0,0.22) 0%, rgba(242,178,0,0.08) 30%, transparent 62%), linear-gradient(145deg, #070707 0%, #0d0d0d 45%, #080808 100%)",
        }}
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(242,178,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,178,0,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full border border-[#F2B200]/35"
          animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.4, 0.78, 0.4] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute -inset-16 rounded-[22%] border border-[#FFE39D]/35"
          animate={{ rotate: [0, 360], opacity: [0.35, 0.72, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute -inset-24 rounded-[28%] border border-[#F2B200]/24"
          animate={{ rotate: [0, -360], scale: [0.96, 1.02, 0.96] }}
          transition={{ duration: 10.5, repeat: Infinity, ease: "linear" }}
        />

        {satellites.map((sat) => (
          <motion.span
            key={sat.id}
            aria-hidden="true"
            className="absolute h-2.5 w-2.5 rounded-full bg-[#FFE39D] shadow-[0_0_16px_rgba(255,227,157,0.95)]"
            animate={{
              x: sat.x,
              y: sat.y,
              opacity: [0.45, 1, 0.45],
              scale: [0.9, 1.35, 0.9],
            }}
            transition={{
              duration: 4.6,
              delay: sat.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {scanLines.map((line) => (
          <motion.span
            key={line.id}
            aria-hidden="true"
            className="absolute h-[1px] rounded-full bg-gradient-to-r from-transparent via-[#F2B200]/85 to-transparent"
            style={{ top: line.top, width: line.width }}
            animate={{ x: [-70, 70], opacity: [0, 0.75, 0] }}
            transition={{ duration: 2.2, delay: line.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative h-44 w-44 md:h-56 md:w-56"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(242,178,0,0.35))",
                  "drop-shadow(0 0 24px rgba(242,178,0,0.88))",
                  "drop-shadow(0 0 10px rgba(242,178,0,0.35))",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <Image
                src="/logo.png"
                alt="CodeKrafters logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="mt-4 text-xl md:text-3xl font-extrabold tracking-[0.2em] uppercase text-[#F2B200]"
        >
          CodeKrafters
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mt-1 whitespace-nowrap text-[10px] md:text-xs font-semibold tracking-[0.16em] uppercase text-[#F2F2F2]/80"
        >
          It&apos;s more than a club
        </motion.p>

        <div className="mt-4 h-1 w-36 overflow-hidden rounded-full bg-[#F2B200]/20">
          <motion.div
            className="h-full w-2/5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #F2B200, #FFE39D, #F2B200, transparent)",
            }}
            animate={{ marginLeft: ["-40%", "140%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
