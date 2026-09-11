"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
}

function ScrollTriggerBridge() {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    const calibrateLenis = () => {
      const isNarrow = window.innerWidth < 1024;
      const targetMultiplier = isNarrow ? 0.35 : 0.7;

      if (lenis.options) {
        lenis.options.wheelMultiplier = targetMultiplier;
      }
      const vs = (lenis as any).virtualScroll;
      if (vs && vs.options) {
        vs.options.wheelMultiplier = targetMultiplier;
      }

      lenis.resize();
      ScrollTrigger.refresh();
    };

    calibrateLenis();
    window.addEventListener("resize", calibrateLenis);

    const timer = setTimeout(calibrateLenis, 400);

    return () => {
      window.removeEventListener("resize", calibrateLenis);
      clearTimeout(timer);
    };
  }, [lenis]);

  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<"loading" | "prelanding" | "main">("loading");

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setStep("main"), 1000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (step === "loading") {
    return (
      <div onClick={() => setStep("main")} className="cursor-pointer" title="Click to continue">
        <LoadingPage />
      </div>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.7,
        virtualScroll: (data) => {
          if (typeof window !== "undefined") {
            const isNarrow = window.innerWidth < 1024;
            const isWheel = data.event.type.includes("wheel");

            if (isWheel && isNarrow) {
              // Smoothly scale down desktop mouse wheel delta when testing mobile viewport
              data.deltaY *= 0.45;
              data.deltaX *= 0.45;

              // Cap single runaway wheel burst so sections are never skipped
              const maxWheelDelta = 48;
              if (Math.abs(data.deltaY) > maxWheelDelta) {
                data.deltaY = Math.sign(data.deltaY) * maxWheelDelta;
              }
            }
          }
          return true;
        },
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}


