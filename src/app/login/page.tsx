"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { LoginCard } from "@/components/join/LoginCard";
import { UserSession } from "@/types/join";

export default function LoginPage() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem("codekrafters_user_session");
      if (rawSession) {
        // If already logged in, redirect them
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");
        window.location.href = redirect || "/profile";
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    try {
      localStorage.setItem("codekrafters_user_session", JSON.stringify(newSession));
      window.dispatchEvent(new Event("auth_change"));
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");

      // Navigate based on role and redirect param
      if (newSession.role === "ADMIN") {
        window.location.href = "/join"; 
      } else {
        window.location.href = redirect || "/profile";
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen relative bg-[#FFEFB4] overflow-x-hidden flex flex-col pt-24 font-sans">
      {/* Paper Fiber Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 -z-10"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(13, 13, 13, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(13, 13, 13, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 w-full my-6">
        <div className="py-6 sm:py-12">
          <LoginCard onLoginSuccess={handleLoginSuccess} />
        </div>
      </main>
    </div>
  );
}
