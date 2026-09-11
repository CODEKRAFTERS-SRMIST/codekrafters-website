"use client"

import React, { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<'loading' | 'prelanding' | 'main'>('loading');

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setStep('main'), 1000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (step === 'loading') {
    return (
      <div onClick={() => setStep('main')} className="cursor-pointer" title="Click to continue">
        <LoadingPage />
      </div>
    );
  }
  return <>{children}</>;
}
