"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ScrollTriggerBridge() {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;
    const timer = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
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
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}


