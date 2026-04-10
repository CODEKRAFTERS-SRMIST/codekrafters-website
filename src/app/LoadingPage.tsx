"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,43,0.16),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.025),transparent_24%)]" />

      <div className="relative flex items-center justify-center">
        <motion.div
          aria-hidden="true"
          className="absolute h-52 w-52 rounded-full border border-[#F2B200]/12"
          animate={{ scale: [0.95, 1.06, 0.95], opacity: [0.28, 0.08, 0.28] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute h-40 w-40 rounded-full border border-[#F2B200]/18"
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute h-3 w-3 rounded-full bg-[#F2B200] shadow-[0_0_18px_rgba(242,178,0,0.9)]"
          animate={{
            rotate: 360,
            scale: [1, 1.35, 1],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 110px" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative h-36 w-36 md:h-48 md:w-48"
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
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

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="absolute top-full mt-8 text-lg md:text-2xl font-extrabold tracking-[0.2em] uppercase text-[#F2B200]"
        >
          CodeKrafters
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="absolute top-full mt-16 text-[10px] md:text-xs font-semibold tracking-[0.16em] uppercase text-[#F2F2F2]/85"
        >
          It&apos;s more than a club
        </motion.p>

      </div>
    </div>
  );
}
