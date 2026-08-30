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
        const parsed: UserSession = JSON.parse(rawSession);
        setSession(parsed);
        findUserApplication(parsed.id, parsed.email);
      } else {
        // Stop loading state if no session
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
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



  const handleLogout = () => {
    setSession(null);
    setUserApp(null);
    setIsEditing(false);
    try {
      localStorage.removeItem("codekrafters_user_session");
      window.dispatchEvent(new Event("auth_change"));
    } catch (e) {}
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

      <main className="flex-1 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full my-6">
        {isLoading ? (
          /* State 1: Loading session data */
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
          </div>
        ) : !session ? (
          /* State 2: Unauthenticated -> Login Required prompt */
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0_#0D0D0D] max-w-lg w-full">
              <div className="w-16 h-16 bg-[#F2A516] rounded-full border-2 border-[#0D0D0D] flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#0D0D0D]">
                <svg className="w-8 h-8 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0D] tracking-tight mb-2">
                Authentication Required
              </h2>
              <p className="text-sm text-[#333333] font-bold mb-8">
                You need to log in to access the recruitment portal.
              </p>
              <button
                onClick={() => window.location.href = "/login?redirect=/join"}
                className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] py-3.5 px-6 rounded-full font-black text-sm uppercase tracking-wider shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] transition-all"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        ) : session.role === "ADMIN" ? (
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
