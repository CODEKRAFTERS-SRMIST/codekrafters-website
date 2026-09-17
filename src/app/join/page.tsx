"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { LoginCard } from "@/components/join/LoginCard";
import { ApplicationForm } from "@/components/join/ApplicationForm";
import { ApplicationStatusCard } from "@/components/join/ApplicationStatusCard";
import { AdminDashboard } from "@/components/join/AdminDashboard";
import { Application, UserSession } from "@/types/join";
import { fetchApplications } from "@/lib/api";

export default function JoinPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [userApp, setUserApp] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem("codekrafters_user_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed?.id) {
          setSession(parsed);
          findUserApplication(parsed.id, parsed.email);
        }
      }
    } catch {}

    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setSession(data.user);
          try {
            localStorage.setItem("codekrafters_user_session", JSON.stringify(data.user));
          } catch {}
          findUserApplication(data.user.id, data.user.email);
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
  }, []);

  const findUserApplication = async (userId: string, email: string) => {
    setIsLoading(true);
    try {
      const apps = await fetchApplications(userId, email);
      const found = apps.find(
        (a) => a.userId === userId || a.email.toLowerCase() === email.toLowerCase()
      );
      setUserApp(found || null);
    } catch (e) {
      console.error("Failed to load application:", e);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("codekrafters_user_session");
    } catch {}
    setSession(null);
    setUserApp(null);
    setIsEditing(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    window.dispatchEvent(new Event("auth_change"));
  };

  const handleApplicationSubmitted = (app: Application) => {
    setUserApp(app);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen relative bg-[#FFEFB4] overflow-x-hidden flex flex-col justify-between pt-24 font-sans">
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

      <main className="flex-1 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full my-6 pb-24">
        {isLoading ? (
          /* State 1: Loading session data */
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
          </div>
        ) : !session ? (
          /* State 2: Unauthenticated -> Direct in-place Login Card */
          <div className="py-6 sm:py-10">
            <LoginCard
              onLoginSuccess={(newSession) => {
                setSession(newSession);
                findUserApplication(newSession.id, newSession.email);
              }}
            />
          </div>
        ) : (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT" || session.role === "DOMAIN_ADMIN") ? (
          /* State 3: Admin Session -> Admin Panel */
          <div className="py-4">
            <AdminDashboard session={session} onLogout={handleLogout} />
          </div>
        ) : userApp && !isEditing ? (
          /* State 4: Logged in Applicant with submitted application */
          <div className="py-6 sm:py-10">
            <ApplicationStatusCard
              application={userApp}
              session={session}
              onEditRequested={() => setIsEditing(true)}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          /* State 5: Logged in Applicant submitting form */
          <div className="py-4 sm:py-8">
            <ApplicationForm
              session={session}
              existingApplication={userApp}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          </div>
        )}
      </main>
    </div>
  );
}
