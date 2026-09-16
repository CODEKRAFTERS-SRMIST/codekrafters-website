"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { LoginCard } from "@/components/join/LoginCard";
import { UserSession } from "@/types/join";

export default function SignupPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  const getTargetUrl = (user: { role?: string }) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");
      if (redirect && !redirect.startsWith("/login") && !redirect.startsWith("/signup")) {
        return redirect;
      }
    } catch {}

    if (user.role === "PRESIDENT" || user.role === "VICE_PRESIDENT" || user.role === "DOMAIN_ADMIN") {
      return "/join";
    }
    return "/profile";
  };

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const isReauth = searchParams.get("reauth") === "true" || searchParams.get("force") === "true";
      if (isReauth) {
        localStorage.removeItem("codekrafters_user_session");
        window.dispatchEvent(new Event("auth_change"));
        return;
      }

      const rawSession = localStorage.getItem("codekrafters_user_session");
      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession);
          if (parsed?.id) {
            const target = getTargetUrl(parsed);
            router.replace(target);
            return;
          }
        } catch {}
      }
    } catch (e) {}

    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          try {
            localStorage.setItem("codekrafters_user_session", JSON.stringify(data.user));
          } catch {}
          const target = getTargetUrl(data.user);
          router.replace(target);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLoginSuccess = (newSession: UserSession) => {
    try {
      localStorage.setItem("codekrafters_user_session", JSON.stringify(newSession));
      window.dispatchEvent(new Event("auth_change"));
      const target = getTargetUrl(newSession);
      router.replace(target);
    } catch (e) {
      router.replace("/profile");
    }
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
          <LoginCard onLoginSuccess={handleLoginSuccess} defaultIsSignUp={true} />
        </div>
      </main>
    </div>
  );
}
